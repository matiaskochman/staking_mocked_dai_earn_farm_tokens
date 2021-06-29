pragma solidity ^0.5.0;

import './DappToken.sol';
import './DaiToken.sol';

contract TokenFarm {
  string public name = "Dapp Token Farm";
  DappToken public dappToken;
  DaiToken public daiToken;

  constructor(DaiToken _daiToken, DappToken _dappToken) public {
    dappToken = _dappToken;
    daiToken = _daiToken;
  }
}