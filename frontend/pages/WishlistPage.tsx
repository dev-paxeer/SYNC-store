import { useQuery } from '@tanstack/react-query';
import { Heart, Download, Star } from 'lucide-react';
import { useAuth, useBackend } from '../lib/auth';
import { AppCard } from '../components/AppCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const backend = useBackend();

  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => backend.auth.getWishlist(),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Sign in to view your wishlist</h1>
          <p className="text-muted-foreground mb-6">
            Keep track of apps you want to download later by adding them to your wishlist.
          </p>
          <Button asChild>
            <Link to="/">Browse Apps</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const apps = data?.apps || [];

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
        </div>
        <p className="text-muted-foreground">
          {apps.length} {apps.length === 1 ? 'app' : 'apps'} in your wishlist
        </p>
      </div>

      {/* Apps Grid */}
      {apps.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {apps.map((app) => (
            <div key={app.id} className="group">
              <Link to={`/app/${app.slug}`} className="block">
                <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                  <div className="p-4">
                    {/* App Icon */}
                    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-3 shadow-sm">
                      {app.icon_url ? (
                        <img 
                          src={app.icon_url} 
                          alt={app.name}
                          className="w-14 h-14 rounded-xl"
                        />
                      ) : (
                        <span className="text-xl font-bold text-muted-foreground">
                          {app.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* App Info */}
                    <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors mb-1">
                      {app.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{app.developer_name}</p>
                    <p className="text-sm text-muted-foreground mb-3">{app.category_name}</p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{app.rating_average.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{app.downloads_count >= 1000 ? `${(app.downloads_count / 1000).toFixed(1)}K` : app.downloads_count}</span>
                      </div>
                    </div>

                    {/* Added Date */}
                    <div className="text-xs text-muted-foreground mt-2">
                      Added {new Date(app.added_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6">
            Start adding apps you're interested in to keep track of them.
          </p>
          <Button asChild>
            <Link to="/">Browse Apps</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
