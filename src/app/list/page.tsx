'use client';

import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import awsmobile from '../../aws-exports';
import { listTodos } from '../../graphql/queries';
import { createTodo, deleteTodo } from '@/graphql/mutations';
import { Todo } from '@/API';

Amplify.configure(awsmobile);
const API = generateClient();

export default function Home() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState({ name: '', description: '' });
  
    useEffect(() => {
      const fetchTodos = async () => {
        try {
          const result = await API.graphql({ query: listTodos });
          const query = result.data;
          if (query.listTodos) {
            const list = query.listTodos.items;
            setTodos(list);
          }
        } catch (error) {
          console.error('Error fetching todos:', error);
        }
      };
  
      fetchTodos();
    }, []);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNewTodo({ ...newTodo, [name]: value });
    };
  
    const addTodo = async () => {
      if (!newTodo.name.trim() || !newTodo.description.trim()) {
        console.error('Name and description cannot be empty.');
        return;
      }

      try {
        const result = await API.graphql({
          query: createTodo,
          variables: { input: newTodo }
        });
        const addedTodo = result.data.createTodo;
        if (addedTodo) {
          setTodos([...todos, addedTodo]);
          setNewTodo({ name: '', description: '' });
        }
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    };

    const removeTodo = async (id: string) => {
      try {
        await API.graphql({
          query: deleteTodo,
          variables: { input: { id } }
        });
        setTodos(todos.filter(todo => todo.id !== id));
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    };
  
    return (
      <div>
        <h1>Todo List</h1>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <strong>{todo.name}</strong>: {todo.description}
              <button onClick={() => removeTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <div>
          <h2>Add New Todo</h2>
          <input
            type="text"
            name="name"
            value={newTodo.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
          <input
            type="text"
            name="description"
            value={newTodo.description}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <button onClick={addTodo}>Add Todo</button>
        </div>
      </div>
    );
  }