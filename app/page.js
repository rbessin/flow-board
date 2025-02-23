"use client";
import Todo from "./components/Todo";
import Whiteboard from "./components/Whiteboard";

export default function Home() {

  return (
    <main className="bg-gray-700 min-h-screen p-4">
      <nav className="bg-rose-900 p-4 mb-4 rounded border-4 border-rose-800">
        <h1 className="text-2xl text-white">Flow Board</h1>
      </nav>
      <div className="flex gap-4">
        <Todo />
        <Whiteboard />
      </div>
    </main>
  );
}
