import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// 引入类型用于类型推断（假设存在）
// 为了保证在没有数据库时测试能跑通，引入降级的Mock数据
import { PETS, CATEGORIES, NOTIFICATIONS } from './src/constants.js';

dotenv.config();

const app = express();
const port = 3001;

// 初始化头像持久化存储机制
const AVATAR_FILE = './user_avatars.json';
let userAvatars: Record<string, string> = {};
if (fs.existsSync(AVATAR_FILE)) {
  try {
    userAvatars = JSON.parse(fs.readFileSync(AVATAR_FILE, 'utf8'));
  } catch (e) {
    console.error('Failed to load user avatars:', e);
  }
}

const saveAvatars = () => {
  try {
    fs.writeFileSync(AVATAR_FILE, JSON.stringify(userAvatars, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save user avatars:', e);
  }
};

app.use(express.json());

// 尝试初始化 Supabase 客户端
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
let supabase: any = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase client initialized.');
} else {
  console.warn('⚠️ No Supabase keys found in .env, using local memory mock data for tests.');
}

// ==============
// 后端 API 路由
// ==============

// 1. 获取所有的宠物
app.get('/api/pets', async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from('pets').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }
  // 降级返回 Mock
  setTimeout(() => res.json(PETS), 300);
});

// 2. 获取单个宠物详情
app.get('/api/pets/:id', async (req, res) => {
  const { id } = req.params;
  if (supabase) {
    const { data, error } = await supabase.from('pets').select('*').eq('id', id).single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }
  // 降级返回 Mock
  const pet = PETS.find(p => p.id === id);
  if (pet) {
    return res.json(pet);
  }
  res.status(404).json({ error: 'Pet not found' });
});

// 3. 获取所有分类
app.get('/api/categories', async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }
  // 降级返回 Mock
  setTimeout(() => res.json(CATEGORIES), 150);
});

// 4. 获取通知
app.get('/api/notifications', async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from('notifications').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }
  // 降级返回 Mock
  setTimeout(() => res.json(NOTIFICATIONS), 200);
});

// 5. 提交领养申请 (模拟后端接收数据并存入DB)
app.post('/api/adoptions', async (req, res) => {
  const payload = req.body;
  if (supabase) {
    // 假设有 adoptions 表
    const { data, error } = await supabase.from('adoptions').insert([payload]);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, data });
  }
  // 降级模拟成功
  setTimeout(() => res.json({ success: true, message: 'Application submitted locally.' }), 500);
});

// 6. 获取所有的领养申请 (Admin)
app.get('/api/adoptions', async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from('adoptions').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }
  return res.json([]);
});

// 6.5. 获取个人的领养申请 (C端 Profile)
app.get('/api/my-adoptions', async (req, res) => {
  const { phone, username } = req.query;
  if (supabase) {
    let query = supabase.from('adoptions').select('*, pets(*)').order('created_at', { ascending: false });
    
    // 如果存在手机号或用户名，按其过滤；否则返回空
    if (phone && phone !== 'undefined' && phone !== 'null') {
      query = query.eq('phone', phone);
    } else if (username && username !== 'undefined') {
      query = query.eq('applicant_name', username);
    } else {
      return res.json([]);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }
  return res.json([]);
});

// 7. 更新领养申请状态 (Admin)
app.patch('/api/adoptions/:id/status', async (req, res) => {
  const { status } = req.body;
  if (supabase) {
    const { data: adData } = await supabase.from('adoptions').select('applicant_name, pets(name)').eq('id', req.params.id).single();
    const { data, error } = await supabase.from('adoptions').update({ status }).eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    
    if (adData && adData.applicant_name) {
      const petName = (adData.pets as any)?.name || '宠物';
      const actionText = status === 'approved' ? '已通过' : (status === 'rejected' ? '被拒绝' : '状态更新');
      const contentText = status === 'approved' ? '请留意后续通知，准备迎接毛孩子回家！' : '很遗憾，您的申请暂未通过。';
      await supabase.from('notifications').insert([{
        title: `[${adData.applicant_name}]领养审核${actionText}`,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        content: `您对 ${petName} 的领养申请${actionText}。${contentText}`,
        type: 'status',
        date: '今天',
        unread: true
      }]);
    }
    return res.json({ success: true, data });
  }
  return res.json({ success: true });
});

// 7.5. 删除领养申请 (Admin)
app.delete('/api/adoptions/:id', async (req, res) => {
  if (supabase) {
    const { error } = await supabase.from('adoptions').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }
  return res.json({ success: true });
});

// 8. 获取所有的用户 (Admin)
app.get('/api/users', async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    const mergedData = data.map((u: any) => ({
      ...u,
      avatar: userAvatars[u.username] || ''
    }));
    return res.json(mergedData);
  }
  return res.json([{ id: '1', username: '体验用户', email: 'test@example.com', role: 'user', avatar: userAvatars['体验用户'] || '' }]);
});

