import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PawPrint, X, Send, Heart, CheckCircle, Loader2, AlertCircle, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils.ts';
import { submitAdoption, fetchPets } from '@/src/lib/api.ts';
import { Pet } from '@/src/types.ts';

export default function AdoptionForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pet, setPet] = useState<Pet | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    applicant_name: '', 
    phone: '', 
    housing_type: '公寓', 
    experience: '是'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    // 3秒后自动消失
    const timer = setTimeout(() => setToastMsg(null), 3000);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    // 优先从路由状态中获取宠物数据，否则按ID异步查询
    if (location.state?.pet) {
      setPet(location.state.pet);
    } else {
      const petId = location.state?.petId;
      if (petId) {
        fetchPets().then(pets => {
          const found = pets.find(p => p.id.toString() === petId.toString());
          if (found) setPet(found);
        }).catch(console.error);
      }
    }
  }, [location.state]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 font-body">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-[3rem] shadow-xl shadow-primary/5 border border-surface-container-high flex flex-col items-center text-center space-y-6 max-w-sm w-full"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <CheckCircle size={48} className="animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-on-primary-container font-headline">提交成功！</h2>
            <p className="text-sm text-secondary font-medium">
              您的领养申请已提交，收容所工作人员将尽快审核并联系您。
            </p>
          </div>
          <button 
            onClick={() => navigate('/profile')}
            className="w-full bg-primary text-white font-black py-4 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            查看我的申请
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12 font-body relative">
      {/* 自定义 Toast 提示 */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%', scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: -20, x: '-50%', scale: 0.9 }}
            className="fixed top-20 left-1/2 z-[300] bg-red-500 text-white px-6 py-3.5 rounded-2xl shadow-xl shadow-red-500/20 flex items-center gap-2 border border-red-400/20 text-sm font-bold min-w-[280px] justify-center"
          >
            <AlertCircle size={18} />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header - 居中且与核心内容宽度保持一致，左侧交互与详情页保持一致 */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-surface-container-high w-full">
        <div className="max-w-lg mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors active:scale-90"
            >
              <ChevronLeft className="text-primary" />
            </button>
            <h1 className="text-lg font-bold font-headline text-primary">申请领养</h1>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 mt-8">
        {/* Support Title */}
        <section className="text-center space-y-3 mb-8">
          <h2 className="text-3xl font-black text-primary font-headline">寻找你的完美伙伴</h2>
          <p className="text-sm text-secondary font-medium max-w-xs mx-auto">
            我们已极简化领养流程。请填写以下基础信息，提交后工作人员会与您联系。
          </p>
        </section>

        {/* 领养动物的相关信息卡片 */}
        <AnimatePresence>
          {pet && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-4 rounded-3xl border border-surface-container-high flex items-center gap-4 mb-6 shadow-sm"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow space-y-0.5 min-w-0">
                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-bold inline-block">
                  您正在申请领养
                </span>
                <h4 className="font-bold text-base truncate mt-1 text-on-primary-container">{pet.name}</h4>
                <p className="text-xs text-secondary truncate">{pet.breed} • {pet.age} • {pet.gender}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-surface-container-high space-y-8"
          >
             <div className="space-y-6">
                <h3 className="text-base font-bold border-b border-surface-container-low pb-2">
                  领养申请信息
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-secondary/60 ml-2">姓名</label>
                    <input 
                      name="applicant_name" value={formData.applicant_name} onChange={handleChange}
                      type="text" 
                      placeholder="请输入您的真实姓名"
                      className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-secondary/60 ml-2">手机号码</label>
                    <input 
                      name="phone" value={formData.phone} onChange={handleChange}
                      type="tel" 
                      placeholder="方便联系的手机号"
                      className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-secondary/60 ml-2">住房类型</label>
                    <select name="housing_type" value={formData.housing_type} onChange={handleChange} className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium appearance-none">
                      <option>公寓</option>
                      <option>联排别墅</option>
                      <option>独栋别墅</option>
                      <option>其他</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-secondary/60 ml-2">是否有养宠经验？</label>
                    <select name="experience" value={formData.experience} onChange={handleChange} className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium appearance-none">
                      <option>是</option>
                      <option>否</option>
                    </select>
                  </div>
                </div>
             </div>

             <div className="pt-4 space-y-4">
                <button 
                  disabled={isLoading}
                  onClick={async () => {
                    if (!formData.applicant_name.trim() || !formData.phone.trim()) {
                      showToast("请填写姓名和手机号");
                      return;
                    }
                    setIsLoading(true);
                    try {
                      const petId = location.state?.petId || pet?.id;
                      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                      // 补齐必填的默认字段以兼容现有数据库约束
                      await submitAdoption({ 
                        applicant_name: storedUser.username || formData.applicant_name,
                        phone: formData.phone,
                        housing_type: formData.housing_type,
                        experience: formData.experience === '是' ? '有经验' : '无经验',
                        address: '未填写',
                        has_yard: false,
                        ownership_type: '未填写',
                        current_pets: '无',
                        primary_caregiver: formData.applicant_name,
                        time_commitment: '未填写',
                        emergency_plan: '未填写',
                        story: `极简申请。申请人真实姓名：${formData.applicant_name}`,
                        pet_id: petId
                      });
                      setIsSubmitted(true);
                    } catch (err) {
                      console.error(err);
                      showToast("提交失败，请检查网络");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="w-full bg-primary-container text-on-primary-container font-black py-4 rounded-full shadow-lg shadow-primary/10 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : (
                    <>
                      提交申请
                      <Send size={18} className="rotate-[-20deg]" />
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-secondary/40 font-bold">提交即表示你同意我们的领养初步审核流程。</p>
             </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
