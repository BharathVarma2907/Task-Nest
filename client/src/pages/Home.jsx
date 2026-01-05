import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">TaskNest</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A simple yet powerful web app to help you organize your work
            efficiently. Manage tasks, track progress, and stay productive!
          </p>

          <div className="flex justify-center gap-4 mb-16">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-white hover:bg-gray-50 text-primary-600 font-bold py-3 px-8 rounded-lg text-lg border-2 border-primary-600 transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold mb-2">Simple Sign-in</h3>
              <p className="text-gray-600">
                Create a local demo account in seconds — no backend needed
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-gray-600">
                Add, edit, delete, and organize tasks by category and status
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your productivity with task statistics and filters
              </p>
            </div>
          </div>

          <div className="mt-16 bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Core Features</h2>
            <ul className="text-left space-y-2">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Local signup and login for a seamless demo experience
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Add new tasks with title, description, and category
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Mark tasks as complete or pending
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Filter tasks by category or status
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Clean and responsive Tailwind CSS design
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Fast React + Vite frontend you can deploy anywhere
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
