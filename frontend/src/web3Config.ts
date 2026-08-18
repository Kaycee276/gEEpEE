import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia, mainnet, sepolia } from 'wagmi/chains';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '3a8170812b53d0fd9f687f4203d1328a';

export const web3Config = getDefaultConfig({
  appName: 'gEEpEE Autonomous Vault Agent',
  projectId: projectId,
  chains: [baseSepolia, base, mainnet, sepolia],
  ssr: false,
});
