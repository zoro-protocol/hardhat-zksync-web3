import { Wallet } from "zksync-web3";
import { ZkWalletConfig } from "hardhat/types";

export type Handler = (zkWallet: ZkWalletConfig) => Promise<Wallet>;

export interface HandlerRegistry {
  [index: string]: Handler;
}

export type OracleConstructorArgs = [string, string, string];
