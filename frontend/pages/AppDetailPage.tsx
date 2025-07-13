import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Download, 
  Star, 
  Shield, 
  Zap, 
  Globe, 
  Github, 
  Smartphone,
  User,
  MessageSquare,
  ExternalLink,
  Share,
  Heart,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { useAuth, useBackend } from '../lib/auth';

export function AppDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const backend = useBackend();
  
  const [reviewForm, setReviewForm] = useState({
    rating: '',
    title: '',
    comment: ''
  });

  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  const { data: app, isLoading } = useQuery({
    queryKey: ['app', slug],
    queryFn: () => backend.apps.getApp({ slug: slug! }),
    enabled: !!slug,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['app-reviews', slug],
    queryFn: () => backend.apps.listReviews({ slug: slug! }),
    enabled: !!slug,
  });

  const downloadMutation = useMutation({
    mutationFn: () => backend.apps.downloadApp({ slug: slug! }),
    onSuccess: (data) => {
      const link = document.createElement('a');
      link.href = data.download_url;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: `${data.filename} is being downloaded.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['app', slug] });
      queryClient.invalidateQueries({ queryKey: ['user-downloads'] });
    },
    onError: (error: any) => {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: error.message || "Unable to download the app. Please try again.",
        variant: "destructive",
      });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: () => backend.apps.createReview({
      slug: slug!,
      rating: parseInt(reviewForm.rating),
      title: reviewForm.title || undefined,
      comment: reviewForm.comment || undefined,
    }),
    onSuccess: () => {
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      setReviewForm({
        rating: '',
        title: '',
        comment: ''
      });
      queryClient.invalidateQueries({ queryKey: ['app-reviews', slug] });
      queryClient.invalidateQueries({ queryKey: ['app', slug] });
    },
    onError: (error: any) => {
      console.error('Review error:', error);
      toast({
        title: "Review Failed",
        description: error.message || "Unable to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const wishlistMutation = useMutation({
    mutationFn: () => backend.auth.addToWishlist({ app_id: app!.id }),
    onSuccess: () => {
      toast({
        title: "Added to Wishlist",
        description: `${app!.name} has been added to your wishlist.`,
      });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (error: any) => {
      console.error('Wishlist error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add to wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-12 bg-muted rounded-2xl w-96 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-80 bg-muted rounded-3xl mb-6" />
              <div className="h-48 bg-muted rounded-2xl" />
            </div>
            <div className="h-96 bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-foreground mb-4">App Not Found</h1>
          <p className="text-muted-foreground">The app you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const formatDownloads = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleDownload = () => {
    downloadMutation.mutate();
  };

  const handleWishlist = () => {
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

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to submit a review.",
        variant: "destructive",
      });
      return;
    }
    
    if (!reviewForm.rating) {
      toast({
        title: "Missing Information",
        description: "Please select a rating.",
        variant: "destructive",
      });
      return;
    }
    reviewMutation.mutate();
  };

  const nextScreenshot = () => {
    if (app.screenshots && app.screenshots.length > 0) {
      setCurrentScreenshot((prev) => (prev + 1) % app.screenshots.length);
    }
  };

  const prevScreenshot = () => {
    if (app.screenshots && app.screenshots.length > 0) {
      setCurrentScreenshot((prev) => (prev - 1 + app.screenshots.length) % app.screenshots.length);
    }
  };

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* App Header */}
          <div className="flex items-start space-x-6 mb-8">
            <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center flex-shrink-0 shadow-sm">
              {app.icon_url ? (
                <img 
                  src={app.icon_url} 
                  alt={app.name}
                  className="w-20 h-20 rounded-2xl"
                />
              ) : (
                <span className="text-3xl font-bold text-muted-foreground">
                  {app.name.charAt(0)}
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">{app.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">{app.developer_name}</p>
              
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{app.rating_average.toFixed(1)}</span>
                  <span className="text-muted-foreground">({app.rating_count} reviews)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">{formatDownloads(app.downloads_count)} downloads</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="secondary" className="text-sm">{app.category_name}</Badge>
                {app.is_web3 && (
                  <Badge variant="secondary" className="text-sm">
                    <Zap className="w-3 h-3 mr-1" />
                    Web3
                  </Badge>
                )}
                {app.smart_contract_verified && (
                  <Badge variant="secondary" className="text-sm">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={handleDownload} 
                  disabled={downloadMutation.isPending || !app.apk_url}
                  size="lg"
                  className="px-8"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {downloadMutation.isPending ? 'Downloading...' : 'Get'}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleWishlist}
                  disabled={wishlistMutation.isPending}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  {wishlistMutation.isPending ? 'Adding...' : 'Wishlist'}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="lg">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Report Issue
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Screenshots */}
          {app.screenshots && app.screenshots.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Screenshots</h2>
              <div className="relative">
                <div className="aspect-[16/10] bg-muted rounded-2xl overflow-hidden mb-4">
                  <img
                    src={app.screenshots[currentScreenshot].url}
                    alt={app.screenshots[currentScreenshot].caption || `${app.name} screenshot`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {app.screenshots.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                      onClick={prevScreenshot}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                      onClick={nextScreenshot}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
                
                {/* Thumbnail Navigation */}
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {app.screenshots.map((screenshot, index) => (
                    <button
                      key={screenshot.id}
                      onClick={() => setCurrentScreenshot(index)}
                      className={`flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentScreenshot ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <img
                        src={screenshot.url}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">About this app</h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              {app.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Web3 Features */}
          {app.is_web3 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Web3 Features</h2>
              <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-orange-950/30 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {app.blockchain_networks && app.blockchain_networks.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Supported Networks</h3>
                      <div className="flex flex-wrap gap-2">
                        {app.blockchain_networks.map((network) => (
                          <Badge key={network} variant="outline" className="text-sm">
                            {network}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Requirements</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {app.wallet_required && <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span>Web3 wallet required</span>
                      </div>}
                      {app.smart_contract_verified && <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span>Smart contracts verified</span>
                      </div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-8">Reviews & Ratings</h2>
            
            {/* Write Review */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Write a Review</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="rating">Rating *</Label>
                      <Select value={reviewForm.rating} onValueChange={(value) => setReviewForm(prev => ({ ...prev, rating: value }))}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                          <SelectItem value="4">⭐⭐⭐⭐ Good</SelectItem>
                          <SelectItem value="3">⭐⭐⭐ Average</SelectItem>
                          <SelectItem value="2">⭐⭐ Poor</SelectItem>
                          <SelectItem value="1">⭐ Terrible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="title">Review Title</Label>
                      <Input
                        id="title"
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Brief summary of your experience"
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="comment">Review</Label>
                      <Textarea
                        id="comment"
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Share your thoughts about this app..."
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                    
                    <Button type="submit" disabled={reviewMutation.isPending} size="lg">
                      {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Sign in to write a review</p>
                    <Button>Sign In</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews List */}
            {reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
              <div className="space-y-6">
                {reviewsData.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-semibold text-foreground">{review.user_name}</span>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-muted-foreground/30'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.title && (
                            <h4 className="font-semibold text-foreground mb-3">{review.title}</h4>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No reviews yet. Be the first to review this app!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Download Card */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                onClick={handleDownload} 
                disabled={downloadMutation.isPending || !app.apk_url}
                className="w-full mb-6"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                {downloadMutation.isPending ? 'Downloading...' : 'Download APK'}
              </Button>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span className="font-medium">{app.version}</span>
                </div>
                {app.apk_size && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium">{formatFileSize(app.apk_size)}</span>
                  </div>
                )}
                {app.min_android_version && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min Android:</span>
                    <span className="font-medium">{app.min_android_version}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Downloads:</span>
                  <span className="font-medium">{formatDownloads(app.downloads_count)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="font-medium">
                    {new Date(app.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Developer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Developer</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">{app.developer_name}</h3>
                </div>
                
                <div className="flex flex-col space-y-3">
                  {app.website_url && (
                    <a 
                      href={app.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-primary hover:text-primary/80 text-sm transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  
                  {app.github_repo && (
                    <a 
                      href={app.github_repo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-primary hover:text-primary/80 text-sm transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>Source Code</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5" />
                <span>App Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                {app.package_name && (
                  <div>
                    <span className="text-muted-foreground block mb-2">Package:</span>
                    <div className="font-mono text-xs bg-muted p-3 rounded-lg break-all">
                      {app.package_name}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{app.category_name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published:</span>
                  <span className="font-medium">
                    {new Date(app.created_at).toLocaleDateString()}
                  </span>
                </div>

                {app.permissions && app.permissions.length > 0 && (
                  <div>
                    <span className="text-muted-foreground block mb-2">Permissions:</span>
                    <div className="space-y-2">
                      {app.permissions.slice(0, 3).map((permission, index) => (
                        <div key={index} className="text-xs bg-muted p-2 rounded">
                          {permission}
                        </div>
                      ))}
                      {app.permissions.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{app.permissions.length - 3} more permissions
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
