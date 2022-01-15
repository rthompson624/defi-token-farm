const DappToken = artifacts.require('DappToken');
const DaiToken = artifacts.require('DaiToken');
const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function(deployer, network, accounts) {
  // Deploy DaiToken
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();
  // Deploy DappToken
  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();
  // Deploy TokenFarm
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();
  // Transfer all Dapp tokens to TokenFarm
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000');
  // Transfer 100 Mock DAI tokens to investor
  await daiToken.transfer(accounts[1], '100000000000000000000');
};
