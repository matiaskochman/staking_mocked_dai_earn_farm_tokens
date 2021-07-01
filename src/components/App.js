import React, { Component } from 'react'
import Web3 from 'web3';
import Navbar from './Navbar'
import DaiToken from '../abis/DaiToken.json';
import DappToken from '../abis/DappToken.json';
import TokenFarm from '../abis/TokenFarm.json';
import './App.css'
import Main from './Main';
class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: null,
      dappToken: null,
      tokenFarm: null,
      daiTokenBalance: 0,
      dappTokenBalance: 0,
      stakingBalance: 0,
      loading: true
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stake(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.loadBlockchainData();
        // this.setState({ loading: false })
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.loadBlockchainData();
      // this.setState({ loading: false })
    })
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    
    const networkId = await web3.eth.net.getId();

    const daiTokenData = DaiToken.networks[networkId]
    let daiTokenBalance = 0;
    let daiToken = null;
    if(daiTokenData) {
      daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address);
      daiTokenBalance = await daiToken.methods.balanceOf(accounts[0]).call()
    }
    // this.setState({account: accounts[0], daiToken, daiTokenBalance})

    const dappTokenData = DappToken.networks[networkId]
    let dappTokenBalance = 0;
    let dappToken = null;
    if(dappTokenData) {
      dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address);
      dappTokenBalance = await dappToken.methods.balanceOf(accounts[0]).call()
    }

    const TokenFarmData = TokenFarm.networks[networkId]
    let tokenFarm;
    let stakingBalance = 0;
    if(TokenFarmData) {
      tokenFarm = new web3.eth.Contract(TokenFarm.abi, TokenFarmData.address);
      stakingBalance = await tokenFarm.methods.stakingBalance(accounts[0]).call()
    }

    this.setState(
      {
        account: accounts[0], 
        daiToken, 
        dappToken, 
        tokenFarm, 
        daiTokenBalance, 
        dappTokenBalance, 
        stakingBalance,
        loading: false
      })

  }

  async loadWeb3() {
    if(window.ethereum) {
      console.log('window.ethereum')
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      console.log('window.web3')
      window.web3 = new Web3(window.web3.currenProvider)
    } else {
      window.alert("Non-ethereum browser detected.")
    }
  } 
  render() {
    console.log('state: ', this.state)
    let content;
    if(this.state.loading) {
      content = <p>Loading ...</p>
    } else {
      content = <Main
                  daiTokenBalance={this.state.daiTokenBalance}
                  dappTokenBalance={this.state.dappTokenBalance} 
                  stakingBalance={this.state.stakingBalance}
                  stakeTokens={this.stakeTokens}
                  unstakeTokens={this.unstakeTokens}
                />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              {content}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
