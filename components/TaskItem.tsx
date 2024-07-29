import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  lastUpdated: string;
}

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 onClick={toggleExpand} className="cursor-pointer">
        {task.title}
      </h3>
      {expanded && (
        <div>
          <p>{task.description}</p>
          <p>Last Updated: {new Date(task.lastUpdated).toLocaleString()}</p>
          <button onClick={() => onUpdate(task)} className="px-2 py-1 text-white bg-green-500 rounded">
            Edit
          </button>
          <button onClick={() => onDelete(task.id)} className="px-2 py-1 ml-2 text-white bg-red-500 rounded">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
