import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia, mainnet, sepolia } from "wagmi/chains";

export const web3Config = getDefaultConfig({
  appName: "gEEpEE Autonomous Vault Agent",
  projectId: "geepee_hackathon_demo_project_id",
  chains: [baseSepolia, base, mainnet, sepolia],
  ssr: false,
});
