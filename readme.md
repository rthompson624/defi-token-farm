# DeFi Token Staking App

## Description
This application allows users to stake DAI tokens in order to earn interest in the form of dAPP tokens. After a period of staking, users can then unstake their DAI tokens while retaining any dAPP tokens that have been distributed.

## Setup
### Dependencies
- Node.js
- Ganache
- Metamask (user)

### Steps
1. Install npm libraries.

    ```npm install```
2. Start Ganache.
3. Connect Metamask to wallet using the secret mnemonic phrase from Ganache. Set Account 2 as the active account.
4. Compile smart contracts.

    ```truffle compile```
5. Run smart contract unit tests.

    ```truffle test```
6. Deploy smart contracts to Ganache network.

    ```truffle deploy```
7. Start ui web server. Chrome should open automatically. Accept approval prompts from Metamask.

    ```npm run start```
8. Stake DAI tokens via the ui.
9.  Issue dAPP tokens for staked DAI tokens.

    ```truffle exec scripts/issue-token.js```
10.  Refresh browser to see update to dAPP token balance.
