INSERT INTO categories (name, slug, description, icon, is_web3) VALUES
('DeFi', 'defi', 'Decentralized Finance applications', '💰', true),
('NFT & Gaming', 'nft-gaming', 'NFT marketplaces and blockchain games', '🎮', true),
('Wallets', 'wallets', 'Cryptocurrency and Web3 wallets', '👛', true),
('Social', 'social', 'Social networking and communication apps', '💬', false),
('Productivity', 'productivity', 'Tools and utilities for productivity', '⚡', false),
('Entertainment', 'entertainment', 'Media and entertainment applications', '🎬', false),
('Education', 'education', 'Learning and educational resources', '📚', false),
('Tools', 'tools', 'Developer tools and utilities', '🔧', false);

INSERT INTO developers (name, email, github_username, verified) VALUES
('Web3 Labs', 'contact@web3labs.com', 'web3labs', true),
('DeFi Protocol', 'dev@defiprotocol.com', 'defiprotocol', true),
('Crypto Games Studio', 'hello@cryptogames.io', 'cryptogames', false);
