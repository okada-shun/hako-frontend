var hako;
var balanceOfHako;
var totalSupply;
var creditOfHako;
var debtOfHako;
var memberCount;
var upperLimit;
var userAccount;
var balanceOfUser;
var memberOrNot;
var creditToHakoOfUser;
var debtToHakoOfUser;
var creditToMemberOfUser;
var debtToMemberOfUser;
var netAssetsOfUser;
var borrowValueDurationOfUser;
async function startApp() {
  hako = new web3.eth.Contract(hakoABI, hakoAddress);
  balanceOfHako = await hako.methods.balanceOfHako().call();
  totalSupply = await hako.methods.totalSupply().call();
  creditOfHako = await hako.methods.creditOfHako().call();
  debtOfHako = await hako.methods.debtOfHako().call();
  memberCount = await hako.methods.memberCount().call();
  upperLimit = await hako.methods.upperLimit().call();
  userAccount = await web3.eth.getCoinbase();
  if (!userAccount) {
    alert("connect MetaMask!");
    return;
  } else {
    appVM.connected = true;
  }
  balanceOfUser = await hako.methods.balanceOf(userAccount).call();
  memberOrNot = await hako.methods.memberCheckOf(userAccount).call();
  creditToHakoOfUser = await hako.methods.creditToHakoOf(userAccount).call();
  debtToHakoOfUser = await hako.methods.debtToHakoOf(userAccount).call();
  creditToMemberOfUser = await hako.methods.creditToMemberOf(userAccount).call();
  debtToMemberOfUser = await hako.methods.debtToMemberOf(userAccount).call();
  netAssetsOfUser = Number(balanceOfUser) + Number(creditToHakoOfUser)
    - Number(debtToHakoOfUser) + Number(creditToMemberOfUser) - Number(debtToMemberOfUser);
  borrowValueDurationOfUser = await hako.methods.borrowValueDurationOf(userAccount).call();
  appVM.userData.memberOrNot = memberOrNot;
  appVM.memberCheck();
  appVM.displayHakoInfo();
  appVM.displayUserInfo();
}

window.addEventListener('load', function () {
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(window.ethereum);
    console.log('web3 created!');
  } else {
    alert('install wallet!');
    console.log('install wallet!');
  }
  startApp();
});

