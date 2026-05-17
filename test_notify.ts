import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');
async function run() {
  const { data } = await supabase.from('notifications').select('*');
  console.log('Notifications:', data);
  const { data: adoptions } = await supabase.from('adoptions').select('id, applicant_name, status, pets(name)');
  console.log('Adoptions:', JSON.stringify(adoptions, null, 2));
}
run();
