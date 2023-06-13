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

        it("Should be right next ID", async function () {
            const { quasar } = await loadFixture(deployFixture);

            expect(await quasar.getNextID()).to.equal(1);
        });
    });

    describe("Add currency", function () {
        it("Should add currency", async function () {
            const { quasar } = await loadFixture(deployFixture);
            const name = "currency"
            const symbol = "CRN"

            await quasar.addCurrency(name, symbol);

            const currency = await quasar.getCurrencyMetadata(1);

            expect(currency.name).to.equal(name);
            expect(currency.symbol).to.equal(symbol);
        });

        it("Should add several currencies", async function () {
            const { quasar } = await loadFixture(deployFixture);
            const name1 = "currency1";
            const symbol1 = "CRN1";
            const name2 = "currency2";
            const symbol2 = "CRN2";
            const name3 = "currency3";
            const symbol3 = "CRN3";

            await quasar.addCurrency(name1, symbol1);
            await quasar.addCurrency(name2, symbol2);
            await quasar.addCurrency(name3, symbol3);

            const currency1 = await quasar.getCurrencyMetadata(1);
            const currency2 = await quasar.getCurrencyMetadata(2);
            const currency3 = await quasar.getCurrencyMetadata(3);

            expect(currency1.name).to.equal(name1);
            expect(currency1.symbol).to.equal(symbol1);
            expect(currency2.name).to.equal(name2);
            expect(currency2.symbol).to.equal(symbol2);
            expect(currency3.name).to.equal(name3);
            expect(currency3.symbol).to.equal(symbol3);
        });

        it("Should emit event", async function () {
            const { quasar } = await loadFixture(deployFixture);
            const name = "currency"
            const symbol = "CRN"

            const tx = quasar.addCurrency(name, symbol);

            await expect(tx).to.emit(quasar, "CurrencyAdded").withArgs(1, name, symbol);
        });

        it("Should not add currency for not owner", async function () {
            const { quasar, address1 } = await loadFixture(deployFixture);
            const name = "currency"
            const symbol = "CRN"

            const tx = quasar.connect(address1).addCurrency(name, symbol);

            await expect(tx).to.be.revertedWith("Ownable: caller is not the owner")
        });

        it("Should not add currency with blank name", async function () {
            const { quasar} = await loadFixture(deployFixture);
            const name = ""
            const symbol = "CRN"

            const tx = quasar.addCurrency(name, symbol);

            await expect(tx).to.be.revertedWith("Quasar: name cannot be blank")
        });

        it("Should not add currency with blank symbol", async function () {
            const { quasar} = await loadFixture(deployFixture);
            const name = "currency"
            const symbol = ""

            const tx = quasar.addCurrency(name, symbol);

            await expect(tx).to.be.revertedWith("Quasar: symbol cannot be blank")
        });
    });

    describe("Update currency", function () {
        it("Should update currency", async function () {
            const { quasar } = await loadFixture(deployFixture);
            const name = "currency";
            const symbol = "CRN";

            const newName = "Ncurrency";
            const newSymbol = "NCRN";

            await quasar.addCurrency(name, symbol);
            await quasar.updateCurrency(1, newName, newSymbol);

            const currency = await quasar.getCurrencyMetadata(1);

            expect(currency.name).to.equal(newName);
            expect(currency.symbol).to.equal(newSymbol);
        });

        it("Should update several currencies", async function () {
            const { quasar } = await loadFixture(deployFixture);
            const name1 = "currency1";
            const symbol1 = "CRN1";
            const name2 = "currency2";
            const symbol2 = "CRN2";
            const name3 = "currency3";
            const symbol3 = "CRN3";

            const newName1 = "Ncurrency1";
            const newSymbol1 = "NCRN1";
            const newName2 = "Ncurrency2";
            const newSymbol2 = "NCRN2";

            await quasar.addCurrency(name1, symbol1);
            await quasar.addCurrency(name2, symbol2);
            await quasar.addCurrency(name3, symbol3);

            await quasar.updateCurrency(1, newName1, newSymbol1);
            await quasar.updateCurrency(2, newName2, newSymbol2);

            const currency1 = await quasar.getCurrencyMetadata(1);
            const currency2 = await quasar.getCurrencyMetadata(2);
            const currency3 = await quasar.getCurrencyMetadata(3);

            expect(currency1.name).to.equal(newName1);
            expect(currency1.symbol).to.equal(newSymbol1);
            expect(currency2.name).to.equal(newName2);
            expect(currency2.symbol).to.equal(newSymbol2);
            expect(currency3.name).to.equal(name3);
            expect(currency3.symbol).to.equal(symbol3);
        });

        it("Should mot update currency for not contract owner", async function () {
            const { quasar, address1 } = await loadFixture(deployFixture);
            const name = "currency";
            const symbol = "CRN";

            const newName = "Ncurrency";
            const newSymbol = "NCRN";

            await quasar.addCurrency(name, symbol);
            const tx = quasar.connect(address1).updateCurrency(1, newName, newSymbol);

            await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should not update currency with blank name", async function () {
            const { quasar} = await loadFixture(deployFixture);
            const name = "currency";
            const symbol = "CRN";

            const newName = "";
            const newSymbol = "NCRN";

            await quasar.addCurrency(name, symbol);
            const tx = quasar.updateCurrency(1, newName, newSymbol);

            await expect(tx).to.be.revertedWith("Quasar: name cannot be blank");
        });

        it("Should not update currency with blank symbol", async function () {
            const { quasar} = await loadFixture(deployFixture);
            const name = "currency";
            const symbol = "CRN";

            const newName = "Ncurrency";
            const newSymbol = "";

            await quasar.addCurrency(name, symbol);
            const tx = quasar.updateCurrency(1, newName, newSymbol);

            await expect(tx).to.be.revertedWith("Quasar: symbol cannot be blank");
        });

        it("Should mot update currency if not exist", async function () {
            const { quasar} = await loadFixture(deployFixture);
            const newName = "Ncurrency";
            const newSymbol = "NCRN";

            const tx = quasar.updateCurrency(1, newName, newSymbol);

            await expect(tx).to.be.revertedWith("Quasar: currency should exist");
        });
    });
})