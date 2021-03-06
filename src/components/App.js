import React, { Component } from 'react';
import Navbar from './Navbar';
import Main from './Main';
import './App.css';
import Web3 from 'web3';
import DaiToken from '../abis/DaiToken.json';
import DappToken from '../abis/DappToken.json';
import TokenFarm from '../abis/TokenFarm.json';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    };
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();

    // Load DaiToken
    const daiTokenNetwork = DaiToken.networks[networkId];
    if (daiTokenNetwork) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenNetwork.address);
      this.setState({ daiToken });
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call();
      this.setState({ daiTokenBalance: daiTokenBalance.toString() });
      console.log({ daiTokenBalance });
    } else {
      window.alert('DaiToken contract not deployed to detected network.');
    }

    // Load DappToken
    const dappTokenNetwork = DappToken.networks[networkId];
    if(dappTokenNetwork) {
      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenNetwork.address);
      this.setState({ dappToken });
      let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call();
      this.setState({ dappTokenBalance: dappTokenBalance.toString() });
      console.log({ dappTokenBalance });
    } else {
      window.alert('DappToken contract not deployed to detected network.');
    }

    // Load TokenFarm
    const tokenFarmNetwork = TokenFarm.networks[networkId];
    if(tokenFarmNetwork) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmNetwork.address);
      this.setState({ tokenFarm });
      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call();
      this.setState({ stakingBalance: stakingBalance.toString() });
      console.log({ stakingBalance });
    } else {
      window.alert('TokenFarm contract not deployed to detected network.');
    }

    this.setState({ loading: false });
  }

  stakeTokens = async (amount) => {
    this.setState({ loading: true })
    // Had to change this to async/await syntax to avoid getting "MetaMask - RPC Error: Cannot set properties of undefined (setting 'loadingDefaults')"
    // this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
    //   this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
    //     this.setState({ loading: false })
    //   })
    // })
    await this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account });
    await this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account });
    this.updateBalances();
    this.setState({ loading: false });
  }

  unstakeTokens = async (amount) => {
    this.setState({ loading: true })
    // Had to change this to async/await syntax to avoid getting "MetaMask - RPC Error: Cannot set properties of undefined (setting 'loadingDefaults')"
    // this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
    //   this.setState({ loading: false })
    // })
    await this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account });
    this.updateBalances();
    this.setState({ loading: false });
  }

  async updateBalances() {
    const daiTokenBalance = await this.state.daiToken.methods.balanceOf(this.state.account).call();
    this.setState({ daiTokenBalance: daiTokenBalance.toString() });
    const dappTokenBalance = await this.state.dappToken.methods.balanceOf(this.state.account).call();
    this.setState({ dappTokenBalance: dappTokenBalance.toString() });
    const stakingBalance = await this.state.tokenFarm.methods.stakingBalance(this.state.account).call();
    this.setState({ stakingBalance: stakingBalance.toString() });
  }

  render() {
    let content;
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>;
    } else {
      content = <Main
        daiTokenBalance={this.state.daiTokenBalance}
        dappTokenBalance={this.state.dappTokenBalance}
        stakingBalance={this.state.stakingBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
      />;
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                { content }
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
