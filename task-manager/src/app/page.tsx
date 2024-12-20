"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function Home() {
  const [newTask, setNewTask] = useState("");
  
  const utils = api.useUtils();
  const tasks = api.task.getAll.useQuery();
  
  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      setNewTask("");
      void utils.task.getAll.invalidate();
    },
  });

  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => {
      void utils.task.getAll.invalidate();
    },
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-purple-600">Task Manager</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createTask.mutate({ title: newTask })}
            className="flex-grow border-2 border-purple-200 focus:border-purple-400 focus:ring-0 rounded-lg p-2"
          />
          <button
            onClick={() => createTask.mutate({ title: newTask })}
            className="bg-teal-500 hover:bg-teal-600 text-white transition-colors duration-200 p-2 rounded-lg"
            disabled={createTask.isPending}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </button>
        </div>
        <ul className="space-y-3">
          {tasks.data?.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between bg-purple-50 rounded-lg p-3 transition-all duration-200 hover:shadow-md"
            >
              <span className="text-purple-800 break-all mr-4">{task.title}</span>
              <button
                onClick={() => deleteTask.mutate({ id: task.id })}
                className="text-teal-500 hover:text-teal-600 hover:bg-teal-100 transition-colors duration-200 p-2 rounded-lg"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
