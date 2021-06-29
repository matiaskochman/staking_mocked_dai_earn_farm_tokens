const { assert } = require('chai');
const { contracts_directory } = require('../truffle-config');

const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('TokenFarm', (accounts) => {
  describe("Mock Dai deployment: ", async () => {
    
    it("has a name", async () => {
      let daiToken = await DaiToken.new();
      let name = await daiToken.name();
      assert.equal(name, 'Mock DAI Token');
    })
  })
});