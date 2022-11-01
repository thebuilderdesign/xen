import { Chain, chain } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";
import { arbitrum } from "~/lib/chains/arbitrumMainnet";

export const xenContract = (contractChain?: Chain) => {
  switch (contractChain?.id) {
    case arbitrum.id:
      return {
        addressOrName: "0xf354B1bBB3D882BA607E76133e3754b464b3722E",
        contractInterface: XenCrypto.abi,
        chainId: contractChain?.id,
      };
    default:
      return {
        addressOrName: "0xf354B1bBB3D882BA607E76133e3754b464b3722E",
        contractInterface: XenCrypto.abi,
        chainId: chain.arbitrum.id,
      };
  }
};
