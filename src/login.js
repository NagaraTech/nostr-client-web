import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 在这里处理登录逻辑
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (

    <div>

      <head>
        <title>DAO Voting Interface</title>
        <script src="https://unpkg.com/react/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
        <style>
          {`
     body {
        font-family: 'Inter', sans-serif;
    }
    .search-icon {
        position: absolute;
        margin-left: 10px;
        margin-top: 12px;
        color: #9CA3AF;
    }
    .search-input {
        padding-left: 40px;
    }
    .progress-bar {
        background-color: #E5E7EB;
        border-radius: 9999px;
        height: 8px;
        width: 100%;
    }
    .progress {
        background-color: #10B981;
        border-radius: 9999px;
        height: 8px;
        width: 35.7%;
    }

    
    `}
        </style>
      </head>

      <header className="flex justify-between items-center mb-8 p-4 bg-white shadow rounded">

        <Link to="/">  <a>
          <img src="./logo.png" alt="Logo" className="h-8" ></img>
        </a></Link>

        <div className="flex justify-end">


          {/* <button> <Link to="/newvote"> New vote </Link></button>




          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-8"

          >
            Open Card
          </button> */}



        </div>

      </header>



      <div>
        <div>
          <div className="flex items-center justify-center h-screen">
            <div className="bg-white rounded-lg p-20 w-800">
              <img
                src="https://snort.social/nostrich_512.png"
                width="48"
                height="48"
                className="rounded-full mx-auto mb-4"
                alt="Avatar"
              />
              <h1 className="text-xl font-bold text-center">Sign In</h1>
              <form className="flex flex-col gap-4 mt-4">
                <input
                  type="text"
                  placeholder="nsec, npub, nip-05, hex, mnemonic"
                  className="bg-gray-200 rounded-full py-2 px-28" // Increased px value to double the width
                  value=""
                />
                <button
                  type="button"
                  className="bg-orange-500 text-white rounded-full py-2 px-4"
                >
                  Login
                </button>
              </form>
              <div className="flex flex-col items-center mt-4">
                <a href="/login/sign-up">Don't have an account?</a>
              </div>
            </div>
          </div>
        </div>
      </div>



    </div>

  );
};

export default Login;