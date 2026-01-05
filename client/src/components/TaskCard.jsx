import toast from 'react-hot-toast';
import { updateTask, deleteTask as deleteTaskService } from '../utils/mockTasks';

const TaskCard = ({ task, onTaskDeleted, onTaskUpdated, onEditClick }) => {
  const handleToggleStatus = async () => {
    try {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending';
      const updated = await updateTask(task._id, { ...task, status: newStatus });
      toast.success(
        `Task marked as ${newStatus === 'completed' ? 'complete' : 'pending'}!`
      );
      onTaskUpdated(updated);
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTaskService(task._id);
        toast.success('Task deleted successfully!');
        onTaskDeleted(task._id);
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const categoryColors = {
    Work: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Personal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Shopping: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    Health: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 ${
        task.status === 'completed'
          ? 'border-green-500 opacity-75'
          : 'border-primary-500'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3
          className={`text-lg font-semibold ${
            task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'dark:text-gray-100'
          }`}
        >
          {task.title}
        </h3>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            categoryColors[task.category]
          }`}
        >
          {task.category}
        </span>
      </div>

      {task.description && (
        <p
          className={`text-gray-600 dark:text-gray-300 text-sm mb-3 ${
            task.status === 'completed' ? 'line-through' : ''
          }`}
        >
          {task.description}
        </p>
      )}

      {task.reminderTime && (
        <p className="text-xs text-orange-600 dark:text-orange-400 mb-2">
          🔔 Reminder: {new Date(task.reminderTime).toLocaleString()}
        </p>
      )}

      <div className="flex justify-between items-center">
        <span
          className={`text-xs px-2 py-1 rounded ${
            task.status === 'completed'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}
        >
          {task.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
        </span>

        <div className="flex gap-2">
          <button
            onClick={handleToggleStatus}
            className={`px-3 py-1 text-sm rounded transition ${
              task.status === 'pending'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            {task.status === 'pending' ? 'Complete' : 'Undo'}
          </button>
          <button
            onClick={() => onEditClick(task)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded transition"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded transition"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default TaskCard;
