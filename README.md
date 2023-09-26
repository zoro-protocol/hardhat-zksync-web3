# hardhat-zksync-web3

[Hardhat](https://hardhat.org/) plugin that extends the [Hardhat Runtime Environment](https://hardhat.org/advanced/hardhat-runtime-environment) with the [`zksync-web3`](https://era.zksync.io/docs/api/js/) wallet.

Developers can create the `zksync-web3.Wallet` with either a private key or keystore file. If a keystore file is used, the user is prompted for the keystore password. Keystores are best for secure scripts that do not pollute project directories with plaintext private keys stored in `.env` files.

## Installation

```bash
npm install hardhat-zksync-web3 hardhat @nomiclabs/hardhat-ethers ethers @matterlabs/hardhat-zksync-deploy zksync-web3
```

Import the plugin in your `hardhat.config.js`:

```js
require("hardhat-zksync-web3");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "hardhat-zksync-web3";
```

## Required plugins

- [@nomiclabs/hardhat-ethers](https://github.com/NomicFoundation/hardhat/tree/main/packages/hardhat-ethers)
- [@matterlabs/hardhat-zksync-deploy](https://github.com/matter-labs/hardhat-zksync/tree/main/packages/hardhat-zksync-deploy)

## Environment extensions

This plugin extends the Hardhat Runtime Environment by adding a `getZkWallet()` function that returns a `zksync-web3.Wallet` connected to a `zksync-web3.Provider` and `ethers.Provider` for the current L1 and L2 network.

## Configuration

This plugin extends the `HardhatUserConfig`'s `NetworkUserConfig` object with an optional
`zkWallet` field.

This is an example of how to set it:

```ts
const config: HardhatUserConfig = {
  networks: {
    zkLocal: {
      url: "http://localhost:3050",
      ethNetwork: "http://localhost:8545",
      chainId: 270,
      zksync: true,
      zkWallet: {
        privateKey: ETH_PK // Account private key
      }
    },
    zkTestnet: {
      url: "https://testnet.era.zksync.dev",
      ethNetwork: "goerli", // RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      chainId: 280,
      zksync: true,
      verifyURL:
        "https://zksync2-testnet-explorer.zksync.dev/contract_verification", // Verification endpoint
      zkWallet: {
        keystore: ETH_KEYSTORE // Path to password protected keystore file
      }
    }
  }
};
```

## Usage

There are no additional steps you need to take for this plugin to work.

Install it and access the wallet through the Hardhat Runtime Environment anywhere
you need it (tasks, scripts, tests, etc).

If using a keystore file, enter the password when prompted by the task, script, test, etc.
