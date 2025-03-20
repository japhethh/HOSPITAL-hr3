import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import backgroundImg from '../../assets/Nodado.jpg';  
import Logo from '../../assets/Nodado.jfif'

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const urlAPI = import.meta.env.VITE_API_URL

  useEffect(() => {
    // CHECK IF ALREADY LOGGED IN
    const verify = async () => {
      try{
        const response = await axios.get(`${urlAPI}/auth-api/protected`,{
          withCredentials: true
        })

        if(response){
          navigate('/dashboard/overview')
        }
      }
      catch(error){
        console.log(error.response)
      }
    }

    verify()
  }, [])

  const handleLogin = (e) => {
    e.preventDefault();
    
    // POST request to the backend
    axios.post(`${urlAPI}/auth-api/login`, { username, password }, { withCredentials: true })
      .then(response => {
        if (response.data.success) {
          // Store the JWT token in localStorage
          localStorage.setItem('token', response.data.token);
          // Redirect to the dashboard after successful login
          navigate('/dashboard');
        }
      })
      .catch(error => {
        console.error('Login error:', error)
        if(error.response){
          setError(error.response.data.message)
        }
      });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left section for logo and login */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-8">
        {/* Logo */}
        <div className="mb-6">
          <img src={Logo} alt="Finance Department" className="h-23 w-auto" />
          <h1 className="text-2xl font-bold mb-4">Finance Department</h1>
        </div>

        {/* Sign In Form */}
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <form onSubmit={handleLogin} className="space-y-4 w-64">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded bg-gray-100"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded bg-gray-100"
              required
            />
          </div>
          {error && <p className="text-red-500 text-md">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Sign In
          </button>
        </form>
      </div>

      {/* Right section with the background image */}
      <div className="w-1/2 bg-cover bg-center relative" style={{ backgroundImage: `url(${backgroundImg})` }}>
        {/* Additional content if needed */}
      </div>
    </div>
  );
};

export default LoginPage;