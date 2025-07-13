import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Download, Shield, Zap, MoreHorizontal, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth, useBackend } from '../lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AppWithDetails } from '~backend/apps/types';

interface AppCardProps {
  app: AppWithDetails;
  variant?: 'default' | 'featured' | 'compact' | 'hero';
  isInWishlist?: boolean;
}

export function AppCard({ app, variant = 'default', isInWishlist = false }: AppCardProps) {
  const { isAuthenticated } = useAuth();
  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [wishlistState, setWishlistState] = useState(isInWishlist);

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      if (wishlistState) {
        await backend.auth.removeFromWishlist({ app_id: app.id });
      } else {
        await backend.auth.addToWishlist({ app_id: app.id });
      }
    },
    onSuccess: () => {
      setWishlistState(!wishlistState);
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({
        title: wishlistState ? "Removed from Wishlist" : "Added to Wishlist",
        description: wishlistState 
          ? `${app.name} has been removed from your wishlist.`
          : `${app.name} has been added to your wishlist.`,
      });
    },
    onError: (error: any) => {
      console.error('Wishlist error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add apps to your wishlist.",
        variant: "destructive",
      });
      return;
    }
    
    wishlistMutation.mutate();
  };

  const formatDownloads = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (variant === 'hero') {
    return (
      <Link to={`/app/${app.slug}`} className="block group">
        <div className="relative bg-card rounded-3xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          {/* Hero Banner */}
          <div className="aspect-[2/1] bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 relative overflow-hidden">
            {app.banner_url ? (
              <img 
                src={app.banner_url} 
                alt={app.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-6xl font-bold mb-4">{app.name.charAt(0)}</div>
                  <div className="text-lg opacity-90">{app.category_name}</div>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {app.featured && (
              <Badge className="absolute top-4 left-4 bg-yellow-500 text-yellow-900 font-medium">
                Editor's Choice
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start space-x-4">
              {/* App Icon */}
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                {app.icon_url ? (
                  <img 
                    src={app.icon_url} 
                    alt={app.name}
                    className="w-14 h-14 rounded-xl"
                  />
                ) : (
                  <span className="text-2xl font-bold text-muted-foreground">
                    {app.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* App Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {app.name}
                </h3>
                <p className="text-muted-foreground mb-3">{app.developer_name}</p>
                
                {app.short_description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {app.short_description}
                  </p>
                )}

                {/* Web3 Badges */}
                <div className="flex items-center space-x-2 mb-4">
                  {app.is_web3 && (
                    <Badge variant="secondary" className="text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Web3
                    </Badge>
                  )}
                  {app.smart_contract_verified && (
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {app.category_name}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{app.rating_average.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{formatDownloads(app.downloads_count)}</span>
                  </div>
                  <div className="text-xs">
                    {app.apk_size ? `${(app.apk_size / (1024 * 1024)).toFixed(1)} MB` : 'Free'}
                  </div>
                </div>
              </div>

              {/* Action Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.preventDefault()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleWishlistToggle} disabled={wishlistMutation.isPending}>
                    <Heart className={`w-4 h-4 mr-2 ${wishlistState ? 'fill-red-500 text-red-500' : ''}`} />
                    {wishlistState ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem>Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link to={`/app/${app.slug}`} className="block group">
        <div className="relative bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
          {/* Banner Image */}
          <div className="aspect-[16/9] bg-gradient-to-r from-blue-500 to-purple-600 relative">
            {app.banner_url ? (
              <img 
                src={app.banner_url} 
                alt={app.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl font-bold mb-2">{app.name.charAt(0)}</div>
                  <div className="text-sm opacity-80">{app.category_name}</div>
                </div>
              </div>
            )}
            {app.featured && (
              <Badge className="absolute top-3 left-3 bg-yellow-500 text-yellow-900">
                Featured
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 h-8 w-8 p-0 bg-black/20 hover:bg-black/40 text-white"
              onClick={handleWishlistToggle}
            >
              <Heart className={`h-4 w-4 ${wishlistState ? 'fill-white' : ''}`} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start space-x-3">
              {/* App Icon */}
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                {app.icon_url ? (
                  <img 
                    src={app.icon_url} 
                    alt={app.name}
                    className="w-10 h-10 rounded-lg"
                  />
                ) : (
                  <span className="text-lg font-bold text-muted-foreground">
                    {app.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* App Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {app.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{app.developer_name}</p>
                
                {/* Web3 Badges */}
                <div className="flex items-center space-x-2 mb-2">
                  {app.is_web3 && (
                    <Badge variant="secondary" className="text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Web3
                    </Badge>
                  )}
                  {app.smart_contract_verified && (
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{app.rating_average.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{formatDownloads(app.downloads_count)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/app/${app.slug}`} className="block group">
        <div className="flex items-center space-x-3 p-3 bg-card rounded-xl border border-border hover:shadow-sm transition-all duration-200">
          {/* App Icon */}
          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
            {app.icon_url ? (
              <img 
                src={app.icon_url} 
                alt={app.name}
                className="w-10 h-10 rounded-lg"
              />
            ) : (
              <span className="text-lg font-bold text-muted-foreground">
                {app.name.charAt(0)}
              </span>
            )}
          </div>

          {/* App Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {app.name}
            </h4>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{app.category_name}</span>
              {app.is_web3 && (
                <Badge variant="secondary" className="text-xs">
                  Web3
                </Badge>
              )}
            </div>
          </div>

          {/* Rating & Actions */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{app.rating_average.toFixed(1)}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleWishlistToggle}
            >
              <Heart className={`h-4 w-4 ${wishlistState ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button size="sm" variant="outline" className="text-xs px-3">
              GET
            </Button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/app/${app.slug}`} className="block group">
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
        {/* App Icon */}
        <div className="p-4 pb-2">
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
          
          {/* Short Description */}
          {app.short_description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {app.short_description}
            </p>
          )}

          {/* Web3 Badges */}
          <div className="flex items-center space-x-2 mb-3">
            {app.is_web3 && (
              <Badge variant="secondary" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Web3
              </Badge>
            )}
            {app.smart_contract_verified && (
              <Badge variant="secondary" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{app.rating_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>{formatDownloads(app.downloads_count)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleWishlistToggle}
              >
                <Heart className={`h-4 w-4 ${wishlistState ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button size="sm" variant="outline" className="text-xs px-3">
                GET
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
