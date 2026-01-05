import { useState } from 'react';
import toast from 'react-hot-toast';
import { createTask, updateTask as updateTaskService } from '../utils/mockTasks';

const TaskForm = ({ onTaskAdded, editTask, onTaskUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: editTask?.title || '',
    description: editTask?.description || '',
    category: editTask?.category || 'Other',
    reminderTime: editTask?.reminderTime ? new Date(editTask.reminderTime).toISOString().slice(0, 16) : '',
  });

  const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    try {
      if (editTask) {
        const updated = await updateTaskService(editTask._id, formData);
        toast.success('Task updated successfully!');
        onTaskUpdated(updated);
      } else {
        const created = await createTask(formData);
        toast.success('Task added successfully!');
        onTaskAdded(created);
      }

      setFormData({ title: '', description: '', category: 'Other', reminderTime: '' });
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">
        {editTask ? 'Edit Task' : 'Add New Task'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description (optional)"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
            Reminder Time (Optional)
          </label>
          <input
            type="datetime-local"
            name="reminderTime"
            value={formData.reminderTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded transition"
          >
            {editTask ? 'Update Task' : 'Add Task'}
          </button>
          {editTask && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
