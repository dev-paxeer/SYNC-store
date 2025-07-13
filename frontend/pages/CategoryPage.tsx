import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import backend from '~backend/client';
import { AppCard } from '../components/AppCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const sort = searchParams.get('sort') || 'newest';
  const web3Only = searchParams.get('web3') === 'true';

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => backend.apps.listCategories(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['category-apps', slug, sort, web3Only],
    queryFn: () => backend.apps.listApps({
      category: slug,
      sort: sort as 'popular' | 'rating' | 'newest',
      web3_only: web3Only || undefined,
      limit: 50,
    }),
    enabled: !!slug,
  });

  const category = categoriesData?.categories.find(c => c.slug === slug);

  const updateSearchParams = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  if (isLoading) {
    return (
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-12 bg-muted rounded-2xl w-96 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const apps = data?.apps || [];

  const getGradient = (isWeb3: boolean, categoryName: string) => {
    if (isWeb3) {
      return 'from-purple-500 via-pink-500 to-red-500';
    }
    
    const gradients = {
      'productivity': 'from-blue-500 to-cyan-500',
      'entertainment': 'from-pink-500 to-rose-500',
      'social': 'from-green-500 to-emerald-500',
      'education': 'from-indigo-500 to-purple-500',
      'tools': 'from-gray-500 to-slate-500',
      'default': 'from-blue-500 to-cyan-500'
    };
    
    return gradients[categoryName?.toLowerCase() as keyof typeof gradients] || gradients.default;
  };

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Header */}
      <div className="mb-12">
        {/* Hero Section */}
        <div className={`bg-gradient-to-br ${getGradient(category?.is_web3 || false, category?.name || '')} rounded-3xl p-8 md:p-12 text-white mb-8 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              {category?.icon && (
                <span className="text-5xl">{category.icon}</span>
              )}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  {category?.name || 'Category'}
                </h1>
                {category?.is_web3 && (
                  <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
                    Web3 & Blockchain
                  </Badge>
                )}
              </div>
            </div>
            {category?.description && (
              <p className="text-xl opacity-90 max-w-2xl">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Select value={sort} onValueChange={(value) => updateSearchParams('sort', value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            {!category?.is_web3 && (
              <Button
                variant={web3Only ? "default" : "outline"}
                size="sm"
                onClick={() => updateSearchParams('web3', web3Only ? null : 'true')}
              >
                Web3 Only
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          {data?.total || 0} apps in {category?.name || 'this category'}
        </p>
      </div>

      {/* Apps Grid */}
      {apps.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            : "space-y-4"
        }>
          {apps.map((app) => (
            <AppCard 
              key={app.id} 
              app={app} 
              variant={viewMode === 'list' ? 'compact' : 'default'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-muted-foreground text-6xl mb-6">📱</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No apps found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            No apps are available in this category yet. Check back later for new releases!
          </p>
        </div>
      )}

      {/* Load More */}
      {data?.has_more && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Apps
          </Button>
        </div>
      )}
    </div>
  );
}
