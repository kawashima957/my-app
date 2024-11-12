'use client';

import { useEffect, useState } from 'react';
import { generateClient } from '@aws-amplify/api';
import { listTodos } from '@/graphql/queries';
import { Amplify } from 'aws-amplify';
import awsmobile from '@/aws-exports';

Amplify.configure(awsmobile);

export default function Home() {
  const client = generateClient();
  const [todos, setTodos] = useState<{ id: string; name: string; description: string }[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const result = await client.graphql({ query: listTodos });
        console.log(result);
        if (result.data.listTodos) {
          const list = result.data.listTodos.items as Array<{ id: string; name: string; description: string }>;
          setTodos(list);
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">This is list page!</h1>
        <ul>
          {todos.map(todo => (
            <li key={todo.id}>
              <h2>{todo.name}</h2>
              <p>{todo.description}</p>
            </li>
          ))}
        </ul>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}