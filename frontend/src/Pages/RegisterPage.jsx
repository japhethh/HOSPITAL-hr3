import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [birthplace, setBirthplace] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Prepare user data
    const userData = {
      username,
      password,
      birthdate,
      birthplace,
      age,
      address,
      contactNumber,
      email,
    };

    // POST request to the backend
    axios.post('http://localhost:4000/auth-api/register', userData)
      .then(response => {
        if (response.data.success) {
          // Store the JWT token in localStorage
          localStorage.setItem('token', response.data.token);
          // Redirect to the dashboard after successful registration
          navigate('/dashboard');
        } else {
          alert('Registration failed');
        }
      })
      .catch(error => {
        if(error.response){
          alert(error.response.data.message)
        }
        else if(error.request){
          console.error(error.request)
        }
        else{
          console.error('Something went error')
          alert("An error occured. Please try again.")
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="date"
              placeholder="Birthdate"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Birthplace"
              value={birthplace}
              onChange={(e) => setBirthplace(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Register
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account? <Link to="/" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;