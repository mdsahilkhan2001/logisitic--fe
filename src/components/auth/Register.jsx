import { useState } from 'react';
import { useRegisterMutation } from '../../features/auth/authApiSlice';
import toast from 'react-hot-toast';

const Register = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'buyer',
  });
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData).unwrap();
      toast.success('Registration successful!');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={e => setFormData({ ...formData, username: e.target.value })}
        required
        className="w-full px-4 py-2 border rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
        required
        className="w-full px-4 py-2 border rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={e => setFormData({ ...formData, password: e.target.value })}
        required
        className="w-full px-4 py-2 border rounded"
      />
      <select
        name="role"
        value={formData.role}
        onChange={e => setFormData({ ...formData, role: e.target.value })}
        className="w-full px-4 py-2 border rounded"
      >
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
        <option value="designer">Designer</option>
      </select>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default Register;
