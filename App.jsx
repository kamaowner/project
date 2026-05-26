import { BrowserRouter, Routes, Route } from "react-router-dom";
import bgImage from "./assets/image.jpg";

import Login from "./components/login.jsx";
import Register from "./components/register.jsx";
import Dashboard from "./components/dashboard.jsx";
import Users from "./components/users.jsx";
import Employees from "./components/employees.jsx";
import Department from "./components/department.jsx";
import Salary from "./components/salary.jsx";
import Report from "./components/report.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {
  const backgroundStyle = {
    minHeight: "100vh",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (

    <div style={backgroundStyle}>
      <BrowserRouter>

        <Routes>

        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Register Page */}
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />

        {/* Users */}
        <Route
          path="/users"
          element={<ProtectedRoute element={<Users />} />}
        />

        {/* Employees */}
        <Route
          path="/employees"
          element={<ProtectedRoute element={<Employees />} />}
        />

        {/* Department */}
        <Route
          path="/department"
          element={<ProtectedRoute element={<Department />} />}
        />

        {/* Salary */}
        <Route
          path="/salary"
          element={<ProtectedRoute element={<Salary />} />}
        />

        {/* Report */}
        <Route
          path="/report"
          element={<ProtectedRoute element={<Report />} />}
        />

        </Routes>

      </BrowserRouter>
    </div>

  );
}

export default App;