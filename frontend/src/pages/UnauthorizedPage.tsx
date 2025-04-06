import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const UnauthorizedPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-6"
        >
          <svg
            className="w-24 h-24 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Oops! Access Denied
        </h1>

        <p className="text-gray-600 mb-6">
          Looks like you've wandered into a restricted area! 
          This is like trying to enter the VIP section without a pass. 
          Sorry, but this page is off-limits for your current role.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={handleGoBack}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </motion.div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Attempted to access:</p>
          <code className="block mt-2 p-2 bg-gray-100 rounded">
            {location.pathname}
          </code>
        </div>

        <div className="mt-8 text-xs text-gray-400">
          <p>Don't worry, even the best explorers sometimes get lost!</p>
          <p className="mt-2">🚀 Keep exploring within your authorized areas! 🎯</p>
        </div>
      </motion.div>
    </div>
  );
}; 