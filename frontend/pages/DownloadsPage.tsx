import { useQuery } from '@tanstack/react-query';
import { Download, Calendar, Star } from 'lucide-react';
import { useAuth, useBackend } from '../lib/auth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function DownloadsPage() {
  const { isAuthenticated } = useAuth();
  const backend = useBackend();

  const { data, isLoading } = useQuery({
    queryKey: ['user-downloads'],
    queryFn: () => backend.auth.getUserDownloads(),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <Download className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Sign in to view your downloads</h1>
          <p className="text-muted-foreground mb-6">
            Keep track of all the apps you've downloaded from Web3Store.
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
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-lg" />
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
          <Download className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-foreground">My Downloads</h1>
        </div>
        <p className="text-muted-foreground">
          {apps.length} {apps.length === 1 ? 'app' : 'apps'} downloaded
        </p>
      </div>

      {/* Downloads List */}
      {apps.length > 0 ? (
        <div className="space-y-4">
          {apps.map((app) => (
            <Link key={app.id} to={`/app/${app.slug}`} className="block group">
              <div className="flex items-center space-x-4 p-4 bg-card rounded-xl border border-border hover:shadow-sm transition-all duration-200">
                {/* App Icon */}
                <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                  {app.icon_url ? (
                    <img 
                      src={app.icon_url} 
                      alt={app.name}
                      className="w-14 h-14 rounded-lg"
                    />
                  ) : (
                    <span className="text-xl font-bold text-muted-foreground">
                      {app.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* App Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {app.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{app.developer_name}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                    <span>{app.category_name}</span>
                    <span>v{app.version}</span>
                  </div>
                </div>

                {/* Download Info */}
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Downloaded {new Date(app.downloaded_at).toLocaleDateString()}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Again
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Download className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No downloads yet</h3>
          <p className="text-muted-foreground mb-6">
            Start downloading apps to see them here.
          </p>
          <Button asChild>
            <Link to="/">Browse Apps</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
