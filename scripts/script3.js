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
  balanceOfUser = await hako.methods.balanceOf(userAccount).call();
  memberOrNot = await hako.methods.memberCheckOf(userAccount).call();
  creditToHakoOfUser = await hako.methods.creditToHakoOf(userAccount).call();
  debtToHakoOfUser = await hako.methods.debtToHakoOf(userAccount).call();
  creditToMemberOfUser = await hako.methods.creditToMemberOf(userAccount).call();
  debtToMemberOfUser = await hako.methods.debtToMemberOf(userAccount).call();
  netAssetsOfUser = Number(balanceOfUser) + Number(creditToHakoOfUser)
    - Number(debtToHakoOfUser) + Number(creditToMemberOfUser) - Number(debtToMemberOfUser);
  borrowValueDurationOfUser = await hako.methods.getBorrowValueDurationOf(userAccount).call();
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
    }
  },
  methods: {
    activate: function(index) {
      this.active = index;
    },
    displayHakoInfo: function() {
      this.hakoData.hakoAddress = hakoAddress;
      this.hakoData.totalSupply = totalSupply;
      this.hakoData.balanceOfHako = balanceOfHako;
      if (this.isMember) {
        this.hakoData.creditOfHako = creditOfHako;
        this.hakoData.debtOfHako = debtOfHako;
        this.hakoData.memberCount = memberCount;
        this.hakoData.upperLimit = upperLimit;
      } else {
        this.hakoData.creditOfHako = "Member Only";
        this.hakoData.debtOfHako = "Member Only";
        this.hakoData.memberCount = "Member Only";
        this.hakoData.upperLimit = "Member Only";
      }
    },
    displayUserInfo: function() {
      this.userData.userAccount = userAccount;
      this.userData.balanceOfUser = balanceOfUser;
      if (this.isMember) {
        this.userData.creditToHakoOfUser = creditToHakoOfUser;
        this.userData.debtToHakoOfUser = debtToHakoOfUser;
        this.userData.creditToMemberOfUser = creditToMemberOfUser;
        this.userData.debtToMemberOfUser = debtToMemberOfUser;
        this.userData.netAssetsOfUser = netAssetsOfUser;
        this.userData.valueDuration.value = borrowValueDurationOfUser['0'];
        this.userData.valueDuration.duration = borrowValueDurationOfUser['1'];
        this.arrangeDuration(Number(this.userData.valueDuration.duration));
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
      this.userData.valueDuration.durationData.days = quotientA / 86400;
      let remainderB = remainderA % 3600;
      let quotientB = remainderA - remainderB;
      this.userData.valueDuration.durationData.hours = quotientB / 3600;
      let remainderC = remainderB % 60;
      let quotientC = remainderB - remainderC;
      this.userData.valueDuration.durationData.minutes = quotientC / 60;
      this.userData.valueDuration.durationData.seconds = remainderC;
    }
  },
  computed: {
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
      return this.userData.netAssetsOfUser > 0;
    }
  }
});