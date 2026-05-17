import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: pets } = await supabase.from('pets').select('id').limit(1);
  if (!pets || pets.length === 0) {
    console.log('No pets found');
    return;
  }
  const id = pets[0].id;
  const payload = {
    name: 'Test',
    breed: 'Test',
    age: '1',
    gender: '公',
    image: 'test.jpg',
    description: 'test',
    adoption_fee: 100,
    health_status: ['已绝育'],
    distance: '0km',
    weight: '未知',
    shelter: { name: '爪印官方基地', address: '平台录入' }
  };
  const { data, error } = await supabase.from('pets').update(payload).eq('id', id);
  console.log('Update result:', { data, error });
}
run();
