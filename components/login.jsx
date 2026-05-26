import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// import bgImage from '/assets/image.jpg';

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // login
  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {

      const res = await axios.post(
        "http://localhost:7000/login",
        form
      );

      // success message
      setMessage(res.data.message);

      // save user
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      console.log("Logged user:", res.data.user);

      // redirect
      navigate("/dashboard");

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Server error"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >

        <h2 className="text-xl font-bold mb-4 text-center">
          Login
        </h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          autoComplete="username"
          className="w-full p-2 border rounded mb-3"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          className="w-full p-2 border rounded mb-3"
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p className="mt-3 text-center text-red-500">
            {message}
          </p>
        )}

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline-700">
            Register here
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Login;