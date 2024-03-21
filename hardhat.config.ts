import "@nomicfoundation/hardhat-toolbox";
import { task } from "hardhat/config";
import { deploy } from "./scripts/Quasar";

task("deploy", "Deploy contract").setAction(async (args, hre) => {
  await hre.run("compile");
  await deploy(hre);
});

module.exports = {
  solidity: "0.8.21",
  mocha: {
    timeout: 200000,
  },
  networks: {
    rollup: {
      url: process.env.RPC,
      accounts: [process.env.PK as string],
    }
  },
  etherscan: {
    apiKey: JSON.parse(`{"${process.env.CHAIN_NAME as string}":"secret"}`),
    customChains: [
      {
        network: process.env.CHAIN_NAME,
        chainId: parseInt(process.env.CHAIN_ID as string),
        urls: {
          apiURL: process.env.BLOCKSCOUT_URL_API,
          browserURL: process.env.BLOCKSCOUT_URL,
        },
      },
    ],
  },
};
