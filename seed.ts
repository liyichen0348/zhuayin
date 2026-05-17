import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { PETS, CATEGORIES, NOTIFICATIONS } from './src/constants.ts';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('开始插入模拟数据...');

  // 1. Categories
  const categoriesData = CATEGORIES.map(({ id, ...rest }) => rest);
  const { error: cErr } = await supabase.from('categories').insert(categoriesData);
  if (cErr) {
    console.error('❌ Categories 插入失败:', cErr.message);
  } else {
    console.log('✅ Categories 插入成功');
  }

  // 2. Pets
  const petsData = PETS.map(({ id, healthStatus, adoptionFee, submittedAt, ...rest }) => {
    return {
      ...rest,
      health_status: healthStatus || [],
      adoption_fee: adoptionFee || 0,
      // 忽略原有的中文时间戳，使用数据库默认的 NOW()
    };
  });
  
  const { error: pErr } = await supabase.from('pets').insert(petsData);
  if (pErr) {
    console.error('❌ Pets 插入失败:', pErr.message);
  } else {
    console.log('✅ Pets 插入成功');
  }

  // 3. Notifications
  const notifData = NOTIFICATIONS.map(({ id, petImage, ...rest }) => ({
    ...rest,
    pet_image: petImage || null
  }));
  const { error: nErr } = await supabase.from('notifications').insert(notifData);
  if (nErr) {
    console.error('❌ Notifications 插入失败:', nErr.message);
  } else {
    console.log('✅ Notifications 插入成功');
  }

  console.log('模拟数据处理完毕！');
}

seed();
