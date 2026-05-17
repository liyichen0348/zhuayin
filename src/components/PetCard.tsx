import React, { useState, useEffect } from 'react';
import { Heart, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Pet } from '@/src/types.ts';
import { cn } from '@/src/lib/utils.ts';
import { Link } from 'react-router-dom';

interface PetCardProps {
  pet: Pet;
  variant?: 'featured' | 'nearby' | 'search';
}

export default function PetCard({ pet, variant = 'nearby' }: PetCardProps) {
  const isFeatured = variant === 'featured';
  const [isLiked, setIsLiked] = useState(false);

  // 检查和同步收藏状态
  const checkStatus = () => {
    try {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsLiked(favs.includes(pet.id.toString()));
    } catch {
      setIsLiked(false);
    }
  };

  useEffect(() => {
    checkStatus();
    window.addEventListener('favorites-updated', checkStatus);
    return () => {
      window.removeEventListener('favorites-updated', checkStatus);
    };
  }, [pet.id]);

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const favs: string[] = JSON.parse(localStorage.getItem('favorites') || '[]');
      const petIdStr = pet.id.toString();
      let updatedFavs: string[];
      if (favs.includes(petIdStr)) {
        updatedFavs = favs.filter(id => id !== petIdStr);
      } else {
        updatedFavs = [...favs, petIdStr];
      }
      localStorage.setItem('favorites', JSON.stringify(updatedFavs));
      window.dispatchEvent(new CustomEvent('favorites-updated'));
    } catch (err) {
      console.error('Failed to update favorites:', err);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-surface-container-high group relative",
        isFeatured ? "w-[calc((100vw-64px)/2)] max-w-[224px] flex-shrink-0" : "w-full"
      )}
    >
      <Link to={`/pet/${pet.id}`}>
        <div className="relative overflow-hidden w-full aspect-[4/3]">
          <img
            src={pet.image}
            alt={pet.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <motion.button 
            whileTap={{ scale: 0.8 }}
            className={cn(
              "absolute top-2 right-2 p-1.5 rounded-full transition-all duration-300 shadow-sm z-10",
              isLiked 
                ? "bg-white text-red-500 fill-red-500 scale-110" 
                : "bg-white/20 text-white backdrop-blur-md hover:bg-white/40"
            )}
            onClick={handleLikeToggle}
          >
            <Heart size={16} className={cn(isLiked && "fill-current")} />
          </motion.button>
          {pet.urgent && (
            <div className="absolute bottom-2 left-2 bg-primary/90 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
              急需领养
            </div>
          )}
        </div>

        <div className="p-3 space-y-0.5">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-on-primary-container text-sm truncate">
              {pet.name}
            </h3>
          </div>

          <div className="space-y-0.5">
            <p className="text-[10px] text-secondary">{pet.age}</p>
            <p className="text-[10px] text-primary font-bold">{pet.distance}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
