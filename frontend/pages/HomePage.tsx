import { useQuery } from '@tanstack/react-query';
import { Zap, TrendingUp, Clock, Star, ArrowRight, Sparkles } from 'lucide-react';
import backend from '~backend/client';
import { AppCard } from '../components/AppCard';
import { CategoryGrid } from '../components/CategoryGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-apps'],
    queryFn: () => backend.apps.getFeaturedApps(),
  });

  if (isLoading) {
    return (
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-12 bg-muted rounded-2xl w-96 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { featured_apps = [], trending_apps = [], new_apps = [] } = data || {};

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white mb-12 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center space-x-2 mb-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              New Platform
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Discover the Future of
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Decentralized Apps
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl">
            Explore Web3 applications, DeFi protocols, and blockchain tools that are reshaping the digital world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-white/90" asChild>
              <Link to="/category/defi">
                <Zap className="w-5 h-5 mr-2" />
                Explore Web3 Apps
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10" asChild>
              <Link to="/search">
                Browse All Categories
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Apps */}
      {featured_apps.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">Editor's Choice</h2>
                <p className="text-muted-foreground">Hand-picked apps by our team</p>
              </div>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/search?featured=true" className="flex items-center space-x-2">
                <span>See All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          
          {/* Hero Featured App */}
          {featured_apps[0] && (
            <div className="mb-8">
              <AppCard app={featured_apps[0]} variant="hero" />
            </div>
          )}
          
          {/* Other Featured Apps */}
          {featured_apps.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured_apps.slice(1).map((app) => (
                <AppCard key={app.id} app={app} variant="featured" />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Categories */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Browse Categories</h2>
            <p className="text-muted-foreground">Find apps by category and interest</p>
          </div>
        </div>
        <CategoryGrid />
      </section>

      {/* Trending Apps */}
      {trending_apps.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">Trending Now</h2>
                <p className="text-muted-foreground">Most popular apps this week</p>
              </div>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/search?sort=popular" className="flex items-center space-x-2">
                <span>See All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {trending_apps.slice(0, 8).map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </section>
      )}

      {/* New Apps */}
      {new_apps.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">New & Updated</h2>
                <p className="text-muted-foreground">Latest releases and updates</p>
              </div>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/search?sort=newest" className="flex items-center space-x-2">
                <span>See All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {new_apps.slice(0, 8).map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </section>
      )}

      {/* Web3 Spotlight */}
      <section className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-orange-950/30 rounded-3xl p-8 md:p-12 mb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Welcome to the Web3 Revolution
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover applications that leverage blockchain technology, cryptocurrency, and decentralized protocols. 
            From DeFi platforms to NFT marketplaces, explore the next generation of digital experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/category/defi">
                <Zap className="w-5 h-5 mr-2" />
                Explore DeFi Apps
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/category/nft-gaming">
                Discover NFT Games
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
