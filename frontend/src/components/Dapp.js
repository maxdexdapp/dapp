import React from "react";
// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";
import axios from "axios";
// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import TokenArtifact from "../contracts/Token.json";
import contractAddress from "../contracts/Token-address.json";

import TokenArtifactUSDT from "../contracts/USDT.json";
import contractAddressUSDT from "../contracts/USDT-address.json";

import TokenArtifactMXDX from "../contracts/MXDX.json";
import contractAddressMXDX from "../contracts/MXDX-address.json";

import TokenArtifactPresale from "../contracts/Presale.json";
import contractAddressPresale from "../contracts/Presale-address.json";

import TokenArtifactUSDT_Ethereum from "../contracts_ethereum/USDT.json";
import contractAddressUSDT_Ethereum from "../contracts_ethereum/USDT-address.json";

import TokenArtifactMXDX_Ethereum from "../contracts_ethereum/MXDX.json";
import contractAddressMXDX_Ethereum from "../contracts_ethereum/MXDX-address.json";

import TokenArtifactPresale_Ethereum from "../contracts_ethereum/Presale.json";
import contractAddressPresale_Ethereum from "../contracts_ethereum/Presale-address.json";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
/*
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import { Transfer } from "./Transfer";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { NoTokensMessage } from "./NoTokensMessage";
import { BigNumber } from "bignumber.js";
*/

import { Component, Suspense } from "react";
import { useTranslation, withTranslation } from "react-i18next";

import { Main } from "./Main";
import i18n from "../i18n";

const DAPP_VERSION_TYPE = "1";

// This is the Hardhat Network id that we set in our hardhat.config.js.
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const ETHEREUM_NETWORK_ID = "1";
const HARDHAT_NETWORK_ID = "1337";
const POLYGON_TEST_NETWORK_ID = "80001";
// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
// transaction.
class Dappcom extends React.Component {
  constructor(props) {
    super(props);

    // We store multiple things in Dapp's state.
    // You don't need to follow this pattern, but it's an useful example.
    this.initialState = {
      // The info of the token (i.e. It's Name and symbol)
      tokenData: undefined,
      // The user's address and balance
      selectedAddress: undefined,
      balance: undefined,
      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
      siteWait: undefined,
    };

    this.state = this.initialState;
  }

  render() {
    const { t } = this.props;
    //alert(navigator.language);
    /*
    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install MetaMask.
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    // The next thing we need to do, is to ask the user to connect their wallet.
    // When the wallet gets connected, we are going to save the users's address
    // in the component's state. So, if it hasn't been saved yet, we have
    // to show the ConnectWallet component.
    //
    // Note that we pass it a callback that is going to be called when the user
    // clicks a button. This callback just calls the _connectWallet method.
    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet 
          connectWallet={() => this._connectWallet()} 
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }

    // If the token data or the user's balance hasn't loaded yet, we show
    // a loading component.
    if (!this.state.tokenData || !this.state.balance) {
      return <Loading />;
    }
*/

    // If everything is loaded, we render the application.
    return <Main dappjs={this} t={t} />;

    /*
    connectWallet={() => this._connectWallet()} 
    selectedAddress={this.state.selectedAddress}
    scrollToAnchor={(anchorName) => this._scrollToAnchor(anchorName)}
    handlePdfLink={(url, filename) => this._handlePdfLink(url, filename)}
    */
  }

  componentDidMount() {
    this._initLanguage();
    this._startCountdown();
    this._connectWallet();
  }

  componentWillUnmount() {
    // We poll the user's balance, so we have to stop doing that when Dapp
    // gets unmounted
    //this._stopPollingData();
    this._stopCountdown();
  }

  async _connectWallet() {
    const { t } = this.props;
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    if (typeof window.ethereum === "undefined") {
      this._showWalletAlert(true, t("119"));
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length === 0) {
      this._showWalletAlert(true, t("120"));
      return;
    }

    const selectedAddress = accounts[0];
    this._initialize(selectedAddress);

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.

    // Once we have the address, we can initialize the application.

    // First we check the network
    if (!this._checkNetwork()) {
      this._showWalletAlert(true, t("121"));
      return;
    }

    this._showWalletAlert(false);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      //this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (newAddress === undefined) {
        return this._resetState();
      }

