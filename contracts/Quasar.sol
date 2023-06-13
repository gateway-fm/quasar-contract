// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Quasar is Ownable {
    // Next currency ID
    uint64 private _nextID;

    // Currency metadata struct
    struct Currency {
        string symbol;
        string name;
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
}
