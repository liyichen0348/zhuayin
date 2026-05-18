import { Search as SearchIcon, ArrowLeft, MapPin, Heart, PawPrint, SlidersHorizontal } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { fetchPets } from '@/src/lib/api.ts';
import { Pet } from '@/src/types.ts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils.ts';

const popularBreeds = [
  { name: '金毛', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8JuY1_LbHu-E8qOTvnzupwQdWmw-6bU57j5kJe5wWWG0HCJAJMbTygIv9kNXU1f99lUFGSCpOxrrureG3AdMK4ePZweYFFdn2nQcrvkhJndp1MQNo0ybfbUwg7JSx1ysWmhtPOk2vd6RxQJdExczh33YbcWQcaT2mAv7hRDHUUBloiOqS-MHFPxYIXfpxKPe-ZaSLk-jQfi14tVlLFbXfM8RBJwRWfeELbO_coKVDjZ5hVf2n7zO9tJx3GSjj4_p7oPqzjymg4GA' },
  { name: '短毛猫', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqQYFajjwgiMhpiiMR6xV06MbPLOlVKHnFFANwis5DXpqvEBSuaoL0Bm23ylFTBS_AWCI6qAz74yxwznye2nUA53B06l5lMDrteQnquTeigxyabwe9d_8PA75TVzfDGJe_VHXIoRVp9hu_r84YKNoYTk5huL2JMbNgHiQyiTDev6pKni-oo4utqrc5fXFkqBj1JIOPVBOzD_EGceBWuwDvFyNBZPESHeaP8yntLmD_f6-7FN5gUxw-VGawl8fo2Iex22I5uRT8Pw8' },
  { name: '柯基', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj_FNHwDHh_Zm_2PfJWbRW1iW_9GiFCWFDxcWahjz42zGMDCOYBtuKCOmRJV4HshBpGE0i0U12R-D7o_D-rUqdeQ2ealx4Xb2OcLxHKRI04ZjQtm1ukXNLWPUWwC2tDxPCXYsim2Uk4RSwgFzh26VzkBC0_8gLUUuZnELUG34S5uV-tuTFern269NJBnfjIPx05qEh1renG_shGMWRgzE_1IqUDZlqqb7NvJjlAM1qP9pApxA1ivudN-u7aXApuDgrL9mN01CB6VU' },
  { name: '萨摩耶', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASmOSONTWzRJ55YsYQOLxHqeWOIhv9rM0DW9A-4u7LOUlWmHsGnrIsWgkkQNVSoUeAGPbmSKw_WbmvL0-Z6saTMi1MitsGxSrFh_F3zEf_8hIXtIV6UzIZYwv6AqKbQVUGFaOkCVwv7vQ_fbRia2h-FTsAdUcKWjapaZK6O6nLZDncg5jaHYOOUdBVjdQ6FXDXbJl-yAhsTz_dJ02oQsCtGbUDhWXxlTweIp2WNn2493LfHSmjW9fOQXSDbaG_ozeGwruvrQpSWkY' },
];

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = (searchParams.get('q') || '').trim();
  const isSearchMode = !!query;

  const [searchQuery, setSearchQuery] = useState(query);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // 同步和加载收藏状态
  useEffect(() => {
    const syncFavorites = () => {
      try {
        const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(favs);
      } catch {
        setFavorites([]);
      }
    };
    syncFavorites();
    window.addEventListener('favorites-updated', syncFavorites);
    return () => {
      window.removeEventListener('favorites-updated', syncFavorites);
    };
  }, []);

  const handleLikeToggle = (e: React.MouseEvent, petId: string | number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const petIdStr = petId.toString();
      let updatedFavs: string[];
      if (favorites.includes(petIdStr)) {
        updatedFavs = favorites.filter(id => id !== petIdStr);
      } else {
        updatedFavs = [...favorites, petIdStr];
      }
      setFavorites(updatedFavs);
      localStorage.setItem('favorites', JSON.stringify(updatedFavs));
      window.dispatchEvent(new CustomEvent('favorites-updated'));
    } catch (err) {
      console.error('Failed to update favorites:', err);
    }
  };

  // 当 URL 的 q 参数变化时，同步输入框
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  useEffect(() => {
    fetchPets().then(data => {
      setPets(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const handleSearch = (keyword?: string) => {
    const q = (keyword || searchQuery).trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`, { replace: true });
    }
  };

  // 搜索结果
  const results = query
    ? pets.filter(p => {
        const q = query.toLowerCase();
        const name = (p.name || '').toLowerCase();
        const breed = (p.breed || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        return name.includes(q) || breed.includes(q) || desc.includes(q);
      })
    : [];

  return (
    <div className="pb-32 pt-4 px-6 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <header className="flex items-center gap-3">
        {isSearchMode && (
          <button
            onClick={() => navigate('/search')}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors flex-shrink-0"
          >
            <ArrowLeft size={22} className="text-primary" />
          </button>
        )}
        <div className="flex items-center gap-2 text-primary font-bold">
          <SearchIcon size={22} className="text-secondary/40" />
          <h1 className="text-xl font-bold font-headline">{isSearchMode ? '搜索结果' : '寻找'}</h1>
        </div>
      </header>

      {/* Search Input */}
      <section>
        <div className="relative">
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
            onClick={() => handleSearch()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <SearchIcon size={18} />
          </button>
        </div>
      </section>

      {/* ========== 搜索结果模式 ========== */}
      {isSearchMode && (
        <>
          {/* 结果统计 */}
          {!loading && (
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-secondary/70">
                搜索 "<span className="text-primary font-bold">{query}</span>" 找到 <span className="text-primary font-bold">{results.length}</span> 个结果
              </span>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-sm text-secondary/60 font-medium">搜索中...</span>
            </div>
          )}

          {/* 结果列表 */}
          {!loading && (
            <section className="space-y-4">
              <AnimatePresence mode="popLayout">
                {results.length > 0 ? (
                  results.map((pet, index) => (
                    <motion.div
                      key={pet.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.08 }}
                    >
                      <Link
                        to={`/pet/${pet.id}`}
                        className="bg-white rounded-3xl overflow-hidden shadow-sm border border-surface-container-low group active:scale-[0.99] transition-all flex"
                      >
                        <div className="relative w-32 h-32 flex-shrink-0">
                          <img src={pet.image} className="w-full h-full object-cover" alt={pet.name} />
                          {pet.urgent && (
                            <div className="absolute top-2 left-2 bg-primary/90 text-white text-[8px] px-2 py-0.5 rounded-full font-bold">急需领养</div>
                          )}
                          <button
                            onClick={(e) => handleLikeToggle(e, pet.id)}
                            className={cn(
                              "absolute top-2 right-2 p-1.5 rounded-full transition-all duration-300 shadow-sm z-10",
                              favorites.includes(pet.id.toString())
                                ? "bg-white text-red-500 fill-red-500 scale-110"
                                : "bg-white/40 text-white backdrop-blur-md hover:bg-white/60"
                            )}
                          >
                            <Heart size={14} className={cn(favorites.includes(pet.id.toString()) && "fill-current")} />
                          </button>
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center">
                              <h4 className="font-headline font-bold text-base">{pet.name}</h4>
                              <span className="text-primary font-black text-xs">{pet.age}</span>
                            </div>
                            <p className="text-xs text-secondary/60 mt-1 font-medium">{pet.breed} · {pet.gender}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 text-secondary/50 text-[10px] font-bold">
                              <MapPin size={10} className="text-primary" />
                              <span>{pet.distance}</span>
                            </div>
                            <div className="flex gap-1.5">
                              {(pet.personality || []).slice(0, 2).map((p, i) => (
                                <span key={i} className="bg-primary/5 text-primary px-2 py-0.5 rounded-full text-[9px] font-bold">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 space-y-4"
                  >
                    <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center">
                      <PawPrint size={36} className="text-secondary/30" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-bold text-secondary/60">没有找到相关宠物</p>
                      <p className="text-xs text-secondary/40">试试其他关键词，比如"猫"、"金毛"</p>
                    </div>
                    <button
                      onClick={() => navigate('/search')}
                      className="mt-2 px-6 py-2 bg-primary text-white rounded-full text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      返回搜索
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          )}
        </>
      )}

      {/* ========== 默认发现模式（无搜索关键词时） ========== */}
      {!isSearchMode && !loading && (
        <>
          {/* 最近搜索 */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-widest">最近搜索</h3>
            <div className="flex flex-wrap gap-2">
              {['金毛', '小猫', '拉布拉多', '边牧', '法斗', '橘猫'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSearch(tag)}
                  className="px-4 py-2 bg-white rounded-full border border-surface-container-high shadow-sm text-xs font-bold text-secondary hover:bg-primary-container hover:text-on-primary-container hover:border-primary-container transition-all active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* 热门品种 */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="text-lg font-bold">热门品种</h3>
            </div>
            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2">
              {popularBreeds.map((breed, i) => (
                <button
                  key={breed.name}
                  onClick={() => handleSearch(breed.name)}
                  className="flex flex-col items-center gap-2 flex-shrink-0 active:scale-95 transition-transform"
                >
                  <div className={cn(
                    "w-16 h-16 rounded-full overflow-hidden border-2 transition-all p-0.5",
                    i === 0 ? "border-primary-container" : "border-transparent"
                  )}>
                    <img src={breed.image} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <span className="text-[10px] font-bold text-on-primary-container">{breed.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 为您推荐 */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold">为您推荐</h3>
            <div className="grid grid-cols-1 gap-4">
              {pets.map((pet) => (
                <Link key={pet.id} to={`/pet/${pet.id}`} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-surface-container-low group active:scale-[0.99] transition-all">
                  <div className="relative h-48">
                    <img src={pet.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        onClick={(e) => handleLikeToggle(e, pet.id)}
                        className={cn(
                          "p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm transition-all duration-300",
                          favorites.includes(pet.id.toString())
                            ? "text-red-500 fill-red-500 scale-110 bg-white"
                            : "text-primary hover:bg-white"
                        )}
                      >
                        <Heart size={18} className={cn(favorites.includes(pet.id.toString()) && "fill-current")} />
                      </button>
                    </div>
                    {pet.urgent && (
                      <div className="absolute bottom-3 left-3 bg-primary/90 text-white text-[10px] px-3 py-1 rounded-full font-bold">急需领养</div>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-headline font-bold text-lg">{pet.name}</h4>
                      <span className="text-primary font-black text-xs">{pet.age}</span>
                    </div>
                    <div className="flex items-center gap-4 text-secondary/60 text-xs font-bold">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-primary" />
                        <span>{pet.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-primary">{pet.gender === '公' ? '♂' : '♀'}</span>
                        <span>{pet.gender}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {(pet.personality || []).slice(0, 2).map((p, i) => (
                        <span key={i} className="bg-surface-container-low px-3 py-1 rounded-full text-[10px] font-bold text-secondary">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
