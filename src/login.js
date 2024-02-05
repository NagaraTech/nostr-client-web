import React from 'react';

const Login = ({onClose}) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-200 flex items-center justify-center h-screen">
          <div className="relative bg-white p-8 rounded-t-lg shadow-lg w-64">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 11.414l4.95 4.95a1 1 0 001.415-1.415L11.414 10l4.95-4.95a1 1 0 00-1.415-1.414L10 8.586 5.05 3.636A1 1 0 003.636 5.05L8.586 10l-4.95 4.95a1 1 0 101.415 1.415L10 11.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="flex items-center justify-center mb-4">
              <img
                src="avatar.png" // 请替换为实际的头像图片路径
                alt="Avatar"
                className="w-16 h-16 rounded-full"
              />
            </div>
            <input
              type="text"
              className="w-full px-4 py-2 mb-4 bg-gray-300 text-black placeholder-black rounded"
              placeholder="please input pubstr"
            />
            <button
              className="w-full px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
              onClick={(e) => e.stopPropagation()}
            >
              Login
            </button>
          </div>
        </div>
      );
};

export default Login;