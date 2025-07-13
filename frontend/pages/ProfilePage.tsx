import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  User, 
  MapPin, 
  Globe, 
  Github, 
  Twitter, 
  Calendar,
  Download,
  Star,
  Heart,
  Settings,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { useAuth, useBackend } from '../lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

export function ProfilePage() {
  const { userId } = useParams<{ userId?: string }>();
  const { user: currentUser, isAuthenticated } = useAuth();
  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    location: '',
    website: '',
    twitter_handle: '',
    github_handle: '',
    public_profile: true,
    show_email: false,
    show_downloads: true,
    show_reviews: true
  });

  const targetUserId = userId ? parseInt(userId) : undefined;
  const isOwnProfile = !targetUserId || (currentUser && currentUser.id === targetUserId);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile', targetUserId],
    queryFn: () => backend.users.getProfile({ user_id: targetUserId }),
    enabled: isAuthenticated,
  });

  const { data: downloadsData } = useQuery({
    queryKey: ['user-downloads'],
    queryFn: () => backend.auth.getUserDownloads(),
    enabled: isAuthenticated && isOwnProfile,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => backend.users.updateProfile(data),
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Sign in to view profiles</h1>
          <p className="text-muted-foreground mb-6">
            Create an account or sign in to view user profiles and manage your own.
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
          <div className="h-32 bg-muted rounded-2xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-48 bg-muted rounded-2xl" />
              <div className="h-64 bg-muted rounded-2xl" />
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-muted rounded-2xl" />
              <div className="h-48 bg-muted rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground">
            The profile you're looking for doesn't exist or is private.
          </p>
        </div>
      </div>
    );
  }

  const profile = profileData.profile;

  const handleEditStart = () => {
    setEditForm({
      bio: profile.bio || '',
      location: profile.location || '',
      website: profile.website || '',
      twitter_handle: profile.twitter_handle || '',
      github_handle: profile.github_handle || '',
      public_profile: profile.public_profile,
      show_email: profile.show_email,
      show_downloads: profile.show_downloads,
      show_reviews: profile.show_reviews
    });
    setIsEditing(true);
  };

  const handleEditSave = () => {
    updateProfileMutation.mutate(editForm);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const getDisplayName = () => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile.first_name) {
      return profile.first_name;
    }
    return profile.username;
  };

  const getInitials = () => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    if (profile.first_name) {
      return profile.first_name.charAt(0).toUpperCase();
    }
    return profile.username.charAt(0).toUpperCase();
  };

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar_url} alt={getDisplayName()} />
              <AvatarFallback className="text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{getDisplayName()}</h1>
                <span className="text-xl text-muted-foreground">@{profile.username}</span>
              </div>
              
              {profile.bio && (
                <p className="text-muted-foreground mb-4">{profile.bio}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profile.join_date).toLocaleDateString()}</span>
                </div>
                
                {profile.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                {profile.website && (
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-primary hover:text-primary/80"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Website</span>
                  </a>
                )}
                
                {profile.github_handle && (
                  <a 
                    href={`https://github.com/${profile.github_handle}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-primary hover:text-primary/80"
                  >
                    <Github className="w-4 h-4" />
                    <span>@{profile.github_handle}</span>
                  </a>
                )}
                
                {profile.twitter_handle && (
                  <a 
                    href={`https://twitter.com/${profile.twitter_handle}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-primary hover:text-primary/80"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>@{profile.twitter_handle}</span>
                  </a>
                )}
              </div>
            </div>
            
            {isOwnProfile && (
              <div className="flex space-x-2">
                {!isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleEditStart}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/settings">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleEditSave} disabled={updateProfileMutation.isPending}>
                      <Save className="w-4 h-4 mr-2" />
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                    <Button variant="outline" onClick={handleEditCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Edit Profile Form */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editForm.website}
                      onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="github">GitHub Username</Label>
                    <Input
                      id="github"
                      value={editForm.github_handle}
                      onChange={(e) => setEditForm(prev => ({ ...prev, github_handle: e.target.value }))}
                      placeholder="username"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="twitter">Twitter Username</Label>
                    <Input
                      id="twitter"
                      value={editForm.twitter_handle}
                      onChange={(e) => setEditForm(prev => ({ ...prev, twitter_handle: e.target.value }))}
                      placeholder="username"
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Privacy Settings</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="public-profile">Public Profile</Label>
                      <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
                    </div>
                    <Switch
                      id="public-profile"
                      checked={editForm.public_profile}
                      onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, public_profile: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-email">Show Email</Label>
                      <p className="text-sm text-muted-foreground">Display your email on your profile</p>
                    </div>
                    <Switch
                      id="show-email"
                      checked={editForm.show_email}
                      onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, show_email: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-downloads">Show Downloads</Label>
                      <p className="text-sm text-muted-foreground">Display your download history</p>
                    </div>
                    <Switch
                      id="show-downloads"
                      checked={editForm.show_downloads}
                      onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, show_downloads: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-reviews">Show Reviews</Label>
                      <p className="text-sm text-muted-foreground">Display your review history</p>
                    </div>
                    <Switch
                      id="show-reviews"
                      checked={editForm.show_reviews}
                      onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, show_reviews: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Downloads */}
          {(profile.show_downloads || isOwnProfile) && downloadsData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Downloaded Apps</span>
                  <Badge variant="secondary">{downloadsData.apps.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {downloadsData.apps.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {downloadsData.apps.slice(0, 6).map((app) => (
                      <Link key={app.id} to={`/app/${app.slug}`} className="block group">
                        <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                          <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center">
                            {app.icon_url ? (
                              <img 
                                src={app.icon_url} 
                                alt={app.name}
                                className="w-10 h-10 rounded-md"
                              />
                            ) : (
                              <span className="text-lg font-bold text-muted-foreground">
                                {app.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                              {app.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">{app.developer_name}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Download className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No apps downloaded yet</p>
                  </div>
                )}
                
                {downloadsData.apps.length > 6 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" asChild>
                      <Link to="/downloads">View All Downloads</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Downloads</span>
                </div>
                <span className="font-semibold">{profile.total_downloads}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">Reviews</span>
                </div>
                <span className="font-semibold">{profile.total_reviews}</span>
              </div>
              
              {profile.total_reviews > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-muted-foreground">Avg Rating</span>
                  </div>
                  <span className="font-semibold">{profile.average_rating_given.toFixed(1)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          {(profile.email || profile.website || profile.github_handle || profile.twitter_handle) && (
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profile.email}</span>
                  </div>
                )}
                
                {profile.website && (
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Website</span>
                  </a>
                )}
                
                {profile.github_handle && (
                  <a 
                    href={`https://github.com/${profile.github_handle}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80"
                  >
                    <Github className="w-4 h-4" />
                    <span>@{profile.github_handle}</span>
                  </a>
                )}
                
                {profile.twitter_handle && (
                  <a 
                    href={`https://twitter.com/${profile.twitter_handle}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>@{profile.twitter_handle}</span>
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
