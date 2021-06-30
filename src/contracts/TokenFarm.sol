pragma solidity ^0.5.0;

import './DappToken.sol';
import './DaiToken.sol';

contract TokenFarm {
  string public name = "Dapp Token Farm";
  DappToken public dappToken;
  DaiToken public daiToken;
  mapping(address => uint) public stakingBalance;
  mapping(address => bool) public hasStaked;
  mapping(address => bool) public isStaking;
  address[] public stakers;


  constructor(DaiToken _daiToken, DappToken _dappToken) public {
    dappToken = _dappToken;
    daiToken = _daiToken;
  }

  // 1 stakes tokens (deposit)

  function stake(uint _amount) public {
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

  // 3 issue tokens
}