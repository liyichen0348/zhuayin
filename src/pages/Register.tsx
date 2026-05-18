import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../lib/api';
import { PawPrint, Mail, Lock, AlertCircle, ArrowRight, User, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await registerUser(form);
      if (res.success) {
        localStorage.setItem('user', JSON.stringify(res.user));
        navigate('/profile');
      }
    } catch (err: any) {
      setError(err.message || '注册失败，请检查输入信息');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col justify-center px-6 font-body py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mx-auto space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-secondary-container text-secondary mb-2">
            <User size={32} />
          </div>
          <h1 className="text-3xl font-black font-headline">加入爪印</h1>
          <p className="text-secondary font-medium">注册账号，开启领养之旅</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary">
                <User size={20} />
              </div>
              <input
                type="text"
                required
                placeholder="请输入用户名"
                value={form.username}
                onChange={(e) => setForm({...form, username: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-white border border-surface-container-high rounded-2xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary">
                <Mail size={20} />
              </div>
              <input
                type="email"
                required
                placeholder="请输入邮箱"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-white border border-surface-container-high rounded-2xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary">
                <Phone size={20} />
              </div>
              <input
                type="tel"
                placeholder="请输入手机号 (选填)"
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-white border border-surface-container-high rounded-2xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary">
                <Lock size={20} />
              </div>
              <input
                type="password"
                required
                placeholder="请设置密码"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-white border border-surface-container-high rounded-2xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all",
              loading ? "bg-primary/70 cursor-not-allowed" : "bg-primary hover:scale-[1.02] active:scale-95"
            )}
          >
            {loading ? '正在注册...' : '完成注册'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <p className="text-center text-secondary font-medium">
          已有账号？{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            直接登录
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
