import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: any) => {
    e.preventDefault();
    // 简易验证逻辑
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminToken', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('用户名或密码错误');
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col items-center justify-center px-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold font-headline text-primary">爪印后台系统</h1>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary/60 ml-2">管理账号</label>
            <input 
              type="text" 
              value={username} onChange={e => setUsername(e.target.value)}
              placeholder="请输入账号"
              className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary/60 ml-2">密码</label>
            <input 
              type="password" 
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          {error && <p className="text-xs text-red-500 font-bold ml-2">{error}</p>}

          <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-full mt-4 transition-transform active:scale-95">
            登录控制台
          </button>
        </form>
      </div>
    </div>
  );
}
