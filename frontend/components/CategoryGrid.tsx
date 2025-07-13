import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import backend from '~backend/client';
import type { Category } from '~backend/apps/types';

export function CategoryGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => backend.apps.listCategories(),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-muted rounded-2xl h-28 animate-pulse" />
        ))}
      </div>
    );
  }

  const categories = data?.categories || [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

interface CategoryCardProps {
  category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
  const getGradient = (isWeb3: boolean, categoryName: string) => {
    if (isWeb3) {
      return 'from-purple-500 via-pink-500 to-red-500';
    }
    
    // Different gradients for different categories
    const gradients = {
      'productivity': 'from-blue-500 to-cyan-500',
      'entertainment': 'from-pink-500 to-rose-500',
      'social': 'from-green-500 to-emerald-500',
      'education': 'from-indigo-500 to-purple-500',
      'tools': 'from-gray-500 to-slate-500',
      'default': 'from-blue-500 to-cyan-500'
    };
    
    return gradients[categoryName.toLowerCase() as keyof typeof gradients] || gradients.default;
  };

  return (
    <Link
      to={`/category/${category.slug}`}
      className="block group"
    >
      <div className={`bg-gradient-to-br ${getGradient(category.is_web3, category.name)} rounded-2xl p-6 text-white hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-lg relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        <div className="relative z-10">
          <div className="text-3xl mb-3">{category.icon || '📱'}</div>
          <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
          {category.is_web3 && (
            <div className="text-sm opacity-90 mb-2">Web3 & Blockchain</div>
          )}
          {category.description && (
            <p className="text-sm opacity-80 line-clamp-2">{category.description}</p>
          )}
        </div>
        
        <ChevronRight className="absolute bottom-4 right-4 h-5 w-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
      </div>
    </Link>
  );
}
