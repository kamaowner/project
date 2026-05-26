import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex h-screen">

      <div className="w-64 h-screen bg-gray-800 text-white p-4">

      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      {user && (
        <div className="bg-gray-700 p-3 rounded mb-6">
          <p className="text-sm text-gray-300">Logged in as:</p>
          <p className="font-semibold">{user.username}</p>
          <button
            onClick={handleLogout}
            className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm"
          >
            Logout
          </button>
        </div>
      )}

      <ul className="space-y-4">

        <li>
          <Link to="/users">Users</Link>
        </li>

        <li>
          <Link to="/department">Department</Link>
        </li>

        <li>
          <Link to="/employees">Employees</Link>
        </li>

        <li>
          <Link to="/salary">Salary</Link>
        </li>

        <li>
          <Link to="/report">Report</Link>
        </li>

      </ul>

    </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
      </div>

    </div>
  )
}
export default Dashboard;