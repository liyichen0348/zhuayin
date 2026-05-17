import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');
async function run() {
  // 尝试直接更新一条记录来测试列是否存在
  const { error } = await supabase.from('users').update({ avatar: '' }).eq('username', '__test_nonexist__');
  if (error && error.message.includes('avatar')) {
    console.log('avatar column does NOT exist, need to add via SQL.');
  } else {
    console.log('avatar column exists or update succeeded (no error about column).');
  }
}
run();
