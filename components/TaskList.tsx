import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Task } from "@/types";
// import { CloseIcon } from "@/components/ExpandableCardDemo"; // Adjust the path as needed

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

  const handleEdit = (task: Task) => {
    onUpdate(task);
    setExpandedId(null); // Close the expanded tab after updating
  };

  const handleDelete = (id: number) => {
    onDelete(id);
    setExpandedId(null); // Close the expanded tab after deleting
  };

  const handleToggleComplete = (id: number) => {
    onToggleComplete(id);
    setExpandedId(null); // Close the expanded tab after toggling completion
  };

  return (
    <div className="w-full">
      <AnimatePresence>
        {expandedId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-10 flex justify-center items-center"
          >
            <motion.div
              layoutId={`task-${expandedId}`}
              className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative p-4">
                <button
                  onClick={() => setExpandedId(null)}
                  className="absolute top-2 right-2 bg-white rounded-full p-2"
                >
                  <CloseIcon />
                </button>
                {tasks.find((task) => task.id === expandedId) && (
                  <>
                    <h3 className="text-xl font-bold mb-2">
                      {tasks.find((task) => task.id === expandedId)?.title}
                    </h3>
                    <p className="text-gray-700 mb-2">
                      {
                        tasks.find((task) => task.id === expandedId)
                          ?.description
                      }
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Last Updated:{" "}
                      {tasks.find((task) => task.id === expandedId)?.lastUpdated
                        ? new Date(
                            tasks.find((task) => task.id === expandedId)!
                              .lastUpdated || ""
                          ).toLocaleString()
                        : "No date available"}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleEdit(
                            tasks.find((task) => task.id === expandedId)!
                          )
                        }
                        className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expandedId!)}
                        className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleToggleComplete(expandedId!)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      >
                        {tasks.find((task) => task.id === expandedId)?.completed
                          ? "Mark as Incomplete"
                          : "Mark as Done"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {tasks.map((task) => (
        <motion.div
          key={task.id}
          layoutId={`task-${task.id}`}
          onClick={() => handleExpand(task.id)}
          className={`p-4 hover:px-3 mb-2 mx-4 hover:mx-3 rounded transition-all cursor-pointer ${
            task.completed
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-800 hover:bg-blue-600"
          }`}
        >
          <h3 className="text-xl font-bold text-white">{task.title}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleExpand(task.id);
            }}
            className="text-blue-300"
          >
            {expandedId === task.id ? "Hide Details" : "Show Details"}
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default TaskList;

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
