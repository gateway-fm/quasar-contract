// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Quasar is Ownable {
    // Next currency ID
    uint64 private _nextID;

    // Currency metadata struct
    struct Currency {
        string name;
        string symbol;
    }

    // Mapping currency ID to currency metadata
    mapping(uint64 => Currency) private _currencies;

    // Mapping currency ID to currency price
    mapping(uint64 => uint256) private _currencyPrices;

    // Triggered whenever new currency is added
    event CurrencyAdded(uint64 indexed id, string name, string symbol);

    // Triggered whenever currency metadata is updated
    event CurrencyUpdated(uint64 indexed id, string name, string symbol);

    // Triggered whenever currency price is updated
    event PriceUpdated(uint64 indexed id, uint256 price);

    constructor(){
        _nextID = 1;
    }

    /*
     * Allows to get current next ID
     *
     * @return next currency ID as uint64
     */
    function getNextID() external view returns(uint64) {
        return _nextID;
    }

    /*
     * Allows to add new currency
     *
     * Requirements:
     * - caller should be a contract owner
     * - name cannot be blank
     * - symbol cannot be blank
     *
     * @param name - currency name
     * @param symbol - currency symbol
     *
     * @emits `CurrencyAdded` event with ID, name and symbol as arguments
     */
    function addCurrency(string memory name, string memory symbol) external onlyOwner {
        require(bytes(name).length >0, "Quasar: name cannot be blank");
        require(bytes(symbol).length >0, "Quasar: symbol cannot be blank");

        uint64 id = _nextID;

        _currencies[id] = Currency(name, symbol);
        _nextID++;

        emit CurrencyAdded(id, name, symbol);
    }

    /*
     * Allows to update existing currency
     *
     * Requirements:
     * - caller should be a contract owner
     * - currency should exist
     * - name cannot be blank
     * - symbol cannot be blank
     *
     * @param id - currency ID
     * @param name - currency name
     * @param symbol - currency symbol
     *
     * @emits `CurrencyUpdated` event with ID, name and symbol as arguments
     */
    function updateCurrency(uint64 id, string memory name, string memory symbol) external onlyOwner {
        require(_isCurrencyExists(id), "Quasar: currency should exist");
        require(bytes(name).length >0, "Quasar: name cannot be blank");
        require(bytes(symbol).length >0, "Quasar: symbol cannot be blank");

        _currencies[id].name = name;
        _currencies[id].symbol = symbol;

        emit CurrencyUpdated(id, name, symbol);
    }

    /*
     * Allows to get currency metadata by given ID
     *
     * @param id - currency ID
     *
     * @return currency metadata as Currency struct type
     */
    function getCurrencyMetadata(uint64 id) external view returns(Currency memory) {
        return _currencies[id];
    }

    /*
     * Allows to push price for given currency ID
     *
     * Requirements:
     * - caller should be a contract owner
     * - currency should exist
     *
     * @param id - currency ID
     * @param price - currency price
     *
     * @emit PriceUpdated event with id and price as arguments
     */
    function pushPrice(uint64 id, uint256 price) external onlyOwner {
        require(_isCurrencyExists(id), "Quasar: currency should exist");

        _currencyPrices[id] = price;

        emit PriceUpdated(id, price);
    }

    /*
     * Allows to get currency price
     *
     * @param id - currency ID
     *
     * @return currency price as uint256
     */
    function getPrice(uint64 id) external view returns(uint256) {
        return _currencyPrices[id];
    }

    // Allows to check if currency exist by given currency ID
    function _isCurrencyExists(uint64 id) internal view returns(bool) {
        return bytes(_currencies[id].name).length > 0;
    }

}
