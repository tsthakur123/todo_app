"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { Task } from "@/types";
import { SparklesCore } from "@/components/ui/sparkles";

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const loadTasks = async () => {
      const response = await axios.get("/api/tasks");
      setTasks(response.data);
    };

    loadTasks();
  }, []);

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [searchParams]);

  const handleSave = async (task: Task) => {
    if (task.id) {
      const updatedTask = { ...task, lastUpdated: new Date().toISOString() };
      await axios.put(`/api/tasks?id=${task.id}`, updatedTask);
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } else {
      const response = await axios.post("/api/tasks", {
        ...task,
        lastUpdated: new Date().toISOString(),
      });
      setTasks([...tasks, response.data]);
    }
    setCurrentTask(null);
  };

  const handleUpdate = (task: Task) => setCurrentTask(task);

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/tasks?id=${id}`);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleToggleComplete = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      const updatedTask = {
        ...task,
        completed: !task.completed,
        lastUpdated: new Date().toISOString(),
      };
      await axios.put(`/api/tasks?id=${id}`, updatedTask);
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    router.push(`/?search=${value}`);
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

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
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={handleSearchChange}
              className="mb-4 p-2 px-4 border rounded-full"
            />
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
