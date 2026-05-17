import { createClient } from '@supabase/supabase-js';

// 获取环境变量中的连接配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';

// 初始化并导出一个 supabase 客户端实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
