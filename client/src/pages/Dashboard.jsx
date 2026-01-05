import { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import toast from 'react-hot-toast';
import { requestNotificationPermission, checkReminders } from '../utils/reminderService';
import { getTasks as getAllTasks, getStats as getTaskStats } from '../utils/mockTasks';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);
  const [filters, setFilters] = useState({
    category: 'All',
    status: 'all',
  });

  const categories = ['All', 'Work', 'Personal', 'Shopping', 'Health', 'Other'];

  useEffect(() => {
    fetchTasks();
    fetchStats();
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  // Check for reminders every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkReminders(tasks);
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      const data = await getAllTasks();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch tasks');
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getTaskStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    if (filters.category !== 'All') {
      filtered = filtered.filter((task) => task.category === filters.category);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter((task) => task.status === filters.status);
    }

    setFilteredTasks(filtered);
  };

  const handleTaskAdded = (newTask) => {
    setTasks([newTask, ...tasks]);
    fetchStats();
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
    setEditTask(null);
    fetchStats();
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter((task) => task._id !== taskId));
    fetchStats();
  };

  const handleEditClick = (task) => {
    setEditTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.total}</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.completed}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.pending}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>
        </div>

        {/* Task Form */}
        <div className="mb-8">
          <TaskForm
            onTaskAdded={handleTaskAdded}
            editTask={editTask}
            onTaskUpdated={handleTaskUpdated}
            onCancel={() => setEditTask(null)}
          />
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                Filter by Category
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                Filter by Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div>
          <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">
            Your Tasks ({filteredTasks.length})
          </h2>
          {filteredTasks.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-md text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No tasks found. Add your first task above!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onTaskDeleted={handleTaskDeleted}
                  onTaskUpdated={handleTaskUpdated}
                  onEditClick={handleEditClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
