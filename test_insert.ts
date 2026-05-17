import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');
async function run() {
  const { data, error } = await supabase.from('notifications').insert([{
    title: '[laoli]领养审核已通过',
    time: '12:00',
    content: 'test',
    type: 'status',
    date: '今天',
    unread: true
  }]);
  console.log('Error:', error);
  console.log('Data:', data);
}
run();
