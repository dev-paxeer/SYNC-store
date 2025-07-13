import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Upload, 
  Image, 
  FileText, 
  Settings, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useAuth, useBackend } from '../lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 'basic', title: 'Basic Info', icon: FileText },
  { id: 'media', title: 'Media & Assets', icon: Image },
  { id: 'technical', title: 'Technical Details', icon: Settings },
  { id: 'review', title: 'Review & Submit', icon: CheckCircle }
];

export function SubmitAppPage() {
  const { user, isAuthenticated } = useAuth();
  const backend = useBackend();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    category_id: '',
    icon_url: '',
    banner_url: '',
    screenshots: [] as string[],
    version: '1.0.0',
    apk_url: '',
    apk_size: 0,
    package_name: '',
    min_android_version: '',
    target_android_version: '',
    permissions: [] as string[],
    is_web3: false,
    blockchain_networks: [] as string[],
    wallet_required: false,
    github_repo: '',
    website_url: ''
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => backend.apps.listCategories(),
  });

  const submitMutation = useMutation({
    mutationFn: () => backend.developer.submitApp(formData),
    onSuccess: (data) => {
      toast({
        title: "App Submitted Successfully",
        description: `Your app has been submitted for review. Submission ID: ${data.submission_id}`,
      });
      navigate('/developer');
    },
    onError: (error: any) => {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit app. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Sign in to submit apps</h1>
          <p className="text-muted-foreground mb-6">
            Create an account or sign in to submit your apps to Web3Store.
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
          <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Developer Access Required</h1>
          <p className="text-muted-foreground mb-6">
            You need developer access to submit apps. Contact support to become a developer.
          </p>
          <Button asChild>
            <Link to="/">Browse Apps</Link>
          </Button>
        </div>
      </div>
    );
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return formData.name && formData.description && formData.category_id;
      case 1: // Media
        return formData.icon_url;
      case 2: // Technical
        return formData.version && formData.package_name;
      case 3: // Review
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (!canProceed()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate();
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/developer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Submit New App</h1>
        <p className="text-muted-foreground">Follow the steps below to submit your app for review.</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : isActive 
                    ? 'border-primary text-primary' 
                    : 'border-muted-foreground text-muted-foreground'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{STEPS[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="app-name">App Name *</Label>
                <Input
                  id="app-name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Enter your app name"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category_id} onValueChange={(value) => updateFormData('category_id', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesData?.categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="short-description">Short Description</Label>
                <Input
                  id="short-description"
                  value={formData.short_description}
                  onChange={(e) => updateFormData('short_description', e.target.value)}
                  placeholder="Brief one-line description"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Detailed description of your app..."
                  rows={6}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="icon-url">App Icon URL *</Label>
                <Input
                  id="icon-url"
                  value={formData.icon_url}
                  onChange={(e) => updateFormData('icon_url', e.target.value)}
                  placeholder="https://example.com/icon.png"
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended size: 512x512px, PNG format
                </p>
              </div>
              
              <div>
                <Label htmlFor="banner-url">Banner Image URL</Label>
                <Input
                  id="banner-url"
                  value={formData.banner_url}
                  onChange={(e) => updateFormData('banner_url', e.target.value)}
                  placeholder="https://example.com/banner.png"
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended size: 1920x1080px, PNG/JPG format
                </p>
              </div>
              
              <div>
                <Label htmlFor="screenshots">Screenshots (URLs, one per line)</Label>
                <Textarea
                  id="screenshots"
                  value={formData.screenshots.join('\n')}
                  onChange={(e) => updateFormData('screenshots', e.target.value.split('\n').filter(url => url.trim()))}
                  placeholder="https://example.com/screenshot1.png&#10;https://example.com/screenshot2.png"
                  rows={4}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Add up to 8 screenshots. Recommended size: 1080x1920px
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="version">Version *</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => updateFormData('version', e.target.value)}
                    placeholder="1.0.0"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="package-name">Package Name *</Label>
                  <Input
                    id="package-name"
                    value={formData.package_name}
                    onChange={(e) => updateFormData('package_name', e.target.value)}
                    placeholder="com.example.myapp"
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="apk-url">APK Download URL</Label>
                <Input
                  id="apk-url"
                  value={formData.apk_url}
                  onChange={(e) => updateFormData('apk_url', e.target.value)}
                  placeholder="https://github.com/user/repo/releases/download/v1.0.0/app.apk"
                  className="mt-2"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-android">Minimum Android Version</Label>
                  <Input
                    id="min-android"
                    value={formData.min_android_version}
                    onChange={(e) => updateFormData('min_android_version', e.target.value)}
                    placeholder="7.0"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="target-android">Target Android Version</Label>
                  <Input
                    id="target-android"
                    value={formData.target_android_version}
                    onChange={(e) => updateFormData('target_android_version', e.target.value)}
                    placeholder="13.0"
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="github-repo">GitHub Repository</Label>
                  <Input
                    id="github-repo"
                    value={formData.github_repo}
                    onChange={(e) => updateFormData('github_repo', e.target.value)}
                    placeholder="https://github.com/user/repo"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website_url}
                    onChange={(e) => updateFormData('website_url', e.target.value)}
                    placeholder="https://myapp.com"
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Web3 Features</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is-web3">Web3 App</Label>
                    <p className="text-sm text-muted-foreground">Does your app use blockchain technology?</p>
                  </div>
                  <Switch
                    id="is-web3"
                    checked={formData.is_web3}
                    onCheckedChange={(checked) => updateFormData('is_web3', checked)}
                  />
                </div>
                
                {formData.is_web3 && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="wallet-required">Wallet Required</Label>
                        <p className="text-sm text-muted-foreground">Does your app require a Web3 wallet?</p>
                      </div>
                      <Switch
                        id="wallet-required"
                        checked={formData.wallet_required}
                        onCheckedChange={(checked) => updateFormData('wallet_required', checked)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="blockchain-networks">Supported Blockchain Networks</Label>
                      <Textarea
                        id="blockchain-networks"
                        value={formData.blockchain_networks.join('\n')}
                        onChange={(e) => updateFormData('blockchain_networks', e.target.value.split('\n').filter(n => n.trim()))}
                        placeholder="Ethereum&#10;Polygon&#10;Binance Smart Chain"
                        rows={3}
                        className="mt-2"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Review Your Submission</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {formData.name}</div>
                      <div><strong>Category:</strong> {categoriesData?.categories.find(c => c.id.toString() === formData.category_id)?.name}</div>
                      <div><strong>Version:</strong> {formData.version}</div>
                      {formData.is_web3 && <Badge>Web3 App</Badge>}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Technical Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Package:</strong> {formData.package_name}</div>
                      {formData.min_android_version && <div><strong>Min Android:</strong> {formData.min_android_version}</div>}
                      {formData.github_repo && <div><strong>GitHub:</strong> {formData.github_repo}</div>}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{formData.description}</p>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Review Process</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Your app will be reviewed by our team within 2-3 business days. You'll receive an email notification once the review is complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep} 
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <div className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {STEPS.length}
        </div>
        
        {currentStep < STEPS.length - 1 ? (
          <Button 
            onClick={nextStep} 
            disabled={!canProceed()}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={!canProceed() || submitMutation.isPending}
          >
            {submitMutation.isPending ? 'Submitting...' : 'Submit for Review'}
          </Button>
        )}
      </div>
    </div>
  );
}
