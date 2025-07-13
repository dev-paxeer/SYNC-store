import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Grid, List, X, SlidersHorizontal } from 'lucide-react';
import backend from '~backend/client';
import { AppCard } from '../components/AppCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const web3Only = searchParams.get('web3') === 'true';
  const featured = searchParams.get('featured') === 'true';

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => backend.apps.listCategories(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['search-apps', query, category, sort, web3Only, featured],
    queryFn: () => backend.apps.listApps({
      search: query || undefined,
      category: category || undefined,
      sort: sort as 'popular' | 'rating' | 'newest',
      web3_only: web3Only || undefined,
      featured: featured || undefined,
      limit: 50,
    }),
  });

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const updateSearchParams = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams('q', searchQuery.trim() || null);
  };

  const clearFilter = (key: string) => {
    updateSearchParams(key, null);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSearchQuery('');
  };

  const activeFilters = [
    { key: 'q', label: `"${query}"`, value: query },
    { key: 'category', label: categoriesData?.categories.find(c => c.slug === category)?.name, value: category },
    { key: 'web3', label: 'Web3 Only', value: web3Only ? 'true' : '' },
    { key: 'featured', label: 'Featured', value: featured ? 'true' : '' },
  ].filter(filter => filter.value);

  const apps = data?.apps || [];

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">Category</label>
        <Select value={category} onValueChange={(value) => updateSearchParams('category', value || null)}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categoriesData?.categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">Sort by</label>
        <Select value={sort} onValueChange={(value) => updateSearchParams('sort', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">Filters</label>
        <div className="space-y-3">
          <Button
            variant={web3Only ? "default" : "outline"}
            size="sm"
            onClick={() => updateSearchParams('web3', web3Only ? null : 'true')}
            className="w-full justify-start"
          >
            Web3 Apps Only
          </Button>
          <Button
            variant={featured ? "default" : "outline"}
            size="sm"
            onClick={() => updateSearchParams('featured', featured ? null : 'true')}
            className="w-full justify-start"
          >
            Featured Apps
          </Button>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">Active Filters</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {activeFilters.map((filter) => (
              <Badge key={filter.key} variant="secondary" className="flex items-center space-x-1">
                <span>{filter.label}</span>
                <button
                  onClick={() => clearFilter(filter.key)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={clearAllFilters} className="w-full">
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Search Apps</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for apps, developers, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-14 text-lg bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
            />
          </div>
        </form>

        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-4">
              <Select value={category} onValueChange={(value) => updateSearchParams('category', value || null)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categoriesData?.categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={(value) => updateSearchParams('sort', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={web3Only ? "default" : "outline"}
                size="sm"
                onClick={() => updateSearchParams('web3', web3Only ? null : 'true')}
              >
                Web3 Only
              </Button>

              <Button
                variant={featured ? "default" : "outline"}
                size="sm"
                onClick={() => updateSearchParams('featured', featured ? null : 'true')}
              >
                Featured
              </Button>
            </div>

            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {activeFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* View Mode Toggle */}
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

        {/* Active Filters - Desktop */}
        {activeFilters.length > 0 && (
          <div className="hidden lg:flex flex-wrap items-center gap-2 mt-4">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {activeFilters.map((filter) => (
              <Badge key={filter.key} variant="secondary" className="flex items-center space-x-1">
                <span>{filter.label}</span>
                <button
                  onClick={() => clearFilter(filter.key)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-80 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Results */}
      {!isLoading && (
        <>
          <div className="mb-6">
            <p className="text-muted-foreground">
              {data?.total || 0} apps found
              {query && ` for "${query}"`}
            </p>
          </div>

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
              <div className="text-muted-foreground text-6xl mb-6">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No apps found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {query 
                  ? `No apps match your search for "${query}". Try different keywords or adjust your filters.`
                  : "Try adjusting your filters or search terms to find what you're looking for."
                }
              </p>
              {activeFilters.length > 0 && (
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              )}
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
        </>
      )}
    </div>
  );
}
