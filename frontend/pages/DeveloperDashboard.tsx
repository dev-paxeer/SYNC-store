import { useQuery } from '@tanstack/react-query';
import { 
  BarChart3, 
  Download, 
  Star, 
  DollarSign, 
  TrendingUp,
  Plus,
  Eye,
  Users,
  Calendar
} from 'lucide-react';
import { useAuth, useBackend } from '../lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

export function DeveloperDashboard() {
  const { user, isAuthenticated } = useAuth();
  const backend = useBackend();
  const { toast } = useToast();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['developer-dashboard'],
    queryFn: () => backend.developer.getDashboard(),
    enabled: isAuthenticated && user?.is_developer,
  });

  if (!isAuthenticated) {
    return (
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Sign in to access developer dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Create an account or sign in to manage your apps and view analytics.
          </p>
          <Button asChild>
            <Link to="/">Browse Apps</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!user?.is_developer) {
    return (
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Developer Access Required</h1>
          <p className="text-muted-foreground mb-6">
            You need developer access to view this dashboard. Contact support to become a developer.
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-muted rounded-2xl" />
            <div className="h-96 bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats;
  const recentApps = dashboardData?.recent_apps || [];
  const analyticsData = dashboardData?.analytics_data || [];

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Developer Dashboard</h1>
          <p className="text-muted-foreground">Manage your apps and track performance</p>
        </div>
        <Button asChild>
          <Link to="/developer/submit">
            <Plus className="w-4 h-4 mr-2" />
            Submit New App
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Apps</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_apps || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pending_reviews || 0} pending review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_downloads?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.monthly_downloads || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.average_rating?.toFixed(1) || '0.0'}</div>
            <p className="text-xs text-muted-foreground">
              Across all apps
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.monthly_revenue?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Apps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Your Apps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentApps.length > 0 ? (
              <div className="space-y-4">
                {recentApps.map((app) => (
                  <div key={app.id} className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{app.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span>v{app.version}</span>
                        <div className="flex items-center space-x-1">
                          <Download className="w-3 h-3" />
                          <span>{app.downloads_count.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{app.rating_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={app.status === 'published' ? 'default' : 'secondary'}>
                      {app.status}
                    </Badge>
                  </div>
                ))}
                
                <div className="text-center pt-4">
                  <Button variant="outline" asChild>
                    <Link to="/developer/apps">View All Apps</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No apps yet</h3>
                <p className="text-muted-foreground mb-4">
                  Submit your first app to get started
                </p>
                <Button asChild>
                  <Link to="/developer/submit">
                    <Plus className="w-4 h-4 mr-2" />
                    Submit App
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Downloads Over Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsData.length > 0 ? (
              <div className="space-y-4">
                <div className="h-64 flex items-end space-x-2">
                  {analyticsData.slice(-14).map((data, index) => {
                    const maxDownloads = Math.max(...analyticsData.map(d => d.downloads));
                    const height = maxDownloads > 0 ? (data.downloads / maxDownloads) * 200 : 0;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-primary rounded-t-sm min-h-[4px]"
                          style={{ height: `${height}px` }}
                        />
                        <span className="text-xs text-muted-foreground mt-2 transform -rotate-45 origin-left">
                          {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {analyticsData.reduce((sum, data) => sum + data.downloads, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      ${analyticsData.reduce((sum, data) => sum + data.revenue, 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No analytics data</h3>
                <p className="text-muted-foreground">
                  Analytics will appear once you have published apps with downloads
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link to="/developer/submit">
                <Plus className="w-6 h-6 mb-2" />
                Submit New App
              </Link>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link to="/developer/analytics">
                <BarChart3 className="w-6 h-6 mb-2" />
                View Analytics
              </Link>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link to="/developer/reviews">
                <Star className="w-6 h-6 mb-2" />
                Manage Reviews
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
