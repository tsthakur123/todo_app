"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { Task } from "@/types";

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
    <div className="w-full h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">To-do List</h1>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={handleSearchChange}
          className="mb-4 p-2 px-4 border rounded-full"
        />
        <TaskForm task={currentTask} onSave={handleSave} />
        <TaskList
          tasks={filteredTasks}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
        />
      </div>
    </div>
  );
};

export default Home;