// 9. 删除宠物 (Admin)
app.delete('/api/pets/:id', async (req, res) => {
  if (supabase) {
    const { error } = await supabase.from('pets').delete().eq('id', req.params.id);
    if (error) {
      if (error.code === '23503') {
        return res.status(400).json({ error: '该宠物已有领养申请记录，无法直接删除' });
      }
      return res.status(500).json({ error: error.message });
    }
    return res.json({ success: true });
  }
  return res.json({ success: true });
});

// 10. 添加宠物 (Admin)
app.post('/api/pets', async (req, res) => {
  const payload = req.body;
  if (supabase) {
    const { data, error } = await supabase.from('pets').insert([payload]);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, data });
  }
  return res.json({ success: true, data: { id: Date.now().toString(), ...payload } });
});

// 11. 更新宠物 (Admin)
app.put('/api/pets/:id', async (req, res) => {
  const payload = req.body;
  if (supabase) {
    const { data, error } = await supabase.from('pets').update(payload).eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, data });
  }
  return res.json({ success: true, data: { id: req.params.id, ...payload } });
});

// 12. 用户注册
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, phone } = req.body;
  if (supabase) {
    const { data: existing } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    if (existing) return res.status(400).json({ error: '该邮箱已被注册' });

    const { data, error } = await supabase.from('users').insert([{ username, email, password, phone }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    
    await supabase.from('notifications').insert([{
      title: `[${username}]注册成功，欢迎加入爪印！`,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      content: '您可以开始浏览可爱的宠物并提交领养申请了。',
      type: 'message',
      date: '今天',
      unread: true
    }]);

    const mergedUser = { ...data, avatar: userAvatars[username] || '' };
    return res.json({ success: true, user: mergedUser });
  }
  return res.json({ success: true, user: { id: Date.now().toString(), username, email, role: 'user', avatar: userAvatars[username] || '' } });
});

// 13. 用户登录
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (supabase) {
    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).eq('password', password).maybeSingle();
    if (error || !user) return res.status(401).json({ error: '邮箱或密码错误' });
    const mergedUser = { ...user, avatar: userAvatars[user.username] || '' };
    return res.json({ success: true, user: mergedUser });
  }
  return res.json({ success: true, user: { id: Date.now().toString(), username: 'admin', email, role: 'admin', avatar: userAvatars['admin'] || '' } });
});

// 13.5. 更新用户头像 (持久化存入 user_avatars.json)
app.put('/api/users/:username/avatar', async (req, res) => {
  const { username } = req.params;
  const { avatar } = req.body;
  userAvatars[username] = avatar || '';
  saveAvatars();
  return res.json({ success: true, avatar });
});

// 14. 获取个人通知信息
app.get('/api/my-notifications', async (req, res) => {
  const { username } = req.query;
  if (supabase && username) {
    const { data, error } = await supabase.from('notifications').select('*').order('id', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    
    const userNotifications = data.filter((n: any) => {
      if (n.title.startsWith('[')) {
        const endIdx = n.title.indexOf(']');
        if (endIdx > 0) {
          const targetUser = n.title.substring(1, endIdx);
          if (targetUser === username) {
            n.title = n.title.substring(endIdx + 1);
            return true;
          }
          return false;
        }
      }
      return true;
    });

    const hasRec = userNotifications.some((n: any) => n.type === 'recommendation');
    if (!hasRec) {
      const { data: randomPets } = await supabase.from('pets').select('*').limit(3);
      if (randomPets && randomPets.length > 0) {
        userNotifications.push({
          id: 'rec-' + Date.now(),
          title: '本周推荐领养星',
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          content: '来看看这些正在寻找温暖家庭的毛孩子吧！',
          type: 'recommendation',
          pet_images: randomPets.map((p: any) => p.image).filter(Boolean),
          unread: true,
          date: '今天'
        });
      }
    }

    return res.json(userNotifications.slice(0, 20));
  }
  return res.json([]);
});

// 12. 标记单个消息为已读
app.patch('/api/notifications/:id/read', async (req, res) => {
  if (supabase) {
    const { error } = await supabase.from('notifications').update({ unread: false }).eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }
  return res.json({ success: true });
});

// 13. 标记所有消息为已读
app.patch('/api/notifications/read-all', async (req, res) => {
  const { username } = req.body;
  if (supabase && username) {
    const { error } = await supabase.from('notifications')
      .update({ unread: false })
      .ilike('title', `[%${username}%]%`);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }
  return res.json({ success: true });
});

app.listen(port, () => {
  console.log(`🚀 Backend Express server running at http://localhost:${port}`);
});
