# Quasar-Contract

Quasar-Contract is an on-chain part of the Quasar project (see
[Quasar-EVM repository](https://github.com/gateway-fm/quasar-evm)). Quasar-Contract contract is used to write and read
currency prices and used as an price oracle for the rollups.

## Table of content

- [Deploy and verify](#deploy-and-verify)
- [Usage](#usage)
- [Structs](#structs)
- [Events](#events)
- [Methods](#methods)

## Deploy and verify

The deployment scripts are configured to interact with rollup chains. Before deploy you need to start new rollup,
install all dependencies and set the env variables.

### Env variables

Env variable names can be found in the [.env.example](./.env.example) file. You can copy this file and set needed
variables to run the deployment scripts.

| Name               | Example                                                  | Description                                                       |
|--------------------|----------------------------------------------------------|-------------------------------------------------------------------|
| RPC                | https://jesterfair-rpc.eu-north-2.gateway.fm             | Rollup RPC-provider URL                                           |
| PK                 |                                                          | Deployed oracle owner wallet private key                          |
| CHAIN_NAME         | jesterfair                                               | Rollup chain name                                                 |
| CHAIN_ID           | 1413045109                                               | Rollup chain ID                                                   |
| BLOCKSCOUT_URL_API | https://jesterfair-blockscout.eu-north-2.gateway.fm/api/ | Normally - the same as the Blockscout URL with `/api/` at the end |
| BLOCKSCOUT_URL     | https://jesterfair-blockscout.eu-north-2.gateway.fm      | Blockcsout web app URL                                            |

### Install dependencies

To install dependencies run:

```shell
yarn install
```

### Deploy

To deploy smart-contract use this command:

```shell
yarn hardhat deploy
```

It will run the deployment and verification scripts. Script will log each step and log the new smart-contract address.
Be aware, if you use the Blockscout API, verification may return error, but the verification may be done. It should be
checked manually.

## Usage

After contract deployment it is assumed that you need to deploy and run the
[Quasar-EVM](https://github.com/uddugteam/quasar-evm) oracle. It will listen to the needed currencies and push them to
the smart-contract.

Before the quasar-evm is started you need to add all needed currencies to the smart contract using the
[AddCurrency](#addcurrency) method.

To get needed currency price onchain use the [GetPrice](#getprice) method. Prices are sotred with 5 decimals.

**!!! Attention !!!**

At the time of writing the Quasar-EVM do not support listening to this smart-contract events. If you add or change
existing currencies while the Quasar-EVM is online you will need to restart EVM service manually after all changes are
made on-chain.

## Structs

### Currency

```solidity
struct Currency {
  string name;
  string symbol;
}
```

Fields:

- `name`: ERC-20 token name
- `symbol`: ERC-20 token Symbol

## Events

### CurrencyAdded

```solidity
event CurrencyAdded(uint64 indexed id, string name, string symbol);
```

- **Description**: Triggered whenever new currency is updated
- **Parameters**:
  - `id` - new currency ID
  - `name`: ERC-20 token name
  - `symbol`: ERC-20 token Symbol

### CurrencyUpdated

```solidity
event CurrencyUpdated(uint64 indexed id, string name, string symbol);
```

- **Description**: Triggered whenever an existing currency is updated
- **Parameters**:
  - `id` - existing currency ID
  - `name`: ERC-20 token name
  - `symbol`: ERC-20 token Symbol

### PriceUpdated

```solidity
event PriceUpdated(uint64 indexed id, uint256 price);
```

- **Description**: Triggered whenever an existing currency price is updated
- **Parameters**:
  - `id` - updated currency ID
  - `price`: currency price

### CurrencyStateChanged

```solidity
event CurrencyStateChanged(uint64 indexed id, bool state);
```

- **Description**: Triggered whenever an existing currency state is changed
- **Parameters**:
  - `id` - updated currency ID
  - `state`: new currency state. True if currency is active and false if not

## Methods

### GetCurrencyID

```solidity
function getCurrencyID(string memory symbol) external view returns(uint64, bool);
```

- **Description**: Return currency ID and currency state by given symbol. Will return 0 and false if symbol do not exist.
- **Parameters**:
  - `symbol` - currency symbol.
- **Returns**:
  - `uint64` - currency ID
  - `bool` - currency state. True if currency is active and false if not

### GetSupportedCurrencies

```solidity
function getSupportedCurrencies() external view returns(Currency[] memory, bool[] memory);
```

- **Description**: Return all existing currencies and states. Will return zero length arrays is no currencies
registered in the smart-contract
- **Returns**:
  - `Currency[]` - currency struct array
  - `bool[]` - currency states

### GetNextID

```solidity
function getNextID() external view returns (uint64);
```

- **Description**: Return next currency ID. First currency ID is 1. To calculate total currencies in the smart-contract
user next currency ID - 1.
- **Returns**:
  - `uint64` - next currency ID

### GetPrice

```solidity
function getPrice(uint64 id) external view returns (uint256);
```

- **Description**: Price for given currency ID
- **Parameters**:
  - `id` - currency ID
- **Returns**:
  - `uint256` - currency price with 5 decimals

### GetCurrencyMetadata

```solidity
function getCurrencyMetadata(uint64 id) external view returns (Currency memory);
```

- **Description**: Get currency metadata
- **Parameters**:
  - `id` - currency ID
- **Returns**:
  - `Currency` - currency metadata struct

### IsCurrencySupported

```solidity
function isCurrencySupported(uint64 id) external view returns (bool);
```

- **Description**: Get currency state. True if supported false if not. If currency do not exist will also return false.
- **Parameters**:
  - `id` - currency ID
- **Returns**:
  - `bool` - currency state

### AddCurrency

```solidity
function addCurrency(string memory name, string memory symbol) external onlyOwner;
```

- **Description**: Add new currency to the smart-contract. Also set the currency state to true.
- **Parameters**:
  - `name` - currency name
  - `symbol` - currency symbol
- **Requirements**:
  - Caller should be a contract owner
  - Name cannot be blank
  - Symbol cannot be blank
- **Emits**:
  - `CurrencyAdded` event.

### UpdateCurrency

```solidity
function updateCurrency(uint64 id, string memory name, string memory symbol) external onlyOwner;
```

- **Description**: Updates name and symbol of existing currency.
- **Parameters**:
  - `id` - existing currency ID
  - `name` - new currency name
  - `symbol` - new currency symbol
- **Requirements**:
  - Caller should be a contract owner
  - Name cannot be blank
  - Symbol cannot be blank
  - Currency ID should exist
- **Emits**:
  - `CurrencyUpdated` event.

### PushPrice

```solidity
function pushPrice(uint64 id, uint256 price) external onlyOwner;
```

- **Description**: Updates name and symbol of existing currency.
- **Parameters**:
  - `id` - existing currency ID
  - `price` - new currency price with 5 decimals
- **Requirements**:
  - Caller should be a contract owner
  - Currency ID should exist
- **Emits**:
  - `PriceUpdated` event.

### ChangeCurrencyState

```solidity
function changeCurrencyState(uint64 id, bool state) external onlyOwner;
```

- **Description**: Updates name and symbol of existing currency.
- **Parameters**:
  - `id` - existing currency ID
  - `state` - new currency price state
- **Requirements**:
  - Caller should be a contract owner
  - Currency ID should exist
- **Emits**:
  - `CurrencyStateChanged` event.
