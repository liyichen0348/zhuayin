import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, CheckCircle, XCircle, Users, PawPrint, FileText, Trash2, Edit3, AlertCircle } from 'lucide-react';
import { fetchAdoptions, updateAdoptionStatus, deleteAdoption, fetchPets, deletePet, fetchUsers, createPet, updatePet } from '../../lib/api.ts';
import { cn } from '../../lib/utils.ts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('adoptions');
  
  const [adoptions, setAdoptions] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 全局弹窗状态
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{message: string, onConfirm: () => void} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 宠物表单状态
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<any>(null);
  const [petForm, setPetForm] = useState({
    name: '', breed: '', age: '', gender: '公', image: '', story: '', health_status: '', adoption_fee: 0
  });

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'adoptions') {
        const data = await fetchAdoptions();
        setAdoptions(data || []);
      } else if (activeTab === 'pets') {
        const data = await fetchPets();
        setPets(data || []);
      } else if (activeTab === 'users') {
        const data = await fetchUsers();
        setUsers(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (id: string, status: string) => {
    setConfirmDialog({
      message: '确定要更新该申请的状态吗？',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await updateAdoptionStatus(id, status);
          loadData();
          showToast('状态更新成功');
        } catch (e: any) {
          showToast('操作失败: ' + e.message, 'error');
        }
      }
    });
  };

  const handleDeleteAdoption = (id: string) => {
    setConfirmDialog({
      message: '确定要删除该领养申请记录吗？该操作不可恢复！',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await deleteAdoption(id);
          loadData();
          showToast('领养申请记录已删除');
        } catch (e: any) {
          showToast('删除失败: ' + e.message, 'error');
        }
      }
    });
  };

  const openCreatePet = () => {
    setEditingPet(null);
    setPetForm({ name: '', breed: '', age: '', gender: '公', image: '', story: '', health_status: '已绝育, 已接种疫苗', adoption_fee: 0 });
    setIsPetModalOpen(true);
  };

  const openEditPet = (pet: any) => {
    setEditingPet(pet);
    setPetForm({
      name: pet.name || '', 
      breed: pet.breed || '', 
      age: pet.age || '', 
      gender: pet.gender || '公',
      image: pet.image || '', 
      story: pet.description || '', // DB 使用 description
      health_status: Array.isArray(pet.health_status) ? pet.health_status.join(', ') : (pet.health_status || ''),
      adoption_fee: pet.adoption_fee || pet.adoptionFee || 0
    });
    setIsPetModalOpen(true);
  };

  const handleSavePet = async (e: any) => {
    e.preventDefault();
    
    // 映射表单数据到底层 Supabase 需要的字段格式和约束
    const payload = {
      name: petForm.name,
      breed: petForm.breed,
      age: petForm.age,
      gender: petForm.gender,
      image: petForm.image,
      description: petForm.story,
      adoption_fee: Number(petForm.adoption_fee),
      health_status: typeof petForm.health_status === 'string' 
        ? petForm.health_status.split(',').map(s => s.trim()).filter(Boolean) 
        : petForm.health_status,
      // 补充 NOT NULL 约束所需的默认值
      distance: '0km',
      weight: '未知',
      shelter: { name: '爪印官方基地', address: '平台录入' }
    };

    try {
      if (editingPet) {
        await updatePet(editingPet.id, payload);
        showToast('宠物修改成功！');
      } else {
        await createPet(payload);
        showToast('新宠物录入成功！');
      }
      setIsPetModalOpen(false);
      loadData();
    } catch (e: any) {
      showToast('保存失败: ' + e.message, 'error');
    }
  };

  const handleDeletePet = (id: string) => {
    setConfirmDialog({
      message: '确定要永久删除该宠物吗？该操作不可逆！',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await deletePet(id);
          loadData();
          showToast('宠物已删除');
        } catch (e: any) {
          showToast('删除失败: ' + e.message, 'error');
        }
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest pb-12 font-body relative">
      {/* 自定义 Toast 提示 */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-4">
          <div className={cn("px-6 py-3 rounded-full shadow-lg font-bold text-sm flex items-center gap-2", 
            toast.type === 'success' ? "bg-green-600 text-white" : "bg-red-600 text-white"
          )}>
            <AlertCircle size={18} />
            {toast.message}
          </div>
        </div>
      )}

      {/* 自定义 Confirm 弹窗 */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold mb-2">安全确认</h3>
            <p className="text-secondary text-sm mb-6">{confirmDialog.message}</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDialog(null)} className="px-5 py-2 rounded-xl bg-surface-container-low text-secondary font-bold hover:bg-surface-container-high transition-colors">取消</button>
              <button onClick={confirmDialog.onConfirm} className="px-5 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors">确定执行</button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white shadow-sm flex justify-between items-center px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-primary" size={24} />
          <h1 className="text-xl font-bold font-headline text-primary">爪印控制台</h1>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-secondary/80 hover:text-primary transition-colors text-sm font-bold">
          <LogOut size={18} />
          退出
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-surface-container-high px-6 pt-4">
        <div className="max-w-5xl mx-auto flex gap-6">
          {[
            { id: 'adoptions', label: '领养审核', icon: FileText },
            { id: 'pets', label: '宠物管理', icon: PawPrint },
            { id: 'users', label: '用户管理', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 pb-3 px-2 border-b-2 font-bold transition-all text-sm sm:text-base",
                activeTab === tab.id 
                  ? "border-primary text-primary" 
                  : "border-transparent text-secondary/60 hover:text-secondary"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 mt-8 space-y-6">
        {loading ? (
          <p className="text-secondary text-center py-10 font-bold">数据加载中...</p>
        ) : (
          <div className="space-y-4">
            
            {/* Adoptions Tab */}
            {activeTab === 'adoptions' && (
              <>
                <h2 className="text-lg font-bold">领养申请记录 ({adoptions.length})</h2>
                {adoptions.map(app => (
                  <div key={app.id} className="bg-white p-6 rounded-3xl shadow-sm border border-surface-container-high flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-xl">{app.applicant_name}</span>
                        <span className="text-xs bg-surface-container-highest px-3 py-1 rounded-md text-secondary">{app.phone}</span>
                        <span className={`text-xs px-3 py-1 rounded-md font-bold ${
                          app.status === 'approved' ? 'bg-green-100 text-green-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {app.status === 'approved' ? '已通过' : app.status === 'rejected' ? '已拒绝' : '待审核'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-secondary">
                        <p><strong>地址:</strong> {app.address}</p>
                        <p><strong>家庭:</strong> {app.housing_type} | {app.has_yard ? '有院子' : '无院子'} | {app.ownership_type}</p>
                        <p><strong>经验:</strong> {app.experience}</p>
                        <p><strong>照顾者:</strong> {app.primary_caregiver}</p>
                      </div>
                      <div className="text-sm bg-surface-container-lowest p-4 rounded-2xl">
                        <p className="text-secondary/80 leading-relaxed">{app.story || '未提供故事'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-col items-center justify-center gap-3 shrink-0 border-t sm:border-t-0 sm:border-l border-surface-container-high pt-4 sm:pt-0 sm:pl-6">
                      {app.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatusUpdate(app.id, 'approved')} className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition-colors w-full justify-center font-bold">
                            <CheckCircle size={20} /> 通过
                          </button>
                          <button onClick={() => handleStatusUpdate(app.id, 'rejected')} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors w-full justify-center font-bold">
                            <XCircle size={20} /> 拒绝
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDeleteAdoption(app.id)} className="flex items-center gap-2 px-6 py-3 bg-surface-container-low text-secondary rounded-2xl hover:bg-red-50 hover:text-red-600 transition-colors w-full justify-center font-bold">
                        <Trash2 size={20} /> 删除
                      </button>
                    </div>
                  </div>
                ))}
                {adoptions.length === 0 && (
                  <div className="text-center text-secondary py-20 bg-surface-container-lowest rounded-3xl border border-surface-container-high border-dashed">
                    <FileText size={48} className="mx-auto text-secondary/30 mb-4" />
                    <p>暂无待处理的领养申请</p>
                  </div>
                )}
              </>
            )}

            {/* Pets Tab */}
            {activeTab === 'pets' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">在库宠物 ({pets.length})</h2>
                  <button onClick={openCreatePet} className="text-sm bg-primary text-white px-4 py-2 rounded-full font-bold shadow-sm hover:scale-105 transition-transform">
                    + 录入新宠物
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pets.map(pet => (
                    <div key={pet.id} className="bg-white p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-surface-container-high">
                      <img src={pet.image} alt={pet.name} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                      <div className="flex-1 overflow-hidden">
                        <h3 className="font-bold text-lg">{pet.name}</h3>
                        <p className="text-xs text-secondary truncate">{pet.breed} | {pet.age} | {pet.gender}</p>
                        <p className="text-xs text-primary font-bold mt-1">领养费: ${pet.adoption_fee || pet.adoptionFee}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => openEditPet(pet)} className="p-2 bg-surface-container-lowest text-secondary rounded-xl hover:bg-surface-container-low transition-colors">
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => handleDeletePet(pet.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">注册用户 ({users.length})</h2>
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-surface-container-high overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-container-lowest text-secondary/80 border-b border-surface-container-high">
                      <tr>
                        <th className="p-4 font-bold">用户名</th>
                        <th className="p-4 font-bold">邮箱</th>
                        <th className="p-4 font-bold">角色</th>
                        <th className="p-4 font-bold">注册时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high">
                      {users.map((user: any) => (
                        <tr key={user.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                          <td className="p-4 font-bold">{user.username}</td>
                          <td className="p-4 text-secondary">{user.email}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-secondary'}`}>
                              {user.role === 'admin' ? '管理员' : '普通用户'}
                            </span>
                          </td>
                          <td className="p-4 text-secondary">{new Date(user.created_at || Date.now()).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && <p className="text-center text-secondary py-10 font-bold">暂无用户数据</p>}
                </div>
              </>
            )}
            
          </div>
        )}
      </main>

      {/* 宠物表单 Modal (自定义 UI) */}
      {isPetModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-xl font-bold mb-6">{editingPet ? '修改宠物信息' : '录入新宠物'}</h2>
            <form onSubmit={handleSavePet} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-secondary mb-1 block">名字</label>
                  <input required value={petForm.name} onChange={e => setPetForm({...petForm, name: e.target.value})} className="w-full bg-surface-container-low border-transparent border focus:border-primary/30 rounded-xl px-4 py-3 outline-none focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary mb-1 block">品种</label>
                  <input required value={petForm.breed} onChange={e => setPetForm({...petForm, breed: e.target.value})} className="w-full bg-surface-container-low border-transparent border focus:border-primary/30 rounded-xl px-4 py-3 outline-none focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary mb-1 block">年龄 (如: 2个月)</label>
                  <input required value={petForm.age} onChange={e => setPetForm({...petForm, age: e.target.value})} className="w-full bg-surface-container-low border-transparent border focus:border-primary/30 rounded-xl px-4 py-3 outline-none focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary mb-1 block">性别 (仅限公母)</label>
                  <select value={petForm.gender} onChange={e => setPetForm({...petForm, gender: e.target.value})} className="w-full bg-surface-container-low border-transparent border focus:border-primary/30 rounded-xl px-4 py-3 outline-none focus:bg-white transition-colors">
                    <option value="公">公</option>
                    <option value="母">母</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-secondary mb-1 block">图片 URL</label>
                  <input required value={petForm.image} onChange={e => setPetForm({...petForm, image: e.target.value})} className="w-full bg-surface-container-low border-transparent border focus:border-primary/30 rounded-xl px-4 py-3 outline-none focus:bg-white transition-colors" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-secondary mb-1 block">健康状态 (如: 已绝育, 已驱虫)</label>
                  <input required value={petForm.health_status} onChange={e => setPetForm({...petForm, health_status: e.target.value})} className="w-full bg-surface-container-low border-transparent border focus:border-primary/30 rounded-xl px-4 py-3 outline-none focus:bg-white transition-colors" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-secondary mb-1 block">领养费 ($)</label>
                  <input type="number" required value={petForm.adoption_fee} onChange={e => setPetForm({...petForm, adoption_fee: Number(e.target.value)})} className="w-full bg-surface-container-low border-transparent border focus:border-primary/30 rounded-xl px-4 py-3 outline-none focus:bg-white transition-colors" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-secondary mb-1 block">宠物故事</label>
                  <textarea required value={petForm.story} onChange={e => setPetForm({...petForm, story: e.target.value})} className="w-full bg-surface-container-low border-transparent border focus:border-primary/30 rounded-xl px-4 py-3 outline-none focus:bg-white transition-colors min-h-[100px]" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-surface-container-high mt-6">
                <button type="button" onClick={() => setIsPetModalOpen(false)} className="px-5 py-3 rounded-xl text-secondary hover:bg-surface-container-high transition-colors font-bold">取消</button>
                <button type="submit" className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-sm">保存数据</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
