pragma solidity ^0.5.0;

import './DappToken.sol';
import './DaiToken.sol';

contract TokenFarm {
  address owner;
  string public name = "Dapp Token Farm";
  DappToken public dappToken;
  DaiToken public daiToken;
  mapping(address => uint) public stakingBalance;
  mapping(address => bool) public hasStaked;
  mapping(address => bool) public isStaking;
  address[] public stakers;


  constructor(DaiToken _daiToken, DappToken _dappToken) public {
    owner = msg.sender;
    dappToken = _dappToken;
    daiToken = _daiToken;
  }

  // 1 stakes tokens (deposit)

  function stake(uint _amount) public {
    require(_amount > 0, "amount cannot be 0");
    // Transfer mock dai tokens to this contract for staking
    // dai tokens are being transfered from the sender account to the tokenFarm account in the 
    // mockdai contract.
    daiToken.transferFrom(msg.sender, address(this), _amount);

    // Update staking balance
    stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

    // Add user to stakers array only if they haven't staked already.
    if(!hasStaked[msg.sender]){
      stakers.push(msg.sender);
    }

    // Update staking status
    hasStaked[msg.sender] = true;
    isStaking[msg.sender] = true;
  }
  // 2 unstake tokens (withdraw)
  function unstakeTokens() public {
    // Fetch staking balance
    uint balance = stakingBalance[msg.sender];

    // Require amount greater than 0
    require(balance > 0, "staking balance cannot be 0");

    // 
    daiToken.transfer(msg.sender, balance);

    // Reset staking balance
    stakingBalance[msg.sender] = 0;

    // Update staking status
    isStaking[msg.sender] = false;
  }
  // 3 issue tokens
  function issueTokens() public {
    require(msg.sender == owner, "caller must be the owner");
    for(uint i=0; i<stakers.length; i++) {
      address recipient = stakers[i];
      uint balance = stakingBalance[recipient];
      if(balance > 0) {
        dappToken.transfer(recipient, balance);
      }
    }
  }
}