import { Chain } from "wagmi";

export const arbitrum: Chain = {
  id: 421613,
  name: "Arbitrum",
  network: "ARBITRUM",
  nativeCurrency: {
    name: "Arbitrum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://goerli-rollup.arbitrum.io/rpc",
  },
  blockExplorers: {
    default: { name: "arbiscan", url: "https://goerli.arbiscan.io" },
  },
  testnet: false,
};
