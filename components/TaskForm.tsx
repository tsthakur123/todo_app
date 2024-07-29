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
  onSave: (task: Task) => void;
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

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">
        {task ? "Edit Task" : "Add Task"}
      </h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        className="w-full p-2 mb-2 border rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description"
        className="w-full p-2 mb-2 border rounded"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        {task ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
