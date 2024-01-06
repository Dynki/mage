"use client";

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { walletConnectProvider, EIP6963Connector } from '@web3modal/wagmi'
import { publicProvider } from 'wagmi/providers/public'

import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { arbitrum, mainnet } from 'viem/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

type Web3ModalProviderType = {
  children: React.ReactNode;
};

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = 'd8aceda8594e5a433499bbf0e32fc52c'

// 2. Create wagmiConfig

// const chains = [mainnet, arbitrum]
// const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 2. Create wagmiConfig
const { chains, publicClient } = configureChains(
  [mainnet],
  [walletConnectProvider({ projectId }), publicProvider()]
)

const metadata = {
  autoConnect: false,
  name: 'Mage NFT',
  description: 'DEFI NFT Marketplace',
  url: 'https://www.mage-nft.xyz/',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: [
    new WalletConnectConnector({ chains, options: { projectId, showQrModal: false, metadata } }),
    new EIP6963Connector({ chains }),
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({ chains, options: { appName: metadata.name } })
  ],
  publicClient
})

// 3. Create modal
createWeb3Modal({ 
  wagmiConfig, 
  projectId, 
  chains
})

export function Web3Modal({ children }: Web3ModalProviderType) {
  
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}