import { useEffect, useState } from "react";
import axios from "axios";

function Employees() {

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    employeeName: "",
    email: "",
    phone: "",
    departmentId: "",
  });

  const [editingId, setEditingId] = useState(null);

  // FETCH EMPLOYEES
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:7000/employees"
      );

      setEmployees(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  // FETCH DEPARTMENTS
  const fetchDepartments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:7000/department"
      );

      setDepartments(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ADD EMPLOYEE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // CREATE
      if (!editingId) {

        await axios.post(
          "http://localhost:7000/employees",
          form
        );

      }

      // REFRESH TABLE
      fetchEmployees();

      // CLEAR FORM
      setForm({
        employeeName: "",
        email: "",
        phone: "",
        departmentId: "",
      });

      setEditingId(null);

    } catch (error) {
      console.log(error);
    }
  };

  // DELETE EMPLOYEE
  const handleDelete = async (id) => {
    try {

      await axios.delete(
        `http://localhost:7000/employees/${id}`
      );

      fetchEmployees();

    } catch (error) {
      console.log(error);
    }
  };

  // EDIT EMPLOYEE
  const handleEdit = (emp) => {

    setEditingId(emp.employeeId);

    setForm({
      employeeName: emp.employeeName,
      email: emp.email,
      phone: emp.phone,
      departmentId: emp.departmentId,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">

        <h1 className="text-2xl font-bold mb-4">
          Employees Form
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4"
        >

          <input
            type="text"
            name="employeeName"
            placeholder="Employee Name"
            value={form.employeeName}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          {/* DEPARTMENT DROPDOWN */}
          <select
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
            className="p-2 border rounded"
          >

            <option value="">
              Select Department
            </option>

            {departments.map((dept) => (
              <option
                key={dept.departmentId}
                value={dept.departmentId}
              >
                {dept.departmentName}
              </option>
            ))}

          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 col-span-2"
          >
            {editingId ? "Update Employee" : "Add Employee"}
          </button>

        </form>

      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-md">

        <h1 className="text-2xl font-bold mb-4">
          Employees Table
        </h1>

        <table className="w-full border-collapse">

          <thead>

            <tr className="bg-gray-200">

              <th className="border p-2">
                ID
              </th>

              <th className="border p-2">
                Name
              </th>

              <th className="border p-2">
                Email
              </th>

              <th className="border p-2">
                Phone
              </th>

              <th className="border p-2">
                Department
              </th>

              <th className="border p-2">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {employees.map((emp) => (

              <tr key={emp.employeeId}>

                <td className="border p-2 text-center">
                  {emp.employeeId}
                </td>

                <td className="border p-2 text-center">
                  {emp.employeeName}
                </td>

                <td className="border p-2 text-center">
                  {emp.email}
                </td>

                <td className="border p-2 text-center">
                  {emp.phone}
                </td>

                <td className="border p-2 text-center">
                  {
                    departments.find(
                      (d) =>
                        d.departmentId === emp.departmentId
                    )?.departmentName
                  }
                </td>

                <td className="border p-2 text-center space-x-2">

                  <button
                    onClick={() => handleEdit(emp)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(emp.employeeId)
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

export default Employees;