      this._initialize(newAddress);
    });

    // We reset the dapp state if the network is changed
    window.ethereum.on("chainChanged", ([networkId]) => {
      //this._stopPollingData();
      this._resetState();
      this._connectWallet();
    });
  }

  _initialize(userAddress) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    this.setState({
      selectedAddress: userAddress,
    });

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    this._initializeEthers();
    //this._getTokenData();
    //this._startPollingData();
    this._getPresaleInfo();
  }

  async _initializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    // Then, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    this._token = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      this._provider.getSigner(0)
    );

    let addrUSDT = "";
    let addrMXDX = "";
    let addrPresale = "";

    let abiUSDT = "";
    let abiMXDX = "";
    let abiPresale = "";

    //Ethereum Mainnet
    if (DAPP_VERSION_TYPE === ETHEREUM_NETWORK_ID) {
      addrUSDT = contractAddressUSDT_Ethereum.Token; //"0xdAC17F958D2ee523a2206206994597C13D831ec7"
      addrMXDX = contractAddressMXDX_Ethereum.Token;
      addrPresale = contractAddressPresale_Ethereum.Token; //"0x4A41bDe3Bc32a0e6207794b2B29855FD0AAAC013"

      abiUSDT = TokenArtifactUSDT_Ethereum.abi;
      abiMXDX = TokenArtifactMXDX_Ethereum.abi;
      abiPresale = TokenArtifactPresale_Ethereum.abi;
    }

    if (DAPP_VERSION_TYPE === POLYGON_TEST_NETWORK_ID) {
      addrUSDT = "0xB8473d9AE9C78b610898B64E5B9a87A6D5d3cE9C";
      addrMXDX = "0x9cabbB81317f98774D162849073d1b53a673878F";
      addrPresale = "0x8D134e8b495a27309Ca23eA468Da54720Ae305C9";

      abiUSDT = TokenArtifactUSDT.abi;
      abiMXDX = TokenArtifactMXDX.abi;
      abiPresale = TokenArtifactPresale.abi;
    }

    if (DAPP_VERSION_TYPE === HARDHAT_NETWORK_ID) {
      addrUSDT = contractAddressUSDT.Token;
      addrMXDX = contractAddressMXDX.Token;
      addrPresale = contractAddressPresale.Token;

      abiUSDT = TokenArtifactUSDT.abi;
      abiMXDX = TokenArtifactMXDX.abi;
      abiPresale = TokenArtifactPresale.abi;
    }

    this._tokenUSDT = new ethers.Contract(
      addrUSDT,
      abiUSDT,
      this._provider.getSigner(0)
    );

    this._tokenMXDX = new ethers.Contract(
      addrMXDX,
      abiMXDX,
      this._provider.getSigner(0)
    );

    this._contPresale = new ethers.Contract(
      addrPresale,
      abiPresale,
      this._provider.getSigner(0)
    );
  }

  // The next two methods are needed to start and stop polling data. While
  // the data being polled here is specific to this example, you can use this
  // pattern to read any data from your contracts.
  //
  // Note that if you don't need it to update in near real time, you probably
  // don't need to poll it. If that's the case, you can just fetch it when you
  // initialize the app, as we do with the token data.
  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._updateBalance(), 1000);

    // We run it once immediately so we don't have to wait for it
    this._updateBalance();
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  // The next two methods just read from the contract and store the results
  // in the component state.
  async _getTokenData() {
    const name = await this._token.name();
    const symbol = await this._token.symbol();

    this.setState({ tokenData: { name, symbol } });
  }

  async _updateBalance() {
    const balance = await this._token.balanceOf(this.state.selectedAddress);
    this.setState({ balance });
  }

  _startCountdown() {
    let endTime = new Date("2023-11-1");
    let startTime = new Date();
    this._countdownSpan = (endTime - startTime) / 1000; // seconds

    this._countdownInterval = setInterval(() => this._showCountdown(), 1000);

    // We run it once immediately so we don't have to wait for it
    this._showCountdown();
  }

  _stopCountdown() {
    clearInterval(this._countdownInterval);
    this._countdownInterval = undefined;
  }

  _showCountdown() {
    const { t } = this.props;
    //alert("ok");
    let days = Math.floor(this._countdownSpan / (60 * 60 * 24));
    let hours = Math.floor(((this._countdownSpan / 60) % (60 * 24)) / 60);
    let minutes = Math.floor((this._countdownSpan / 60) % 60);
    let seconds = Math.floor(this._countdownSpan % 60);
    document.getElementById("time_days").innerHTML = days;
    //this._countdownSpan = this._countdownSpan - 1;
    document.getElementById("time_hours").innerHTML = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("time_minutes").innerHTML = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("time_seconds").innerHTML = seconds
      .toString()
      .padStart(2, "0");
    this._countdownSpan = this._countdownSpan - 1;
  }

  async _getPresaleInfo() {
    try {
      this._dismissTransactionError();
      let amount = document.getElementById("TokenAmt").value;

      let n = await this._contPresale.timeStage();
      let ret = await this._contPresale.token_price(n);
      document.getElementById("current_price").innerHTML = ret / 100 + " USDT";
      ret = await this._contPresale.token_price(n + 1);

      document.getElementById("next_price").innerHTML = ret / 100 + " USDT";

      //ret = await this._contPresale.totalTokensSold();
      //document.getElementById("amount_sold").innerHTML = this._toThousands(ret);

      //document.getElementById("amount_left").innerHTML = this._toThousands(200000000 - ret);
      ret = await this._contPresale.totalFundRaised();
      document.getElementById("fund_raised").innerHTML =
        +this._ETH(ret, 2) + " USDT";
      //ret = await this._contPresale.totalUSDTRaised();
      /*
      document.getElementById("usdt_raised").innerHTML = "$" + this._toThousands(ret / 1000000);
      ret = await this._contPresale.totalETHRaised();
      document.getElementById("eth_raised").innerHTML = ret / 1000000000000000000;
      */
      //ret = await this._contPresale.totalTokenBuyer();
      //document.getElementById("usdt_buyer").innerHTML = this._toThousands(ret);
      //ret = await this._contPresale.userBought(this.state.selectedAddress);
      //document.getElementById("user_amt").innerHTML = this._toThousands(ret);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  // This method sends an ethereum transaction to transfer tokens.
  // While this action is specific to this application, it illustrates how to
  // send a transaction.
  async _transferTokens(to, amount) {
    // Sending a transaction is a complex operation:
    //   - The user can reject it
    //   - It can fail before reaching the ethereum network (i.e. if the user
    //     doesn't have ETH for paying for the tx's gas)
    //   - It has to be mined, so it isn't immediately confirmed.
    //     Note that some testing networks, like Hardhat Network, do mine
    //     transactions immediately, but your dapp should be prepared for
    //     other networks.
    //   - It can fail once mined.
    //
    // This method handles all of those things, so keep reading to learn how to
    // do it.

    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      this._dismissTransactionError();

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await this._token.transfer(to, amount);
      this.setState({ txBeingSent: tx.hash });

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that made the transaction fail when it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }

      // If we got here, the transaction was successful, so you may want to
      // update your state. Here, we update the user's balance.
      await this._updateBalance();
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      this.setState({ txBeingSent: undefined });
    }
  }

  async _approveTokens() {
    try {
      const { t } = this.props;

      this._dismissTransactionError();

      if (this._checkConnectWallet() === false) return;

      let amount = document.getElementById("TokenAmt").value;
      if (amount !== amount || amount < 1000) {
        this._showPopWndMsg(t("122"));

        return;
      }

      document
        .getElementById("BtnApprove")
        .setAttribute("disabled", "disabled");
      document
        .getElementById("btn_pop_close")
        .setAttribute("disabled", "disabled");

      //document.getElementById("pop_btn_approve").style.display=  "block";

      let ret = await this._contPresale.calculatePaymentUSDT(amount);
      let payUSDT = parseInt(ret[0]);

      const tx = await this._tokenUSDT.approve(
        this._contPresale.address,
        payUSDT
      );
      //this.setState({ txBeingSent: tx.hash });
      document.getElementById("pop_msg_cont").innerHTML =
        t("123") + this._USDT(payUSDT, 2) + t("124");
      //this._showPopWndMsg("Your USDT in wallet is less than payment " + payUSDT / 1000000 + "!");

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        //this._showPopWndMsg("Approve successed!");

        document.getElementById("pop_msg_cont").innerHTML = t("125");
        //this._closePopWndMsg();
      } else throw new Error("Transaction failed");
    } catch (error) {
      const { t } = this.props;

      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        //document.getElementById('TokenAmt').removeAttribute('disabled');
        return;
      }

      console.error(error);
      //this._showPopWndMsg(error.message);
      //this._showPopWndMsg("Some error happend,please try again!");
      document.getElementById("pop_msg_cont").innerHTML = t("126");
    } finally {
      //this.setState({ txBeingSent: undefined });

      document.getElementById("BtnApprove").removeAttribute("disabled");
      document.getElementById("btn_pop_close").removeAttribute("disabled");
      // document.getElementById("pop_btn_approve").style.display=  "none";
    }
  }

  async _buyWithUSDT() {
    try {
      const { t } = this.props;
      this._dismissTransactionError();

      if (this._checkConnectWallet() === false) return;

      let amount = parseInt(document.getElementById("TokenAmt").value);
      if (amount !== amount || amount < 1000) {
        this._showPopWndMsg(t("127"));
        return;
      }

      let ret = await this._contPresale.calculatePaymentUSDT(amount);
      let payUSDT = parseInt(ret[0]);

      let bal = await this._tokenUSDT.balanceOf(this.state.selectedAddress);
      if (parseInt(bal) < payUSDT) {
        //this._showPopWndMsg("Your USDT in wallet is less than payment " + payUSDT / 1000000 + "!");
        this._showPopWndMsg(
          t("128") +
            this._USDT(bal, 2) +
            t("129") +
            this._USDT(payUSDT, 2) +
            " USDT!"
        );
        return;
      }

      let allowAmt = await this._tokenUSDT.allowance(
        this.state.selectedAddress,
        this._contPresale.address
      );
      //alert(parseInt(allowAmt)+"\n"+ payUSDT);
      if (parseInt(allowAmt) < payUSDT) {
        this._showApproveWnd();
        return;
      }

      this._setBtnsState(false);

      const tx = await this._contPresale.buyWithUSDT(amount);
      this._showPopWndMsg(t("130") + this._USDT(payUSDT, 2) + t("131"));

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        this._showPopWndMsg(t("132") + amount + t("133"));
        this._getPresaleInfo();
      } else throw new Error("Transaction failed");
    } catch (error) {
      const { t } = this.props;

      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error(error);

      this._showPopWndMsg(t("134"));
    } finally {
      //this.setState({ txBeingSent: undefined });
      this._setBtnsState(true);
    }
  }

  async _buyWithETH() {
    try {
      const { t } = this.props;

      this._dismissTransactionError();

      if (this._checkConnectWallet() === false) return;

      let amount = parseInt(document.getElementById("TokenAmt").value);

      if (amount !== amount || amount < 1000) {
        this._showPopWndMsg(t("135"));
        return;
      }

      let ret = await this._contPresale.calculatePaymentETH(amount);
      var payETH = String(ret[0]);

      let bal = await this._provider.getBalance(this.state.selectedAddress);
      //alert(parseInt(bal) +"\n"+ parseInt(payETH));
      if (parseInt(bal) < parseInt(payETH)) {
        this._showPopWndMsg(
          t("136") +
            this._ETH(bal, 10) +
            t("137") +
            this._ETH(payETH, 10) +
            " ETH!"
        );
        return;
      }

      this._setBtnsState(false);

      const tx = await this._contPresale.buyWithETH(amount, { value: payETH });

      this._showPopWndMsg(t("138") + this._ETH(payETH, 10) + t("139"));

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        this._showPopWndMsg(t("140") + amount + t("141"));
        this._getPresaleInfo();
      } else throw new Error("Transaction failed");
    } catch (error) {
      const { t } = this.props;

      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error(error);

      this._showPopWndMsg(t("142"));
    } finally {
      //this.setState({ txBeingSent: undefined });
      this._setBtnsState(true);
    }
  }

  async _claimMXDXTokens() {
    try {
      const { t } = this.props;
      this._dismissTransactionError();

      if (this._checkConnectWallet() === false) return;

      let stage = await this._contPresale.timeStage();
      if (stage < 1) {
        this._showPopWndMsg(t("143") + "<br/>" + t("144"));
        return;
      }

      document.getElementById("BtnClaim").setAttribute("disabled", "disabled");

      const tx = await this._contPresale.claim();

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        this._showPopWndMsg(t("145"));
        this._getPresaleInfo();
      } else throw new Error("Transaction failed");
    } catch (error) {
      const { t } = this.props;

      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error(error);

      this._showPopWndMsg(t("146"));
    } finally {
      //this.setState({ txBeingSent: undefined });
      document.getElementById("BtnClaim").removeAttribute("disabled");
    }
  }

  _checkConnectWallet() {
    const { t } = this.props;
    if (!this.state.selectedAddress) {
      this._showPopWndMsg(t("147"));
      return false;
    }

    return true;
  }

  // This method just clears part of the state.
  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // This is an utility method that turns an RPC error into a human readable
  // message.
  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }

  // This method checks if Metamask selected network is Localhost:8545
  _checkNetwork() {
    if (window.ethereum.networkVersion === DAPP_VERSION_TYPE) {
      return true;
    }

    /*
        if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID || window.ethereum.networkVersion === POLYGON_TEST_NETWORK_ID) {
          return true;
        }
    */

    this.setState({
      networkError: "Please connect Metamask to Localhost:8545",
    });

    return false;
  }

  //jump to anchor point
  _scrollToAnchor(anchorName) {
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    }
  }

  //download pdf file
  _handlePdfLink() {
    const { t } = this.props;

    let lang = document.getElementById("select_lang_opt").value;
    let url = "Whitepaper_" + lang + ".pdf";
    let filename = "Whitepaper_" + lang + ".pdf";
    let href = window.location.href;

    let pos = href.indexOf("/", 8);
    if (pos !== -1) url = href.substring(0, pos + 1) + url;
    else url = href + "/" + url;

    axios({
      method: "get",
      url: url,
      responseType: "blob",
    })
      .then(function (response) {
        const link = document.createElement("a");
        let blob = new Blob([response.data], {
          type: "application/octet-stream",
          "Content-Disposition": "attachment",
        });
        let url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename;
        link.click();
      })
      .catch((err) => {
        //console.error(err);
        this._showPopWndMsg(t("148"));
      });
  }

  _showWalletAlert(bl, msg) {
    document.getElementById("wallet_alert").innerHTML = msg;
    document.getElementById("wallet_alert").style.display = bl
      ? "block"
      : "none";
  }

  //show "how to buy" window
  _showHowtobuyWnd() {
    document.getElementById("pop_box_buy").style.display = "block";

    //this._approveTokens();
  }

  _closeHowtobuyWnd() {
    document.getElementById("pop_box_buy").style.display = "none";
  }

  _showApproveWnd() {
    const { t } = this.props;

    document.getElementById("pop_btn_approve").style.display = "block";
    this._showPopWndMsg(t("149"));
  }

  _closeApproveWnd() {
    document.getElementById("pop_btn_approve").style.display = "none";
    this._showPopWndMsg("");
  }

  _showPopWndMsg(msg) {
    //document.getElementById("pop_btn_approve").style.display= bl? "block" : "none";
    document.getElementById("pop_msg_cont").innerHTML = msg;
    document.getElementById("pop_box_msg").style.display = "block";
  }

  _closePopWndMsg() {
    //document.getElementById('btn_pop_close').removeAttribute('disabled');

    document.getElementById("pop_btn_approve").style.display = "none";
    document.getElementById("pop_msg_cont").innerHTML = "";
    document.getElementById("pop_box_msg").style.display = "none";
  }

  _setBtnsState(bl) {
    if (bl) {
      document.getElementById("BtnUSDTBuy").removeAttribute("disabled");
      document.getElementById("BtnETHBuy").removeAttribute("disabled");
      document.getElementById("TokenAmt").removeAttribute("disabled");
    } else {
      document
        .getElementById("BtnUSDTBuy")
        .setAttribute("disabled", "disabled");
      document.getElementById("BtnETHBuy").setAttribute("disabled", "disabled");
      document.getElementById("TokenAmt").setAttribute("disabled", "disabled");
    }
  }

  _getWhitepaperName() {
    let lang = document.getElementById("select_lang_opt").value;
    //alert(lang);
    return "Whitepaper_" + lang + ".pdf";
  }

  _changeLanguage() {
    let lang = document.getElementById("select_lang_opt").value;
    //alert(lang);
    //i18n.language = lang;
    i18n.changeLanguage(lang);
  }

  _initLanguage() {
    //alert(navigator.language+"\n"+i18n.language);
    //let lang = navigator.language;
    let lang = i18n.language;
    document.getElementById("select_lang_opt").value = lang;
    // i18n.changeLanguage(lang);
  }

  _ETH(val, n) {
    return (val / 1000000000000000000).toFixed(n);
  }

  _USDT(val, n) {
    return (val / 1000000).toFixed(n);
  }

  // 方法二
  _toThousands(num) {
    var result = "",
      counter = 0;
    num = (num || 0).toString();
    for (var i = num.length - 1; i >= 0; i--) {
      counter++;
      result = num.charAt(i) + result;
      if (!(counter % 3) && i !== 0) {
        result = "," + result;
      }
    }
    return result;
  }
}

const TransComponent = withTranslation()(Dappcom);

// i18n translations might still be loaded by the http backend
// use react's Suspense
export default function Dapp() {
  return (
    <Suspense fallback="loading">
      <TransComponent />
    </Suspense>
  );
}
