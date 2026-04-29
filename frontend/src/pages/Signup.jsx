import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Activity, Shield, Heart } from 'lucide-react';
import { storeUser } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Doctor',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!form.username || !form.email || !form.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const newUser = {
        username: form.username,
        email: form.email,
        role: form.role,
        status: 'success',
        token: 'demo-token',
      };

      storeUser(newUser);
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup failed:', err);
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl relative">
            <Heart className="w-10 h-10 text-white absolute" />
            <Shield className="w-6 h-6 text-white absolute bottom-1 right-1" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            CareNest
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Healthcare Intelligence Platform</p>
          <div className="mt-4 px-3 py-1 bg-primary-500/10 rounded-full inline-block">
            <span className="text-primary-400 text-sm font-medium">Create Account</span>
          </div>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Create Account</h2>
            <p className="text-slate-400 mt-2">Join the CareNest healthcare platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950/90 text-white placeholder-slate-400 focus:border-primary-400 focus:outline-none transition-colors"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950/90 text-white placeholder-slate-400 focus:border-primary-400 focus:outline-none transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950/90 text-white placeholder-slate-400 focus:border-primary-400 focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950/90 text-white focus:border-primary-400 focus:outline-none transition-colors"
              >
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Patient">Patient</option>
                <option value="Family Member">Family Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:shadow-xl hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              <UserPlus className="w-4 h-4 ml-2" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;