import { useEffect, useState } from "react";
import axios from "axios";

function Users() {

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // =====================
  // GET USERS
  // =====================
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:7000/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =====================
  // HANDLE INPUT
  // =====================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =====================
  // ADD USER
  // =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:7000/users",
        form
      );

      setMessage(res.data.message);

      setForm({ username: "", password: "" });

      fetchUsers();

    } catch (err) {
      console.log(err);
      setMessage("Error creating user");
    }
  };

  // =====================
  // DELETE USER
  // =====================
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:7000/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Users Management
      </h1>

      {/* FORM */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow mb-8">

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
type="password"
              name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <button
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Add User
          </button>

        </form>

        {message && (
          <p className="text-center text-green-600 mt-3">
            {message}
          </p>
        )}

      </div>

      {/* TABLE */}
      <div className="max-w-4xl mx-auto bg-white p-4 rounded-xl shadow">

        <table className="w-full border">

          <thead className="bg-gray-200">

            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Username</th>
              <th className="p-3 border">Action</th>
            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr key={user.id} className="text-center">

                <td className="border p-2">{user.id}</td>

                <td className="border p-2">{user.username}</td>

                <td className="border p-2">

                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
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

export default Users;