import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../api_config";

const RegisterAdmin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    return setError("Passwords do not match.");
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      password: form.password,
      confirm_password: form.confirmPassword,
    });

    console.log("registration response:", response.data);

    const user = response.data;
    const token = response.data.token?.access;

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user.email));
    }

    // ✅ Show backend message
    alert(response.data.msg || "Admin registered successfully!");
    navigate("/dashboard");

  } catch (err) {
    console.error(err);

    // Use backend error message if available
    const errorMsg =
      err.response?.data?.errors?.password?.[0] ||  // example: password validation error
      err.response?.data?.errors?.email?.[0] ||     // email taken, etc.
      err.response?.data?.errors?.non_field_errors?.[0] || 
      "Failed to register admin. Try again.";

    setError(errorMsg);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 text-stone-700">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Admin Register
        </h2>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 hover:shadow-md"
        >
          Register Admin
        </button>
      </form>
    </div>
  );
};

export default RegisterAdmin;

