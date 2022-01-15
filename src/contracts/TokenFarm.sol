pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
  string public name = "Dapp Token Farm";
  address public owner;
  DappToken public dappToken;
  DaiToken public daiToken;
  mapping(address => uint) public stakingBalance;
  mapping(address => bool) public hasStaked;
  mapping(address => bool) public isStaking;
  address[] public stakers;

  constructor(DappToken _dappToken, DaiToken _daiToken) public {
    dappToken = _dappToken;
    daiToken = _daiToken;
    owner = msg.sender;
  }

  function stakeTokens(uint _amount) public {
    require(_amount > 0, "amount must be greater than 0");
    daiToken.transferFrom(msg.sender, address(this), _amount);
    stakingBalance[msg.sender] += _amount;
    if (!hasStaked[msg.sender]) {
      stakers.push(msg.sender);
    }
    isStaking[msg.sender] = true;
    hasStaked[msg.sender] = true;
  }

  function unstakeTokens() public {
    // Fetch staking balance
    uint balance = stakingBalance[msg.sender];

    // Require amount greater than 0
    require(balance > 0, "staking balance cannot be 0");

    // Transfer Mock Dai tokens to this contract for staking
    daiToken.transfer(msg.sender, balance);

    // Reset staking balance
    stakingBalance[msg.sender] = 0;

    // Update staking status
    isStaking[msg.sender] = false;
  }

  function issueTokens() public {
    require(msg.sender == owner, "Only owner can call this function");
    for (uint i = 0; i < stakers.length; i++) {
      address recipient = stakers[i];
      uint balance = stakingBalance[recipient];
      if (balance > 0) {
        dappToken.transfer(recipient, balance);
      }
    }
  }

}
