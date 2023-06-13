import "@nomicfoundation/hardhat-toolbox";
import {task} from "hardhat/config";
import {deploy} from "./scripts/Quasar";

task("deploy", "Deploy contract").setAction(async (args, hre) => {
  await hre.run("compile");
  await deploy(hre);
});

module.exports = {
  solidity: "0.8.18",
  mocha: {
    timeout: 200000,
  },
  networks: {
    zkEVM: {
      url: process.env.PROVIDER_URL,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    zkEVMTest: {
      url: process.env.PROVIDER_URL,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY as string,
    customChains: [
      {
        network: "zkEVM",
        chainId: 1101,
        urls: {
          apiURL: "https://zkevm.polygonscan.com/api",
          browserURL: "https://zkevm.polygonscan.com",
        },
      },
      {
        network: "zkEVMTest",
        chainId: 1442,
        urls: {
          apiURL: "https://explorer.public.zkevm-test.net/api",
          browserURL: "https://explorer.public.zkevm-test.net",
        },
      },
    ],
  },
};