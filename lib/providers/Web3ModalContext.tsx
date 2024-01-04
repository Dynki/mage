"use client";

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'
import { arbitrum, mainnet } from 'viem/chains'

type Web3ModalProviderType = {
  children: React.ReactNode;
};

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = 'd8aceda8594e5a433499bbf0e32fc52c'

// 2. Create wagmiConfig
const metadata = {
  name: 'Mage NFT',
  description: 'DEFI NFT Marketplace',
  url: 'https://www.mage-nft.xyz/',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ 
  wagmiConfig, 
  projectId, 
  chains
})

export function Web3Modal({ children }: Web3ModalProviderType) {
  
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}