var appVM = new Vue({
  el: '#app',
  data: {
    active: 0,
    items: [
      'Hako Information',
      'User Information',
      'Transactions',
      'History'
    ],
    connected: false,
    hakoData: {
      hakoAddress: '-',
      totalSupply: '-',
      balanceOfHako: '-',
      creditOfHako: '-',
      debtOfHako: '-',
      memberCount: '-',
      upperLimit: '-'
    },
    userData: {
      userAccount: '-',
      balanceOfUser: '-',
      memberOrNot: '-',
      memberCheckOfUser: '-',
      creditToHakoOfUser: '-',
      debtToHakoOfUser: '-',
      creditToMemberOfUser: '-',
      debtToMemberOfUser: '-',
      netAssetsOfUser: '-',
      borrowValueDurationOfUser: '-',
      valueDuration: {
        value: '-',
        duration: '-',
        durationData: {
          days: '-',
          hours: '-',
          minutes: '-',
          seconds: '-'
        }
      }
    },
    transactionUrl: {
      transferTokenUrl: "transactions/transfer_token.html",
      transferCreditUrl: "transactions/transfer_credit.html",
      joinHakoUrl: "transactions/join_hako.html",
      leaveHakoUrl: "transactions/leave_hako.html",
      depositTokenUrl: "transactions/deposit_token.html",
      withdrawTokenUrl: "transactions/withdraw_token.html",
      registerBorrowingUrl: "transactions/register_borrowing.html",
      lendCreditUrl: "transactions/lend_credit.html",
      collectDebtUrl: "transactions/collect_debt.html",
      returnDebtUrl: "transactions/return_debt.html",
      createCreditUrl: "transactions/create_credit.html",
      reduceDebtUrl: "transactions/reduce_debt.html"
    },
    historyUrl: {
      transferTokenUrl: "history/transfer_token_history.html",
      transferCreditUrl: "history/transfer_credit_history.html",
      joinHakoUrl: "history/join_hako_history.html",
      leaveHakoUrl: "history/leave_hako_history.html",
      depositTokenUrl: "history/deposit_token_history.html",
      withdrawTokenUrl: "history/withdraw_token_history.html",
      registerBorrowingUrl: "history/register_borrowing_history.html",
      lendCreditUrl: "history/lend_credit_history.html",
      collectDebtUrl: "history/collect_debt_history.html",
      returnDebtUrl: "history/return_debt_history.html",
      createCreditUrl: "history/create_credit_history.html",
      reduceDebtUrl: "history/reduce_debt_history.html"
    }
  },
  methods: {
    activate: function(index) {
      this.active = index;
    },
    displayHakoInfo: function() {
      this.hakoData.hakoAddress = hakoAddress;
      this.hakoData.totalSupply = Number(totalSupply).toLocaleString();
      this.hakoData.balanceOfHako = Number(balanceOfHako).toLocaleString();
      if (this.isMember) {
        this.hakoData.creditOfHako = Number(creditOfHako).toLocaleString();
        this.hakoData.debtOfHako = Number(debtOfHako).toLocaleString();
        this.hakoData.memberCount = Number(memberCount).toLocaleString();
        this.hakoData.upperLimit = Number(upperLimit).toLocaleString();
      } else {
        this.hakoData.creditOfHako = "Member Only";
        this.hakoData.debtOfHako = "Member Only";
        this.hakoData.memberCount = "Member Only";
        this.hakoData.upperLimit = "Member Only";
      }
    },
    displayUserInfo: function() {
      this.userData.userAccount = userAccount;
      this.userData.balanceOfUser = Number(balanceOfUser).toLocaleString();
      if (this.isMember) {
        this.userData.creditToHakoOfUser = Number(creditToHakoOfUser).toLocaleString();
        this.userData.debtToHakoOfUser = Number(debtToHakoOfUser).toLocaleString();
        this.userData.creditToMemberOfUser = Number(creditToMemberOfUser).toLocaleString();
        this.userData.debtToMemberOfUser = Number(debtToMemberOfUser).toLocaleString();
        this.userData.netAssetsOfUser = netAssetsOfUser.toLocaleString();
        this.userData.valueDuration.value = Number(borrowValueDurationOfUser['0']).toLocaleString();
        this.userData.valueDuration.duration = Number(borrowValueDurationOfUser['1']).toLocaleString();
        this.arrangeDuration(Number(borrowValueDurationOfUser['1']));
      } else {
        this.userData.creditToHakoOfUser = "Member Only";
        this.userData.debtToHakoOfUser = "Member Only";
        this.userData.creditToMemberOfUser = "Member Only";
        this.userData.debtToMemberOfUser = "Member Only";
        this.userData.netAssetsOfUser = "Member Only";
        this.userData.valueDuration.value = "Member Only";
        this.userData.valueDuration.duration = "Member Only";
      }
    },
    memberCheck: async function() {
      if (this.userData.memberOrNot === '1') {
        this.userData.memberCheckOfUser = 'You are a Hako Member!';
      } else {
        this.userData.memberCheckOfUser = 'You are NOT a Hako Member!';
      }
    },
    arrangeDuration: function(duration) {
      let remainderA = duration % 86400;
      let quotientA = duration - remainderA;
      this.userData.valueDuration.durationData.days = (quotientA / 86400).toLocaleString();
      let remainderB = remainderA % 3600;
      let quotientB = remainderA - remainderB;
      this.userData.valueDuration.durationData.hours = (quotientB / 3600).toString();
      let remainderC = remainderB % 60;
      let quotientC = remainderB - remainderC;
      this.userData.valueDuration.durationData.minutes = (quotientC / 60).toString();
      this.userData.valueDuration.durationData.seconds = remainderC.toString();
    },
    onClickConnect: async function() {
      try {
        // Will open the MetaMask UI
        // You should disable this button while the request is pending!
        await ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error(error);
      }
    }
  },
  computed: {
    isConnected() {
      return this.connected;
    },
    isMember() {
      return this.userData.memberOrNot === '1';
    },
    isNotMember() {
      return this.userData.memberOrNot === '0';
    },
    haveNotDebtToHako() {
      return this.userData.debtToHakoOfUser === '0';
    },
    haveNotDebtToMember() {
      return this.userData.debtToMemberOfUser === '0';
    },
    haveNotCreditToMember() {
      return this.userData.creditToMemberOfUser === '0';
    },
    haveToken() {
      return this.userData.balanceOfUser !== '0';
    },
    haveCredit() {
      return this.userData.creditToHakoOfUser !== '0';
    },
    havePlusNetAssets() {
      return Number(this.userData.netAssetsOfUser.replace(/,/g, '')) > 0;
    }
  }
});