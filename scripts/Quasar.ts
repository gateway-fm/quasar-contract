import path from "path";
import fs from "fs";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const contractName = "Quasar";

const addressesDir = path.join(__dirname, "..", "addresses");

export async function deploy(hre: HardhatRuntimeEnvironment) {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contract with the account:", deployer.address);

    const Contract = await hre.ethers.getContractFactory(contractName);
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();

    console.log("Contract deployed to address:", address);

    if (hre.network.name === "zkEVM" || hre.network.name === "zkEVMTest") {
        await _saveContractAddresses({ address });

        console.log("Waiting 30 seconds before hre.etherscan verification...");
        await new Promise(f => setTimeout(f, 30000));

        await hre.run("verify:verify", {
            address: address,
            constructorArguments: [],
        });
    }
}

const _saveContractAddresses = async (addresses: { address: string }) => {
    const { address } = addresses;

    if (!fs.existsSync(addressesDir)) {
        fs.mkdirSync(addressesDir);
    }

    fs.writeFileSync(
        path.join(addressesDir, "/", contractName + "-contractAddress.json"),
        JSON.stringify({ [contractName]: address }),
    );
};
