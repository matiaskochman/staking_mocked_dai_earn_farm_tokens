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

      // Stake mockDai tokens

      await daiToken.approve(tokenFarm.address, tokens('100'), {from: investor})
      await tokenFarm.stake(tokens('100'), {from: investor})

      let investorBalance = await daiToken.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens('0'), "investor dai token balance correct after staking");      

      let contractBalance = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(contractBalance.toString(), tokens('100'), "tokenFarm dai token balance correct after staking");      

      let stakingBalance = await tokenFarm.stakingBalance(investor)
      assert.equal(stakingBalance.toString(), tokens('100'), "tokenFarm staking balance correct after staking")

      result = await tokenFarm.isStaking(investor)
      assert.equal(result.toString(), 'true', "investor staking status correct after staking")

      // Issue token from owner

      await tokenFarm.issueTokens({from:owner})
      // Check balance after issuance
      result = await dappToken.balanceOf(investor);
      assert.equal(result.toString(), tokens('100'), "Investor Dapp Token wallet balance correct after issuance")

      await tokenFarm.issueTokens({from:investor}).should.be.rejected

      // Unstake tokens
      await tokenFarm.unstakeTokens({from:investor})

      //Check results after unstaking
      investorBalance = await daiToken.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens('100'), "investor dai token balance correct after unstaking");      

      contractBalance = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(contractBalance.toString(), tokens('0'), "tokenFarm dai token balance correct after unstaking");      


      stakingBalance = await tokenFarm.stakingBalance(investor)
      assert.equal(stakingBalance.toString(), tokens('0'), "tokenFarm staking balance correct after unstaking")

      result = await tokenFarm.isStaking(investor)
      assert.equal(result.toString(), 'false', "investor staking status correct after unstaking")
      
    })
  })
});