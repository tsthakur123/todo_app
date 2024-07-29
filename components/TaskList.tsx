import { useState } from "react";
import { Task } from "@/types";

interface TaskListProps {
  tasks: Task[];
  onUpdate: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onUpdate,
  onDelete,
  onToggleComplete,
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`border p-4 mb-2 rounded ${
            task.completed ? "bg-green-100" : ""
          }`}
        >
          <h3 className="text-xl font-bold">{task.title}</h3>
          <button
            onClick={() => handleExpand(task.id)}
            className="text-blue-500"
          >
            {expandedId === task.id ? "Hide Details" : "Show Details"}
          </button>
          {expandedId === task.id && (
            <div>
              <p>{task.description}</p>
              <p className="text-sm text-gray-500">
                Last Updated:{" "}
                {task.lastUpdated
                  ? new Date(task.lastUpdated).toLocaleString()
                  : "No date available"}
              </p>
              <button
                onClick={() => onUpdate(task)}
                className="mt-2 p-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="mt-2 p-1 bg-red-500 text-white rounded ml-2"
              >
                Delete
              </button>
              <button
                onClick={() => onToggleComplete(task.id)}
                className="mt-2 p-1 bg-blue-500 text-white rounded ml-2"
              >
                {task.completed ? "Mark as Incomplete" : "Mark as Done"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
