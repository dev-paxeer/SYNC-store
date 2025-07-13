import { Link } from 'react-router-dom';
import { Github, Twitter, Globe, Shield, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Web3Store</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              The premier destination for Web3 and decentralized applications. 
              Discover, download, and explore the future of mobile apps with confidence and security.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Categories</h3>
            <ul className="space-y-3">
              <li><Link to="/category/defi" className="text-muted-foreground hover:text-foreground transition-colors">DeFi</Link></li>
              <li><Link to="/category/nft-gaming" className="text-muted-foreground hover:text-foreground transition-colors">NFT & Gaming</Link></li>
              <li><Link to="/category/wallets" className="text-muted-foreground hover:text-foreground transition-colors">Wallets</Link></li>
              <li><Link to="/category/social" className="text-muted-foreground hover:text-foreground transition-colors">Social</Link></li>
              <li><Link to="/category/productivity" className="text-muted-foreground hover:text-foreground transition-colors">Productivity</Link></li>
              <li><Link to="/category/tools" className="text-muted-foreground hover:text-foreground transition-colors">Developer Tools</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Support & Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link to="/developer" className="text-muted-foreground hover:text-foreground transition-colors">Developer Portal</Link></li>
              <li><Link to="/legal/terms_of_service" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/legal/privacy_policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/legal/community_guidelines" className="text-muted-foreground hover:text-foreground transition-colors">Community Guidelines</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-muted-foreground text-sm">
            <span>© 2024 Web3Store. Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for the decentralized future.</span>
          </div>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/legal" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Legal</Link>
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Status</a>
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">API</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
