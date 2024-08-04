// app/page.tsx
"use client";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { Task } from "@/types";
import { SparklesCore } from "@/components/ui/sparkles";
import Search from "@/components/Search";

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  // Load tasks from local storage
  useEffect(() => {
    const loadTasks = () => {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    };

    loadTasks();
  }, []);

  // Save tasks to local storage
  const saveTasksToLocalStorage = (tasks: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const handleSave = (task: Task) => {
    const updatedTasks = task.id
      ? tasks.map((t) => (t.id === task.id ? task : t))
      : [...tasks, { ...task, id: new Date().getTime() }];

    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    setCurrentTask(null);
  };

  const handleUpdate = (task: Task) => setCurrentTask(task);

  const handleDelete = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleToggleComplete = (id: number) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };
  
  const handleFilteredTasks = (filteredTasks: Task[]) => {
    setFilteredTasks(filteredTasks);
  };

  return (
    <div className="w-full min-h-screen bg-black">
      <div className="w-full p-4">
        <div className="h-18 w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
          <h1 className="md:text-4xl text-3xl lg:text-4xl font-bold text-center text-white relative z-20">
            To-do List
          </h1>
          <div className="w-full h-40 relative">
            {/* Gradients */}
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

            {/* Core component */}
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />

            {/* Radial Gradient to prevent sharp edges */}
            <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
          </div>
          <Suspense>
            <Search tasks={tasks} onFilteredTasks={handleFilteredTasks} />
          </Suspense>
          <TaskForm task={currentTask} onSave={handleSave} />
          <TaskList
            tasks={filteredTasks}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
