import { useState, useEffect } from 'react';
import axios from 'axios';
import { LogIn, LogOut, RefreshCw, Search, Calendar, Mail, User, MessageSquare } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (token) {
      fetchSubmissions();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      const res = await axios.post(`${API_URL}/api/admin/login`, { password });
      setToken(res.data.token);
      localStorage.setItem('adminToken', res.data.token);
    } catch (err) {
      setLoginError(err.response?.data?.error || 'Login failed. Please check password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
    setSubmissions([]);
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}/api/submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch submissions.');
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100 transition-all duration-300">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-3">
              <LogIn className="w-6 h-6 text-brand-red" />
            </div>
            <h2 className="text-2xl font-bold text-brand-dark font-display">NGO Admin Access</h2>
            <p className="text-sm text-brand-slate text-center mt-1">
              Enter the system credentials to access portal messages
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wider mb-2">
                Secret Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 outline-none transition-all font-sans"
              />
            </div>

            {loginError && (
              <p className="text-sm font-semibold text-brand-red bg-brand-red/5 p-3 rounded-lg border border-brand-red/10">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-red text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-brand-red/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-red/15 hover:shadow-brand-red/25 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">NGO Submissions Panel</h2>
          <p className="text-sm text-brand-slate">
            Manage and read contact messages sent by visitors
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSubmissions}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all cursor-pointer text-brand-dark"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-dark text-white rounded-xl text-sm font-medium hover:bg-brand-dark/95 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-brand-red/5 text-brand-red border border-brand-red/10 p-4 rounded-xl mb-6 font-semibold">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search submissions by name, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 outline-none transition-all bg-white font-sans text-sm"
          />
        </div>
      </div>

      {/* Grid or Table */}
      {loading && submissions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-brand-red/30 border-t-brand-red rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-slate text-sm">Loading submissions...</p>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-brand-dark font-semibold text-lg">No submissions found</p>
          <p className="text-brand-slate text-sm mt-1">
            {searchQuery ? 'Try matching different search keywords.' : 'No messages have been submitted yet.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubmissions.map((sub) => (
            <div key={sub._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-red/5 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-dark leading-tight">{sub.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-brand-slate mt-0.5">
                      <Mail className="w-3 h-3" />
                      <a href={`mailto:${sub.email}`} className="hover:underline hover:text-brand-red">{sub.email}</a>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-brand-dark leading-relaxed bg-brand-light/40 p-4 rounded-xl border border-gray-50 mb-4 whitespace-pre-line font-sans">
                  {sub.message}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-brand-slate pt-3 border-t border-gray-100">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(sub.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
