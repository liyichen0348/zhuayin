import { useState, useEffect } from 'react';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/src/lib/api.ts';
import { Notification } from '@/src/types.ts';
import { BadgeCheck, MessageCircle, Star, BellRing, Settings } from 'lucide-react';
import { cn } from '@/src/lib/utils.ts';
import { motion } from 'motion/react';

const iconMap: Record<string, any> = {
  status: BadgeCheck,
  message: MessageCircle,
  recommendation: Star,
  health: BellRing
};

const colorMap: Record<string, string> = {
  status: 'text-primary bg-primary/10',
  message: 'text-tertiary bg-tertiary/10',
  recommendation: 'text-primary bg-primary/5',
  health: 'text-secondary bg-secondary/10'
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      fetchNotifications(u.username).then(setNotifications).catch(console.error);
    }
  }, []);

  const handleRead = async (id: string) => {
    try {
      // 推荐类通知是实时生成的没有真实ID记录，无需调用后端标记，直接改前端状态
      if (!id.startsWith('rec-')) {
        await markNotificationAsRead(id);
      }
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const handleReadAll = async () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      try {
        await markAllNotificationsAsRead(u.username);
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="pb-32 pt-4 px-6 max-w-lg mx-auto space-y-6">
       {/* Header */}
       <header className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary font-bold">
            <BellRing size={22} className="text-secondary/40" />
            <h1 className="text-xl font-bold font-headline">消息通知</h1>
          </div>
          <button onClick={handleReadAll} className="text-xs font-bold text-primary hover:underline">全部已读</button>
       </header>

       <div className="space-y-8">
          {['今天', '更早'].map((group) => (
             <div key={group} className="space-y-4">
               <h3 className="text-xs font-black uppercase text-secondary/60 tracking-widest">{group}</h3>
               <div className="space-y-4">
                 {notifications.filter(n => (n.date || '今天') === group).map((n) => {
                   const Icon = iconMap[n.type];
                   return (
                     <motion.div 
                       key={n.id}
                       onClick={() => n.unread && handleRead(n.id)}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       className={cn(
                        "bg-white p-4 rounded-3xl border border-surface-container-high shadow-sm shadow-primary/5 flex gap-4 transition-all active:scale-[0.99] cursor-pointer",
                        n.unread && "border-l-4 border-l-primary"
                       )}
                     >
                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0", colorMap[n.type])}>
                          <Icon size={24} fill={n.type === 'status' || n.type === 'message' || n.type === 'recommendation' ? 'currentColor' : 'none'} className={n.type === 'status' ? 'text-white' : ''}/>
                        </div>
                        <div className="flex-grow space-y-1">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold">{n.title}</h4>
                            <span className="text-[10px] text-secondary/60 font-medium">{n.time}</span>
                          </div>
                          <p className="text-xs text-secondary/80 leading-relaxed font-medium">
                            {n.content}
                          </p>
                          {n.petImage && (
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-surface-container-low">
                              <img src={n.petImage} className="w-8 h-8 rounded-full object-cover" />
                              <span className="text-[10px] font-bold text-primary">查看申请详情</span>
                            </div>
                          )}
                          {n.type === 'message' && (
                            <button className="mt-3 text-[10px] bg-secondary-container px-3 py-1 rounded-full font-bold text-secondary">
                              点击回复
                            </button>
                          )}
                          {n.type === 'recommendation' && n.petImages && n.petImages.length > 0 && (
                             <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3">
                               {n.petImages.map((img, idx) => (
                                 <div key={idx} className="w-24 h-24 rounded-2xl overflow-hidden bg-surface-container flex-shrink-0">
                                    <img src={img} className="w-full h-full object-cover" />
                                 </div>
                               ))}
                             </div>
                          )}
                        </div>
                        {n.unread && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 ring-4 ring-primary/10"></div>}
                     </motion.div>
                   );
                 })}
               </div>
             </div>
          ))}
       </div>
    </div>
  );
}
