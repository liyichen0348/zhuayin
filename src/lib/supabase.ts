import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';

// 初始化并导出一个 supabase 客户端实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
