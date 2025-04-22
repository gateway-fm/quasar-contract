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
      const name = "currency";
      const symbol = "CRN";

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
      const name = "currency";
      const symbol = "CRN";

      const tx = quasar.addCurrency(name, symbol);

      await expect(tx).to.emit(quasar, "CurrencyAdded").withArgs(1, name, symbol);
    });

    it("Should not add currency for not owner", async function () {
      const { quasar, address1 } = await loadFixture(deployFixture);
      const name = "currency";
      const symbol = "CRN";

      const tx = quasar.connect(address1).addCurrency(name, symbol);

      await expect(tx).to.be.revertedWithCustomError(quasar, "OwnableUnauthorizedAccount");
    });

    it("Should not add currency with blank name", async function () {
      const { quasar } = await loadFixture(deployFixture);
      const name = "";
      const symbol = "CRN";

      const tx = quasar.addCurrency(name, symbol);

      await expect(tx).to.be.revertedWith("Quasar: name cannot be blank");
    });

    it("Should not add currency with blank symbol", async function () {
      const { quasar } = await loadFixture(deployFixture);
      const name = "currency";
      const symbol = "";

      const tx = quasar.addCurrency(name, symbol);

      await expect(tx).to.be.revertedWith("Quasar: symbol cannot be blank");
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

      await expect(tx).to.be.revertedWithCustomError(quasar, "OwnableUnauthorizedAccount");
    });

    it("Should not update currency with blank name", async function () {
      const { quasar } = await loadFixture(deployFixture);
      const name = "currency";
      const symbol = "CRN";

      const newName = "";
      const newSymbol = "NCRN";

      await quasar.addCurrency(name, symbol);
      const tx = quasar.updateCurrency(1, newName, newSymbol);

      await expect(tx).to.be.revertedWith("Quasar: name cannot be blank");
    });

    it("Should not update currency with blank symbol", async function () {
      const { quasar } = await loadFixture(deployFixture);
      const name = "currency";
      const symbol = "CRN";

      const newName = "Ncurrency";
      const newSymbol = "";

      await quasar.addCurrency(name, symbol);
      const tx = quasar.updateCurrency(1, newName, newSymbol);

      await expect(tx).to.be.revertedWith("Quasar: symbol cannot be blank");
    });

    it("Should mot update currency if not exist", async function () {
      const { quasar } = await loadFixture(deployFixture);
      const newName = "Ncurrency";
      const newSymbol = "NCRN";

      const tx = quasar.updateCurrency(1, newName, newSymbol);

      await expect(tx).to.be.revertedWith("Quasar: currency should be supported");
    });
  });

  describe("Push price", function () {
    it("Should push price", async function () {
      const { quasar } = await loadFixture(deployFixture);
      const name = "currency";
      const symbol = "CRN";
      const price = ethers.parseEther("0.1");

      await quasar.addCurrency(name, symbol);
      await quasar.pushPrice(1, price);

      expect(await quasar.getPrice(1)).to.equal(price);
    });

    it("Should change price", async function () {
      const { quasar } = await loadFixture(deployFixture);
      const name = "currency";
      const symbol = "CRN";
      const price = ethers.parseEther("0.1");
      const newPrice = ethers.parseEther("0.5");

      await quasar.addCurrency(name, symbol);
      await quasar.pushPrice(1, price);
      await quasar.pushPrice(1, newPrice);

      expect(await quasar.getPrice(1)).to.equal(newPrice);
    });

    it("Should push price for several currencies", async function () {
      const { quasar } = await loadFixture(deployFixture);
      const name1 = "currency1";
      const symbol1 = "CRN1";
      const name2 = "currency2";
      const symbol2 = "CRN2";
      const name3 = "currency3";
      const symbol3 = "CRN3";
      const price1 = ethers.parseEther("0.1");
      const price2 = ethers.parseEther("0.2");
      const price3 = ethers.parseEther("0.3");

      await quasar.addCurrency(name1, symbol1);
      await quasar.addCurrency(name2, symbol2);
      await quasar.addCurrency(name3, symbol3);

      await quasar.pushPrice(1, price1);
      await quasar.pushPrice(2, price2);
      await quasar.pushPrice(3, price3);

      expect(await quasar.getPrice(1)).to.equal(price1);
      expect(await quasar.getPrice(2)).to.equal(price2);
      expect(await quasar.getPrice(3)).to.equal(price3);
    });

    it("Should update price for several currencies", async function () {
      const { quasar } = await loadFixture(deployFixture);
      const name1 = "currency1";
      const symbol1 = "CRN1";
      const name2 = "currency2";
      const symbol2 = "CRN2";
      const name3 = "currency3";
      const symbol3 = "CRN3";
      const price1 = ethers.parseEther("0.1");
      const price2 = ethers.parseEther("0.2");
      const price3 = ethers.parseEther("0.3");

      const newPrice1 = ethers.parseEther("0.11");
      const newPrice2 = ethers.parseEther("0.22");

      await quasar.addCurrency(name1, symbol1);
      await quasar.addCurrency(name2, symbol2);
      await quasar.addCurrency(name3, symbol3);

      await quasar.pushPrice(1, price1);
      await quasar.pushPrice(2, price2);
      await quasar.pushPrice(3, price3);

      await quasar.pushPrice(1, newPrice1);
      await quasar.pushPrice(2, newPrice2);

      expect(await quasar.getPrice(1)).to.equal(newPrice1);
      expect(await quasar.getPrice(2)).to.equal(newPrice2);
      expect(await quasar.getPrice(3)).to.equal(price3);
    });

    it("Should emit event", async function () {
      const { quasar } = await loadFixture(deployFixture);
      const name = "currency";
      const symbol = "CRN";
      const price = ethers.parseEther("0.1");

      await quasar.addCurrency(name, symbol);
      const tx = quasar.pushPrice(1, price);

      await expect(tx).to.emit(quasar, "PriceUpdated").withArgs(1, price);
    });

    it("Should not push price for not owner", async function () {
      const { quasar, address1 } = await loadFixture(deployFixture);
      const name = "currency";
      const symbol = "CRN";
      const price = ethers.parseEther("0.1");

      await quasar.addCurrency(name, symbol);
      const tx = quasar.connect(address1).pushPrice(1, price);

      await expect(tx).to.be.revertedWithCustomError(quasar, "OwnableUnauthorizedAccount");
    });

    it("Should not push price if currency does not exist", async function () {
      const { quasar } = await loadFixture(deployFixture);
      const price = ethers.parseEther("0.1");

      const tx = quasar.pushPrice(1, price);

      await expect(tx).to.be.revertedWith("Quasar: currency should be supported");
    });
  });

  describe("Change state", function () {
    it("Should change currency state", async function () {
      const { quasar } = await loadFixture(deployFixture);
      const name = "currency";
      const symbol = "CRN";

      await quasar.addCurrency(name, symbol);
      await quasar.changeCurrencyState(1, false);

      expect(await quasar.isCurrencySupported(1)).to.equal(false);
    });

    it("Should change currency state several times", async function () {
      const { quasar } = await loadFixture(deployFixture);
      const name = "currency";
      const symbol = "CRN";

      await quasar.addCurrency(name, symbol);
      await quasar.changeCurrencyState(1, false);
      expect(await quasar.isCurrencySupported(1)).to.equal(false);

      await quasar.changeCurrencyState(1, true);
      expect(await quasar.isCurrencySupported(1)).to.equal(true);

      await quasar.changeCurrencyState(1, false);
      expect(await quasar.isCurrencySupported(1)).to.equal(false);
    });

    it("Should change currency state for several currencies", async function () {
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

      await quasar.changeCurrencyState(1, false);
      expect(await quasar.isCurrencySupported(1)).to.equal(false);

      await quasar.changeCurrencyState(2, false);
      expect(await quasar.isCurrencySupported(2)).to.equal(false);

      expect(await quasar.isCurrencySupported(3)).to.equal(true);
    });

    it("Should emit event", async function () {
      const { quasar } = await loadFixture(deployFixture);
      const name = "currency";
      const symbol = "CRN";

      await quasar.addCurrency(name, symbol);
      const tx = quasar.changeCurrencyState(1, false);

      await expect(tx).to.emit(quasar, "CurrencyStateChanged").withArgs(1, false);
    });

    it("Should not change state if caller is not the owner", async function () {
      const { quasar, address1 } = await loadFixture(deployFixture);
      const name = "currency";
      const symbol = "CRN";

      await quasar.addCurrency(name, symbol);
      const tx = quasar.connect(address1).changeCurrencyState(1, false);

      await expect(tx).to.be.revertedWithCustomError(quasar, "OwnableUnauthorizedAccount");
    });

    it("Should not change state if currency does not exist", async function () {
      const { quasar } = await loadFixture(deployFixture);

      const tx = quasar.changeCurrencyState(1, false);

      await expect(tx).to.be.revertedWith("Quasar: currency does not exist");
    });
  });
});
