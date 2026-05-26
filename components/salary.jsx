import { useEffect, useState } from "react";
import axios from "axios";

function Salary() {

  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    basicSalary: "",
    bonus: "",
    deduction: "",
  });

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

  // FETCH SALARIES
  const fetchSalaries = async () => {
    try {

      const res = await axios.get(
        "http://localhost:7000/salary"
      );

      setSalaries(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchSalaries();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // TOTAL SALARY CALCULATION
  const totalSalary =
    Number(form.basicSalary || 0) +
    Number(form.bonus || 0) -
    Number(form.deduction || 0);

  // SUBMIT SALARY
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:7000/salary",
        form
      );

      fetchSalaries();

      setForm({
        employeeId: "",
        basicSalary: "",
        bonus: "",
        deduction: "",
      });

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">

        <h1 className="text-3xl font-bold mb-6">
          Salary Form
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4"
        >

          {/* EMPLOYEE DROPDOWN */}
          <select
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            className="p-3 border rounded"
          >

            <option value="">
              Select Employee
            </option>

            {employees.map((emp) => (

              <option
                key={emp.employeeId}
                value={emp.employeeId}
              >
                {emp.employeeName}
              </option>

            ))}

          </select>

          {/* BASIC SALARY */}
          <input
            type="number"
            name="basicSalary"
            placeholder="Basic Salary"
            value={form.basicSalary}
            onChange={handleChange}
            className="p-3 border rounded"
          />

          {/* BONUS */}
          <input
            type="number"
            name="bonus"
            placeholder="Bonus"
            value={form.bonus}
            onChange={handleChange}
            className="p-3 border rounded"
          />

          {/* DEDUCTION */}
          <input
            type="number"
            name="deduction"
            placeholder="Deduction"
            value={form.deduction}
            onChange={handleChange}
            className="p-3 border rounded"
          />

          {/* TOTAL SALARY */}
          <div className="col-span-2 bg-blue-100 p-4 rounded text-xl font-bold">

            Total Salary: {totalSalary}

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            Save Salary
          </button>

        </form>

      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-md">

        <h1 className="text-3xl font-bold mb-6">
          Salary Table
        </h1>

        <table className="w-full border-collapse">

          <thead>

            <tr className="bg-blue-600 text-white">

              <th className="border p-3">
                Employee ID
              </th>

              <th className="border p-3">
                Basic Salary
              </th>

              <th className="border p-3">
                Bonus
              </th>

              <th className="border p-3">
                Deduction
              </th>

              <th className="border p-3">
                Total Salary
              </th>

            </tr>

          </thead>

          <tbody>

            {salaries.map((salary) => (

              <tr
                key={salary.salaryId}
                className="text-center hover:bg-gray-100"
              >

                <td className="border p-3">
                  {salary.employeeId}
                </td>

                <td className="border p-3">
                  {salary.basicSalary}
                </td>

                <td className="border p-3">
                  {salary.bonus}
                </td>

                <td className="border p-3">
                  {salary.deduction}
                </td>

                <td className="border p-3 font-bold text-green-600">
                  {salary.totalSalary}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Salary;