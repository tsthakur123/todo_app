import { useState, useEffect } from "react";

interface Task {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
  lastUpdated?: string;
}

interface TaskFormProps {
  task?: Task | null;
  onSave: any;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: task?.id,
      title,
      description,
      completed: task?.completed || false,
    });
    setTitle("");
    setDescription("");
  };

  const isDisabled = !title.trim() || !description.trim();

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-6 bg-zinc-900 rounded-lg text-white">
      <h2 className="text-lg font-bold mb-2">
        {task ? "Edit Task" : "Add Task"}
      </h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        className="w-full p-2 mb-2 border rounded text-black"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description"
        className="w-full p-2 mb-2 border rounded text-black"
      />
      <button
        type="submit"
        disabled={isDisabled}
        className={`p-2 px-4 ${isDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"} transition-all text-white rounded-full`}
      >
        {task ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
