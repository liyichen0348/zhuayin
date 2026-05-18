import React, { useState, useEffect, useRef } from 'react';
import { fetchMyAdoptions, fetchPets, updateUserAvatar } from '@/src/lib/api.ts';
import { Settings, Verified, LogOut, LogIn, Camera, X, Check, Heart } from 'lucide-react';
import { cn } from '@/src/lib/utils.ts';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import PetCard from '@/src/components/PetCard.tsx';
import { Pet } from '@/src/types.ts';

// 预设头像列表
const PRESET_AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBLxma8Tr8z39nae0LOBVsvYJndgyUAFbj45r7SDPjPHK192uamyGjYBSGXzJs63sYWkJb4NAb6-nxMdXmW05imyl6LfavTmywTmrN3AR_K-i4x71MtnJ1onMW0olZ_WSW1MaBMxo7fTlxb1mU91MRPUQQTKY04-IMtEGVwKW5RacH_fvDsaH4OxIvlBESNhP42lZ6ipslu5MFoY_e8mQfAS-kot8tvfMmBQdbqSmRcaizmTvNgsW7uijr0PNCxQqX1ZsuMhDARpMc',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD8JuY1_LbHu-E8qOTvnzupwQdWmw-6bU57j5kJe5wWWG0HCJAJMbTygIv9kNXU1f99lUFGSCpOxrrureG3AdMK4ePZweYFFdn2nQcrvkhJndp1MQNo0ybfbUwg7JSx1ysWmhtPOk2vd6RxQJdExczh33YbcWQcaT2mAv7hRDHUUBloiOqS-MHFPxYIXfpxKPe-ZaSLk-jQfi14tVlLFbXfM8RBJwRWfeELbO_coKVDjZ5hVf2n7zO9tJx3GSjj4_p7oPqzjymg4GA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCqQYFajjwgiMhpiiMR6xV06MbPLOlVKHnFFANwis5DXpqvEBSuaoL0Bm23ylFTBS_AWCI6qAz74yxwznye2nUA53B06l5lMDrteQnquTeigxyabwe9d_8PA75TVzfDGJe_VHXIoRVp9hu_r84YKNoYTk5huL2JMbNgHiQyiTDev6pKni-oo4utqrc5fXFkqBj1JIOPVBOzD_EGceBWuwDvFyNBZPESHeaP8yntLmD_f6-7FN5gUxw-VGawl8fo2Iex22I5uRT8Pw8',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDj_FNHwDHh_Zm_2PfJWbRW1iW_9GiFCWFDxcWahjz42zGMDCOYBtuKCOmRJV4HshBpGE0i0U12R-D7o_D-rUqdeQ2ealx4Xb2OcLxHKRI04ZjQtm1ukXNLWPUWwC2tDxPCXYsim2Uk4RSwgFzh26VzkBC0_8gLUUuZnELUG34S5uV-tuTFern269NJBnfjIPx05qEh1renG_shGMWRgzE_1IqUDZlqqb7NvJjlAM1qP9pApxA1ivudN-u7aXApuDgrL9mN01CB6VU',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuASmOSONTWzRJ55YsYQOLxHqeWOIhv9rM0DW9A-4u7LOUlWmHsGnrIsWgkkQNVSoUeAGPbmSKw_WbmvL0-Z6saTMi1MitsGxSrFh_F3zEf_8hIXtIV6UzIZYwv6AqKbQVUGFaOkCVwv7vQ_fbRia2h-FTsAdUcKWjapaZK6O6nLZDncg5jaHYOOUdBVjdQ6FXDXbJl-yAhsTz_dJ02oQsCtGbUDhWXxlTweIp2WNn2493LfHSmjW9fOQXSDbaG_ozeGwruvrQpSWkY',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCxTjQ1CedBWz8tgj3rx6vZkit3xn1ZOVkuXSLmOrkxmrR1FUJE4atawCxWI8neFlTMvZcc2PvdT6aPzOYUIj0aJT1FByJQDeWR7fiRNAJ0DfQzyOu4qYqUiEoSGkKJi2TI7MaP4S5DVGzwz06cyqbn73BgCPQEtcb65VmGU0n4o3iA5hQhC_zCEEwB0BDHfXleQytMO9bQFJtPLj0stRRP6McXBdUnnCYJ7J7A-WZPTH8v4VkodBE67Lkno0PmLkw8eoyvRM2nAs4',
];

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [favoritePets, setFavoritePets] = useState<Pet[]>([]);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFavorites = () => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (favs.length > 0) {
        fetchPets().then(allPets => {
          const filtered = allPets.filter(p => favs.includes(p.id.toString()));
          setFavoritePets(filtered);
        }).catch(console.error);
      } else {
        setFavoritePets([]);
      }
    } catch {
      setFavoritePets([]);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      // 强制使用 username (applicant_name) 拉取，避免因注册手机号和表单填写的手机号不一致导致查不到数据
      fetchMyAdoptions('', u.username).then(setApplications).catch(console.error);
      
      // 加载收藏宠物
      loadFavorites();
      window.addEventListener('favorites-updated', loadFavorites);
    }
    return () => {
      window.removeEventListener('favorites-updated', loadFavorites);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleSelectAvatar = async (avatarUrl: string) => {
    const updatedUser = { ...user, avatar: avatarUrl };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setShowAvatarPicker(false);
    try {
      await updateUserAvatar(user.username, avatarUrl);
    } catch (err) {
      console.error('Failed to update avatar in database:', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // 将本地图片转为 base64 存储
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      handleSelectAvatar(base64);
    };
    reader.readAsDataURL(file);
  };

  if (!user) {
    return (
      <div className="pb-32 pt-20 px-6 max-w-lg mx-auto text-center space-y-6 font-body">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-container-high text-secondary mb-4">
          <LogIn size={40} />
        </div>
        <h1 className="text-2xl font-black font-headline">尚未登录</h1>
        <p className="text-secondary font-medium">登录后即可查看您的领养进度、完善个人资料。</p>
        <div className="flex flex-col gap-3 pt-6">
          <button onClick={() => navigate('/login')} className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">立即登录</button>
          <button onClick={() => navigate('/register')} className="w-full bg-surface-container-low text-secondary font-bold py-4 rounded-2xl hover:bg-surface-container-high transition-all border border-surface-container-highest">注册账号</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 pt-4 px-6 max-w-lg mx-auto space-y-8 font-body">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-primary font-bold">
          <Settings size={22} className="text-secondary/40" />
          <h1 className="text-xl font-bold font-headline">我的资料</h1>
        </div>
        <button onClick={handleLogout} className="px-3 py-1.5 hover:bg-red-50 text-red-500 rounded-full transition-colors flex items-center gap-1 text-sm font-bold">
          <LogOut size={16} /> 退出
        </button>
      </header>

      {/* User Info Card */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-surface-container-high space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            {/* 头像区域 - 可点击 */}
            <button
              onClick={() => setShowAvatarPicker(true)}
              className="relative group"
            >
              {user.avatar ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-container/20">
                  <img src={user.avatar} alt="头像" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-tertiary text-white flex items-center justify-center text-4xl font-black border-4 border-primary-container/20 uppercase">
                  {user.username?.[0] || 'U'}
                </div>
              )}
              {/* 悬浮编辑遮罩 */}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={24} className="text-white" />
              </div>
            </button>
            <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white shadow-md cursor-pointer" onClick={() => setShowAvatarPicker(true)}>
              <Camera size={12} />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black">{user.username}</h2>
            <p className="text-xs text-secondary font-medium">{user.email}</p>
            <p className="text-[10px] text-secondary/80 bg-surface-container-low px-2 py-0.5 rounded-full inline-block mt-1">
              角色: {user.role === 'admin' ? '管理员' : '普通用户'}
            </p>
          </div>
        </div>
      </section>

      {/* 头像选择弹窗 */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50"
            onClick={() => setShowAvatarPicker(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-3xl w-full max-w-lg p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 弹窗头部 */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">选择头像</h3>
                <button
                  onClick={() => setShowAvatarPicker(false)}
                  className="p-1.5 hover:bg-surface-container-high rounded-full transition-colors"
                >
                  <X size={20} className="text-secondary" />
                </button>
              </div>

              {/* 当前头像预览 */}
              <div className="flex justify-center">
                {user.avatar ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg shadow-primary/10">
                    <img src={user.avatar} alt="当前头像" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-tertiary text-white flex items-center justify-center text-3xl font-black border-4 border-primary/20 uppercase">
                    {user.username?.[0] || 'U'}
                  </div>
                )}
              </div>

              {/* 预设头像网格 */}
              <div>
                <p className="text-xs font-bold text-secondary/60 mb-3">选择一个预设头像</p>
                <div className="grid grid-cols-6 gap-3">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectAvatar(url)}
                      className={cn(
                        "w-full aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-110 active:scale-95",
                        user.avatar === url ? "border-primary ring-2 ring-primary/30 scale-105" : "border-transparent"
                      )}
                    >
                      <img src={url} className="w-full h-full object-cover" alt={`预设头像${i + 1}`} />
                      {user.avatar === url && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Check size={16} className="text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 从相册上传 */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3.5 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Camera size={18} />
                  从相册选择
                </button>
              </div>

              {/* 底部安全间距 */}
              <div className="h-2" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Applications */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-lg font-bold">我的领养记录</h3>
        </div>
        <div className="space-y-3">
          {applications.length > 0 ? applications.map((app) => (
            <div key={app.id} className="bg-surface-container-low p-4 rounded-3xl border border-surface-container-high flex items-center gap-4 transition-transform active:scale-98">
              <img src={app.pets?.image || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-2xl object-cover" />
              <div className="flex-grow space-y-0.5">
                <h4 className="font-bold text-sm">{app.pets?.name || '未知宠物'}</h4>
                <p className="text-[10px] text-secondary">{app.pets?.breed || '未知品种'} • {new Date(app.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                  app.status === 'pending' ? "bg-primary-container text-on-primary-container" : 
                  app.status === 'approved' ? "bg-green-100 text-green-700" :
                  "bg-tertiary-container text-on-tertiary-container"
                )}>
                  {app.status === 'pending' ? '审核中' : app.status === 'approved' ? '已通过' : '已拒绝'}
                </span>
                <div className="w-16 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className={cn("h-full", 
                    app.status === 'pending' ? "bg-primary w-1/3" : 
                    app.status === 'approved' ? "bg-green-500 w-full" : 
                    "bg-tertiary w-full"
                  )}></div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center p-8 bg-surface-container-low rounded-3xl border border-surface-container-high text-secondary flex flex-col items-center justify-center">
               <p className="text-sm font-bold">暂无领养记录</p>
               <p className="text-[10px] font-medium mt-1">去主页看看有没有心仪的小家伙吧</p>
            </div>
          )}
        </div>
      </section>

      {/* 我的收藏 */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-primary">
            <Heart size={20} className="fill-primary" />
            <h3 className="text-lg font-bold text-on-surface">我的收藏</h3>
          </div>
        </div>
        
        {favoritePets.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {favoritePets.map(pet => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-surface-container-low rounded-3xl border border-surface-container-high text-secondary flex flex-col items-center justify-center">
             <p className="text-sm font-bold">暂无收藏宠物</p>
             <p className="text-[10px] font-medium mt-1">在宠物卡片右上角点亮爱心，即可收藏你喜欢的宠物</p>
          </div>
        )}
      </section>
    </div>
  );
}
