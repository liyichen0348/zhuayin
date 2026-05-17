import React, { useState, useEffect, useRef } from 'react';
import { fetchPets } from '@/src/lib/api.ts';
import { Pet } from '@/src/types.ts';
import { PawPrint, Dog, Cat, Bird, Rabbit, Search as SearchIcon, Star, MapPin, LayoutGrid } from 'lucide-react';
import PetCard from '@/src/components/PetCard.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

// 内置分类定义
const LOCAL_CATEGORIES = [
  { id: 'all',   name: '全部', icon: LayoutGrid, keywords: [] },
  { id: 'dog',   name: '狗狗', icon: Dog,        keywords: ['狗', '犬', '斗', '柴', '哈士奇', '金毛', '拉布拉多', '柯基', '泰迪', '法斗', '贵宾', '比熊'] },
  { id: 'cat',   name: '猫猫', icon: Cat,        keywords: ['猫', '英短', '美短', '布偶', '暹罗', '橘'] },
  { id: 'bird',  name: '鸟类', icon: Bird,       keywords: ['鸟', '鹦鹉', '八哥', '画眉', '鸽', '百灵'] },
  { id: 'other', name: '其他', icon: Rabbit,     keywords: [] },
];

function matchCategory(breed: string, categoryId: string): boolean {
  if (categoryId === 'all') return true;
  const cat = LOCAL_CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return true;
  if (categoryId === 'other') {
    const dogCat = LOCAL_CATEGORIES.find(c => c.id === 'dog')!;
    const catCat = LOCAL_CATEGORIES.find(c => c.id === 'cat')!;
    const birdCat = LOCAL_CATEGORIES.find(c => c.id === 'bird')!;
    const allKeywords = [...dogCat.keywords, ...catCat.keywords, ...birdCat.keywords];
    return !allKeywords.some(kw => breed.includes(kw));
  }
  return cat.keywords.some(kw => breed.includes(kw));
}

export default function Home() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPets().then(setPets).catch(console.error);
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const filteredPets = pets.filter(p => matchCategory(p.breed || '', activeCategory));

  return (
    <div className="pb-24 pt-4 px-6 max-w-lg mx-auto space-y-8 overflow-x-hidden">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <PawPrint className="text-primary" size={28} />
          <h1 className="text-2xl font-bold font-headline text-primary">爪印</h1>
        </div>
        <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface-container-high transition-transform active:scale-95">
          {user?.avatar ? (
            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-primary to-tertiary text-white flex items-center justify-center text-lg font-black uppercase">
              {user?.username?.[0] || 'U'}
            </div>
          )}
        </Link>
      </header>

      {/* Search Bar */}
      <section>
        <div className="relative group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/60 pointer-events-none" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            placeholder="搜索宠物名字、品种..."
            className="w-full bg-surface-container-low border border-surface-container-high rounded-full py-4 pl-12 pr-14 focus:ring-2 focus:ring-primary/20 focus:outline-none focus:border-primary transition-all text-sm shadow-sm"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <SearchIcon size={18} />
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">类别</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {LOCAL_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.92 }}
                onClick={() => setActiveCategory(cat.id)}
                className="flex flex-col items-center gap-2 flex-shrink-0 min-w-[64px]"
              >
                <motion.div
                  animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-200 shadow-sm ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-surface-container-high text-secondary/60 hover:bg-surface-container-highest'
                  }`}
                >
                  <Icon size={28} />
                </motion.div>
                <span className={`text-[10px] font-bold transition-colors duration-200 ${isActive ? 'text-primary' : 'text-secondary'}`}>
                  {cat.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Featured Pets */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">精选宠物</h2>
          <Star className="text-primary fill-primary" size={18} />
        </div>
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
          <AnimatePresence mode="popLayout">
            {filteredPets.filter(p => !p.status).length > 0 ? (
              filteredPets.filter(p => !p.status).map(pet => (
                <motion.div
                  key={pet.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                >
                  <PetCard pet={pet} variant="featured" />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full text-center py-8 text-secondary/60 text-sm"
              >
                该分类暂无精选宠物
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Nearby Pets */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">附近的宠物</h2>
          <div className="flex items-center gap-1 text-xs text-secondary font-bold">
            <MapPin size={14} />
            <span>当前位置</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredPets.length > 0 ? (
              filteredPets.map(pet => (
                <motion.div
                  key={pet.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <PetCard pet={pet} variant="nearby" />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-2 text-center py-12 text-secondary/60 text-sm"
              >
                该分类暂无宠物
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
