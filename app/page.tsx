"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

type Task = {
  _id: string;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setTasks)
      .catch(() => setError("Could not load tasks"))
      .finally(() => setLoading(false));
  }, []);

  async function request(url: string, method: string, body?: object) {
    setError("");
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body && JSON.stringify(body),
    });
    if (!res.ok) {
      setError("Something went wrong, please try again");
      return null;
    }
    return res.status === 204 ? true : res.json();
  }

  async function addTask(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const task = await request("/api/tasks", "POST", { title });
    if (task) {
      setTasks([task, ...tasks]);
      setTitle("");
    }
  }

  async function updateTask(id: string, changes: Partial<Task>) {
    const updated = await request(`/api/tasks/${id}`, "PUT", changes);
    if (updated) {
      setTasks(tasks.map((t) => (t._id === id ? updated : t)));
    }
    return updated;
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editingId || !editTitle.trim()) return;

    if (await updateTask(editingId, { title: editTitle })) {
      setEditingId(null);
    }
  }

  async function deleteTask(id: string) {
    if (await request(`/api/tasks/${id}`, "DELETE")) {
      setTasks(tasks.filter((t) => t._id !== id));
    }
  }

  function startEdit(task: Task) {
    setEditingId(task._id);
    setEditTitle(task.title);
  }

  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Manager</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {tasks.length} tasks, {remaining} remaining
          </p>
        </div>
        <Link href="/github" className="mt-2 shrink-0 text-sm font-medium text-blue-600 hover:underline">
          GitHub Search &rarr;
        </Link>
      </div>

      <form onSubmit={addTask} className="mt-6 flex flex-col gap-2 sm:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 rounded-lg border border-zinc-300 bg-transparent px-4 py-2.5 outline-none focus:border-blue-500 dark:border-zinc-700"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Add Task
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {loading ? (
        <p className="mt-8 text-center text-zinc-500">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="mt-8 text-center text-zinc-500">No tasks yet. Add one above.</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-800"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => updateTask(task._id, { completed: !task.completed })}
                className="h-5 w-5 shrink-0 cursor-pointer accent-blue-600"
              />

              {editingId === task._id ? (
                <form onSubmit={saveEdit} className="flex flex-1 flex-wrap gap-2">
                  <input
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && setEditingId(null)}
                    className="min-w-0 flex-1 rounded border border-zinc-300 bg-transparent px-2 py-1 outline-none focus:border-blue-500 dark:border-zinc-700"
                  />
                  <button type="submit" className="text-sm font-medium text-blue-600 hover:underline">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="text-sm text-zinc-500 hover:underline"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <span
                    className={`flex-1 break-words ${task.completed ? "text-zinc-400 line-through" : ""}`}
                  >
                    {task.title}
                  </span>
                  <button
                    onClick={() => startEdit(task)}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-sm font-medium text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
