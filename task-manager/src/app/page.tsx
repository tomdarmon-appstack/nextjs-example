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
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#1a1a1a] to-[#000000] text-white">
      <div className="container flex flex-col items-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Task Manager
        </h1>

        <div className="w-full max-w-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createTask.mutate({ title: newTask });
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="New task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="w-full rounded-md bg-white/10 px-4 py-2 text-white"
            />
            <button
              type="submit"
              className="rounded-md bg-white/10 px-4 py-2 font-semibold hover:bg-white/20"
              disabled={createTask.isPending}
            >
              Add
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-4">
            {tasks.data?.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-md bg-white/10 px-4 py-2"
              >
                <span>{task.title}</span>
                <button
                  onClick={() => deleteTask.mutate({ id: task.id })}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
