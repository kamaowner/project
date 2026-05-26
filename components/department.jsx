import { useEffect, useState } from "react";
import axios from "axios";

function Department() {
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    departmentName: "",
    departmentCode: "",
  });

  const [message, setMessage] = useState("");

  // FETCH DEPARTMENTS
  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:7000/department");
      setDepartments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ADD DEPARTMENT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:7000/department",
        form
      );

      setMessage(res.data.message);

      // clear form
      setForm({
        departmentName: "",
        departmentCode: "",
      });

      // refresh table
      fetchDepartments();

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error adding department"
      );
    }
  };

  // DELETE DEPARTMENT
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:7000/department/${id}`
      );

      fetchDepartments();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mb-8">
        <h1 className="text-2xl font-bold mb-4">
          Add Department
        </h1>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="departmentName"
            placeholder="Department Name"
            value={form.departmentName}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
          />

          <input
            type="text"
            name="departmentCode"
            placeholder="Department Code"
            value={form.departmentCode}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Add Department
          </button>
        </form>

        {message && (
          <p className="mt-3 text-green-600">
            {message}
          </p>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">
          Department List
        </h1>

        <table className="w-full border-collapse">

          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Department Name</th>
              <th className="border p-2">Department Code</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dept) => (
              <tr key={dept.departmentId}>

                <td className="border p-2 text-center">
                  {dept.departmentId}
                </td>

                <td className="border p-2 text-center">
                  {dept.departmentName}
                </td>

                <td className="border p-2 text-center">
                  {dept.departmentCode}
                </td>

                <td className="border p-2 text-center">
                  <button
                    onClick={() =>
                      handleDelete(dept.departmentId)
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default Department;