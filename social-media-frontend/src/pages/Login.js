import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            name="email" 
            placeholder="Email" 
            onChange={handleChange} 
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account? <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
