import fs from "fs";
import { Wallet, Provider } from "zksync-web3";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Invisible } from "enquirer";
import {
  HardhatRuntimeEnvironment,
  KeystoreConfig,
  PrivateKeyConfig,
  ZkWalletConfig,
} from "hardhat/types";
import "@nomiclabs/hardhat-ethers";
import { Handler, HandlerRegistry } from "./types";
import "./type-extensions";

const walletHandlers: HandlerRegistry = {
  keystore: getWalletFromKeystore as Handler,
  privateKey: getWalletFromPk as Handler,
};

async function getWalletFromPk(zkWallet: PrivateKeyConfig): Promise<Wallet> {
  const wallet: Wallet = new Wallet(zkWallet.privateKey);
  return wallet;
}

async function getWalletFromKeystore(
  zkWallet: KeystoreConfig,
): Promise<Wallet> {
  const prompt = new Invisible({ message: "Password: " });
  const password: string = await prompt.run();

  const keystoreJson: string = fs.readFileSync(zkWallet.keystore, "utf8");
  const wallet: Wallet = await Wallet.fromEncryptedJson(keystoreJson, password);

  return wallet;
}

async function getUnconnectedZkWallet(
  hre: HardhatRuntimeEnvironment,
): Promise<Wallet> {
  const config: ZkWalletConfig = hre.network.config.zkWallet;

  const key: string | undefined =
    config && Object.keys(walletHandlers).find((key) => key in config);

  if (typeof key === "undefined") {
    throw new Error(
      `Missing zkWallet configuration for network: "${hre.network.name}"`,
    );
  }

  const wallet: Wallet = await walletHandlers[key](config);

  return wallet;
}

export async function getZkWallet(
  hre: HardhatRuntimeEnvironment,
): Promise<Wallet> {
  if (hre.zkWallet instanceof Wallet) {
    return hre.zkWallet;
  }

  let wallet: Wallet = await getUnconnectedZkWallet(hre);

  const zkProvider: Provider = new Provider(hre.network.config.url);
  wallet = wallet.connect(zkProvider);
  wallet = wallet.connectToL1(hre.ethers.provider);

  hre.zkWallet = wallet;

  return wallet;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
extendEnvironment((hre: HardhatRuntimeEnvironment) => {
  hre.getZkWallet = getZkWallet.bind(null, hre);
});
