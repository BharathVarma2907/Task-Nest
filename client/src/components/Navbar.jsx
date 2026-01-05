import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getUpcomingReminders } from '../utils/reminderService';
import { getTasks } from '../utils/mockTasks';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [upcomingReminders, setUpcomingReminders] = useState([]);

  // Initialize dark mode on mount
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
                   (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);

  // Fetch upcoming reminders
  useEffect(() => {
    if (user) {
      fetchReminders();
      // Refresh reminders every 5 minutes
      const interval = setInterval(fetchReminders, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchReminders = async () => {
    try {
      const data = await getTasks();
      const reminders = getUpcomingReminders(data);
      setUpcomingReminders(reminders);
    } catch (error) {
      console.error('Failed to fetch reminders');
    }
  };

  // Toggle dark mode
  const toggleDarkMode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (document.documentElement.classList.contains('dark')) {
      // Switch to light mode
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      // Switch to dark mode
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown') && !event.target.closest('.reminders-dropdown')) {
        setShowProfileDropdown(false);
        setShowReminders(false);
      }
    };

    if (showProfileDropdown || showReminders) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProfileDropdown, showReminders]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowProfileDropdown(false);
  };

  // Format date for user joined
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={user ? '/dashboard' : '/'} className="flex items-center">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                🗂️ TaskNest
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>

                {/* Reminders Button */}
                <div className="relative reminders-dropdown">
                  <button
                    onClick={() => setShowReminders(!showReminders)}
                    className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium flex items-center relative"
                    title="Reminders"
                  >
                    🔔
                    {upcomingReminders.length > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {upcomingReminders.length}
                      </span>
                    )}
                  </button>
                  {showReminders && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-700 rounded-md shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
                      <div className="px-4 py-2 border-b dark:border-gray-600">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Upcoming Reminders (24h)</h3>
                      </div>
                      {upcomingReminders.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          No upcoming reminders
                        </div>
                      ) : (
                        <div className="divide-y dark:divide-gray-600">
                          {upcomingReminders.map((task) => (
                            <div key={task._id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600">
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{task.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(task.reminderTime).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Dark Mode Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const html = document.documentElement;
                    if (html.classList.contains('dark')) {
                      html.classList.remove('dark');
                      localStorage.setItem('theme', 'light');
                      setDarkMode(false);
                    } else {
                      html.classList.add('dark');
                      localStorage.setItem('theme', 'dark');
                      setDarkMode(true);
                    }
                  }}
                  className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer border border-gray-300 dark:border-gray-600"
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>

                {/* Profile Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <span>👤</span>
                    <span>{user.name}</span>
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-700 rounded-md shadow-lg py-2 z-50">
                      <div className="px-4 py-3 border-b dark:border-gray-600">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Profile Information</p>
                      </div>
                      <div className="px-4 py-3 space-y-2">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Date Joined</p>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{formatDate(user.createdAt)}</p>
                        </div>
                      </div>
                      <div className="border-t dark:border-gray-600 px-4 py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
