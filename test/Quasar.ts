import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("Quasar unit tests", function () {
    async function deployFixture() {
        const [owner, address1, address2, address3] = await ethers.getSigners();

        const Quasar = await ethers.getContractFactory("Quasar");
        const quasar = await Quasar.deploy();

        return {
            quasar,
            owner,
            address1,
            address2,
            address3,
        };
    }

    describe("Deployment", function () {
        it("Should deploy with proper address", async function () {
            const { quasar } = await loadFixture(deployFixture);

            expect(await quasar.getAddress()).to.be.properAddress;
        });

        it("Should be right owner", async function () {
            const { quasar, owner } = await loadFixture(deployFixture);

            expect(await quasar.owner()).to.equal(owner.address);
        });
    });
})