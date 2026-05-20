import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchPetById } from '@/src/lib/api.ts';
import { ChevronLeft, Share2, Heart, MapPin, BadgeCheck, Check, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils.ts';

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) fetchPetById(id).then(setPet).catch(console.error);
  }, [id]);

  const checkFavorite = () => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favs.includes(id || ''));
    } catch {
      setIsFavorite(false);
    }
  };

  useEffect(() => {
    checkFavorite();
    window.addEventListener('favorites-updated', checkFavorite);
    return () => {
      window.removeEventListener('favorites-updated', checkFavorite);
    };
  }, [id]);

  const toggleFavorite = () => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem('favorites') || '[]');
      let updatedFavs: string[];
      if (favs.includes(id || '')) {
        updatedFavs = favs.filter(item => item !== id);
      } else {
        updatedFavs = [...favs, id || ''];
      }
      localStorage.setItem('favorites', JSON.stringify(updatedFavs));
      window.dispatchEvent(new Event('favorites-updated'));
    } catch (e) {
      console.error(e);
    }
  };

  if (!pet) {
    return (
      <div className="pb-32 bg-background min-h-screen">
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-surface-container-high w-full">
          <div className="max-w-lg mx-auto flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors active:scale-90">
                <ChevronLeft className="text-primary" />
              </button>
              <h1 className="text-lg font-bold font-headline text-primary">爪印 Detail</h1>
            </div>
          </div>
        </header>
        <main className="max-w-lg mx-auto animate-pulse">
          <section className="px-6 mt-4">
            <div className="h-[350px] bg-surface-container-high/50 rounded-3xl w-full"></div>
          </section>
          <section className="px-6 mt-6 flex justify-between items-end">
            <div className="space-y-2 w-1/2">
              <div className="h-8 bg-surface-container-high/50 rounded w-3/4"></div>
              <div className="h-4 bg-surface-container-high/50 rounded w-1/2"></div>
            </div>
            <div className="w-24 h-6 bg-surface-container-high/50 rounded-full"></div>
          </section>
          <section className="px-6 mt-6 grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-surface-container-high/50 h-16 rounded-2xl"></div>
            ))}
          </section>
          <section className="px-6 mt-8 space-y-4">
            <div className="h-6 bg-surface-container-high/50 rounded w-1/3"></div>
            <div className="flex gap-2">
              <div className="w-16 h-8 bg-surface-container-high/50 rounded-full"></div>
              <div className="w-16 h-8 bg-surface-container-high/50 rounded-full"></div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-background min-h-screen">
      {/* Header Navigation - 居中且与核心宽度保持一致 */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-surface-container-high w-full">
        <div className="max-w-lg mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors active:scale-90"
            >
              <ChevronLeft className="text-primary" />
            </button>
            <h1 className="text-lg font-bold font-headline text-primary">爪印 Detail</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors active:scale-90">
              <Share2 size={20} className="text-primary" />
            </button>
            <button 
              onClick={toggleFavorite}
              className="p-2 hover:bg-surface-container-high rounded-full transition-all active:scale-75"
            >
              <Heart 
                size={20} 
                className={cn(
                  "transition-all duration-300",
                  isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-primary"
                )} 
              />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto">
        {/* Gallery */}
        <section className="px-6 mt-4">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[350px] rounded-3xl overflow-hidden shadow-sm">
            <div className="col-span-3 row-span-2 overflow-hidden">
              <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-1 row-span-1 overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk60pGc5RG73LVi1l2AtWDQ76dxownWG5rLmd9iENiu6s2rNdUqGVQNy4f7n3JzAS1Otlrh6xHXYJkwF2GPiZtIdun2w5VYfd-oAG3r7i-w4_rtXclmPqW1KT-4e0wO9OGTjLTpqwclp6eIgdkw5kLY0CdHDlPZv9MQxq3JGICaRXZ74Hnlk34wquyokLWamA6N8oOPSSxneICX1BGq54cbkywqFcDYDqs3yCLHStZUfg98A27mUmLbTZdc3_hYy9L4_4-e_npQg0" 
                alt="Detail 1" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="col-span-1 row-span-1 relative overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAN6WpUbjr9cah-XA8geklLMKIfqStkHakMudIsLs3W85LExb5oQWC9PUoNQj3h0rA-iprrUpUybypmYpaW4D-4PG-l7s59MzCUMUDWFsLTmr6OmdPN0art9IguJVW1OczpUpBCfdJvbpGc5VygTjqCWfR7YYTvcWoDcu-BGC8xi0m8r39Sq-420mCneAue-wehKRl1h8KriUkeHRLA4lRMIhTypm6R-BlyzxN6ucY6kGMkANCbiSOOxrFeBOVvxYMGzfY2newZhA" 
                alt="Detail 2" 
                className="w-full h-full object-cover opacity-60" 
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                <span className="text-white text-[10px] font-bold">还有12张</span>
              </div>
            </div>
          </div>
        </section>

        {/* Basic Info */}
        <section className="px-6 mt-6 flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-on-primary-container">{pet.name}</h2>
            <div className="flex items-center gap-1 text-xs text-secondary font-medium">
              <MapPin size={12} className="text-primary" />
              <span>{pet.distance} • 旧金山</span>
            </div>
          </div>
          <span className="bg-tertiary-container/10 text-tertiary text-[10px] px-3 py-1.5 rounded-full border border-tertiary-container/20 flex items-center gap-1.5 font-bold">
            <BadgeCheck size={14} fill="currentColor" className="text-white" />
            认证收容所
          </span>
        </section>

        {/* Stats */}
        <section className="px-6 mt-6 grid grid-cols-4 gap-4">
          {[
            { label: '性别', value: pet.gender },
            { label: '年龄', value: pet.age },
            { label: '体重', value: pet.weight },
            { label: '品种', value: pet.breed.split('')[0] + pet.breed.split('')[1] }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-3 rounded-2xl border border-surface-container-high shadow-sm shadow-primary/5 flex flex-col items-center justify-center gap-1"
            >
              <span className="text-[10px] text-secondary/60 uppercase tracking-tight">{stat.label}</span>
              <span className="text-xs font-bold text-on-primary-container">{stat.value}</span>
            </motion.div>
          ))}
        </section>

        {/* Personality Tags */}
        <section className="px-6 mt-8 space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            性格标签 <Info size={16} className="text-secondary/40" />
          </h3>
          <div className="flex flex-wrap gap-2">
            {pet.personality.map((tag, i) => (
              <span key={i} className="bg-primary/5 text-primary text-xs px-4 py-2 rounded-full border border-primary/10 font-medium">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Bio */}
        <section className="px-6 mt-8">
          <div className="bg-white p-6 rounded-3xl border border-surface-container-high shadow-sm shadow-primary/5 space-y-4">
             <h3 className="font-bold">关于{pet.name}</h3>
             <p className="text-sm leading-relaxed text-secondary/80">
               {pet.description}
             </p>
          </div>
        </section>

        {/* Health */}
        <section className="px-6 mt-8 space-y-4">
          <h3 className="font-bold">健康状态</h3>
          <div className="grid grid-cols-1 gap-3">
            {pet.healthStatus.map((status, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-tertiary-container/5 border border-tertiary-container/10 rounded-2xl">
                <div className="w-6 h-6 bg-tertiary rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
                <span className="text-sm font-medium text-secondary">{status}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Shelter */}
        <section className="px-6 mt-8 pb-12 flex items-center justify-between border-t border-surface-container-high pt-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-surface-container-high">
              <img src={pet.shelter.image} alt={pet.shelter.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-primary-container">{pet.shelter.name}</h4>
              <p className="text-[10px] text-secondary">{pet.shelter.type} • 入驻于{pet.shelter.since}</p>
            </div>
          </div>
          <button className="bg-secondary-container text-secondary text-xs px-4 py-2 rounded-full font-bold hover:bg-secondary-container/80 transition-colors">
            联系TA
          </button>
        </section>
      </main>

      {/* Sticky Bottom Footer */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-t border-surface-container-low px-6 pb-8 pt-4">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-6">
          <div className="hidden sm:block">
            <p className="text-[10px] text-secondary uppercase font-bold">领养费</p>
            <p className="text-lg font-bold text-primary">${pet.adoptionFee}.00</p>
          </div>
          <button 
            onClick={() => navigate('/adopt', { state: { petId: pet.id, pet } })}
            className="flex-1 sm:flex-none sm:w-64 bg-primary text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            申请领养
          </button>
        </div>
      </footer>
    </div>
  );
}
