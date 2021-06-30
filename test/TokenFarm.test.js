const { assert } = require('chai');
const { contracts_directory } = require('../truffle-config');

const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n,'ether');
}
contract('TokenFarm', ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm;

  before(async () => {
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(daiToken.address, dappToken.address);

    // tansfer all tokens to TokenFarm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens('1000000'));
    
    // tansfer all tokens to investor (100 )
    await daiToken.transfer(investor, tokens('100'), {from: owner});

  });
  describe("Mock Dai deployment: ", async () => {  
    it("has a name", async () => {
      let daiToken = await DaiToken.new();
      let name = await daiToken.name();
      assert.equal(name, 'Mock DAI Token');
    })
  })

  describe("Dapp token deployment: ", async () => {
    it("has a name", async () => {
      
      let name = await dappToken.name();
      assert.equal(name, "DApp Token");
      
    })
    it("TokenFarm has the right balance", async () => {
      
      let balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens('1000000'));      
    })

  })

  describe('Farming tokens', async () => {
    it('rewards investors for staking mDai tokens', async () =>{
      let result

      // Check investor balance before staking
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), "investor mDai balance correct before staking");
    })
  })
});