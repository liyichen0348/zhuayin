import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');
async function run() {
  const { data, error } = await supabase.from('adoptions').select('applicant_name, pets(name)').eq('id', '93f1229a-1fd4-425c-8a43-8fa00aab1d6e').single();
  console.log('Error:', error);
  console.log('Data:', data);
  if (data && data.applicant_name) {
    console.log('applicant_name is truthy:', data.applicant_name);
  } else {
    console.log('applicant_name is falsy');
  }
}
run();
