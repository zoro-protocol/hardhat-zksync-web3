import "hardhat/types/config";
import "hardhat/types/runtime";
import { Wallet } from "zksync-web3";

declare module "hardhat/types/config" {
  export type ZkWalletConfig = object;

  export interface PrivateKeyConfig extends ZkWalletConfig {
    privateKey: string;
  }

  export interface KeystoreConfig extends ZkWalletConfig {
    keystore: string;
  }

  export interface HttpNetworkConfig {
    zkWallet: ZkWalletConfig;
  }

  export interface HardhatNetworkConfig {
    url: string;
    zkWallet: ZkWalletConfig;
  }

  export interface HardhatNetworkUserConfig {
    zkWallet?: ZkWalletConfig;
  }
}

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    getZkWallet: () => Promise<Wallet>;
    zkWallet?: Wallet;
  }
}
