var hakoAddress;
var hako;
var userAccount;
async function startApp() {
  hakoAddress = "0xc00523a058de5fdebf17ff735d29368e7c9ae114";
  hako = new web3.eth.Contract(hakoABI, hakoAddress);
  userAccount = await web3.eth.getCoinbase();
  hakoInfoVM.hakoAddress = hakoAddress;
  hakoInfoVM.displayHakoInfo();
  userInfoVM.userAccount = userAccount;
  userInfoVM.displayUserInfo();
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

var hakoInfoVM = new Vue({
  el: '#hakoInfo',
  data: {
    hakoAddress: '',
    totalSupply: '',
    balanceOfHako: '',
    creditOfHako: '',
    debtOfHako: '',
    memberCount: '',
    memberOrNot: ''
  },
  methods: {
    async displayHakoInfo() {
      this.totalSupply = await hako.methods.totalSupply().call();
      this.balanceOfHako = await hako.methods.balanceOfHako().call();
      this.creditOfHako = await hako.methods.creditOfHako().call();
      this.debtOfHako = await hako.methods.debtOfHako().call();
      this.memberCount = await hako.methods.memberCount().call();
      this.memberOrNot = await hako.methods.memberCheckOf(userAccount).call();
    }
  },
  computed: {
    isMember() {
      return this.memberOrNot === '1';
    }
  }
});

var userInfoVM = new Vue({
  el: '#userInfo',
  data: {
    userAccount: '',
    userBalance: '',
    memberOrNot: '',
    memberCheckOfUser: '',
    creditToHakoOfUser: '',
    debtToHakoOfUser: '',
    creditToMemberOfUser: '',
    debtToMemberOfUser: '',
    netAssetsOfUser: '',
    borrowValueDurationOfUser: '',
    valueDuration: {
      value: '',
      duration: ''
    }
  },
  methods: {
    async displayUserInfo() {
      this.userBalance = await hako.methods.balanceOf(userAccount).call();
      this.memberOrNot = await hako.methods.memberCheckOf(userAccount).call();
      await this.memberCheck();
      this.creditToHakoOfUser = await hako.methods.creditToHakoOf(userAccount).call();
      this.debtToHakoOfUser = await hako.methods.debtToHakoOf(userAccount).call();
      this.creditToMemberOfUser = await hako.methods.creditToMemberOf(userAccount).call();
      this.debtToMemberOfUser = await hako.methods.debtToMemberOf(userAccount).call();
      this.netAssetsOfUser = Number(this.userBalance) + Number(this.creditToHakoOfUser)
       - Number(this.debtToHakoOfUser) + Number(this.creditToMemberOfUser) - Number(this.debtToMemberOfUser);
      this.borrowValueDurationOfUser = await hako.methods.getBorrowValueDurationOf(userAccount).call();
      this.valueDuration.value = this.borrowValueDurationOfUser['0'];
      this.valueDuration.duration = this.borrowValueDurationOfUser['1'];
    },
    async memberCheck() {
      if (this.memberOrNot === '1') {
        this.memberCheckOfUser = 'You are a Hako Member!';
      } else {
        this.memberCheckOfUser = 'You are NOT a Hako Member!';
      }
    }
  },
  computed: {
    isMember() {
      return this.memberOrNot === '1';
    }
  }
});

var transferVM = new Vue({
  el: '#transfer',
  data: {
    value: '',
    to: '',
    balanceOfUser: '',
    noCheckSentence: '',
    okCheckSentence: '',
    ok: '',
    active: false
  },
  methods: {
    async check() {
      this.ok = false;
      if (!this.value || !this.to) {
        this.noCheckSentence = "Please input a value!";
        this.active = !this.active;
        return;
      }
      try {
        await hako.methods.balanceOf(this.to).call();
      } catch (error) {
        this.noCheckSentence = "Please input an address exactly!";
        this.active = !this.active;
        return;
      }
      this.balanceOfUser = userInfoVM.userBalance;
      if (Number(this.value) > Number(this.balanceOfUser)) {
        this.noCheckSentence = "NO! You have only " + this.balanceOfUser + " token! " + this.value + " is over!";
      } else {
        this.okCheckSentence = 'OK! You transfer ' + this.value + ' token to <' + this.to + '>!';
        this.ok = true;
      }
      this.active = !this.active;
    },
    transfer() {
      return hako.methods.transfer(this.to, Number(this.value))
        .send({ from: userAccount })
        .on("receipt", function (receipt) {
          alert('Transaction successed!');
        })
        .on("error", function (error) {
          alert('Transaction errored!');
        });
    }
  },
  computed: {

  }
});

var transferCreditVM = new Vue({
  el: '#transferCredit',
  data: {
    value: '',
    to: '',
    memberOrNotOfTo: '',
    creditToHakoOfUser: '',
    debtToHakoOfTo: '',
    noCheckSentence: '',
    okCheckSentence: '',
    ok: '',
    active: false
  },
  methods: {
    async check() {
      this.ok = false;
      if (!this.value || !this.to) {
        this.noCheckSentence = "Please input a value!";
        this.active = !this.active;
        return;
      }
      try {
        this.memberOrNotOfTo = await hako.methods.memberCheckOf(this.to).call();
      } catch (error) {
        this.noCheckSentence = "Please input an address exactly!";
        this.active = !this.active;
        return;
      }
      this.creditToHakoOfUser = userInfoVM.creditToHakoOfUser;
      this.debtToHakoOfTo = await hako.methods.debtToHakoOf(this.to).call();
      if (this.memberOrNotOfTo !== '1') {
        this.noCheckSentence = 
        "NO! <" + this.to + "> is not a member account! You can't transfer your credit to non-member account!";
      } else if (Number(this.value) > Number(this.creditToHakoOfUser)) {
        this.noCheckSentence = 
        "NO! You have only " + this.creditToHakoOfUser + " credit! " + this.value + " is over!";
      } else if (this.debtToHakoOfTo !== '0') {
        this.noCheckSentence = 
        "NO! <" + this.to + "> has debt to Hako! You can't tansfer your credit to the account that has debt to Hako!";
      } else {
        this.okCheckSentence = "OK! You transfer " + this.value + " credit to <" + this.to + ">!";
        this.ok = true;
      }
      this.active = !this.active;
    },
    transferCredit() {
      return hako.methods.transferCredit(this.to, Number(this.value))
        .send({ from: userAccount })
        .on("receipt", function (receipt) {
          alert('Transaction successed!');
        })
        .on("error", function (error) {
          alert('Transaction errored!');
        });
    }
  },
  computed: {
    isMember() {
      return userInfoVM.memberOrNot === '1';
    }
  }
});

var joinHakoVM = new Vue({
  el: '#joinHako',
  data: {
    value: '',
    balanceOfUser: '',
    noCheckSentence: '',
    okCheckSentence: '',
    ok: '',
    active: false
  },
  methods: {
    async check() {
      this.ok = false;
      if (!this.value) {
        this.noCheckSentence = "Please input a value!";
        this.active = !this.active;
        return;
      }
      this.balanceOfUser = userInfoVM.userBalance;
      if (Number(this.value) > Number(this.balanceOfUser)) {
        this.noCheckSentence = "NO! You have only " + this.balanceOfUser + " token! " + this.value + " is over!";
      } else {
        this.okCheckSentence = "OK! You join Hako with depositing " + this.value + " token!";
        this.ok = true;
      }
      this.active = !this.active;
    },
    joinHako() {
      return hako.methods.joinHako(Number(this.value))
        .send({ from: userAccount })
        .on("receipt", function (receipt) {
          alert('Transaction successed!');
        })
        .on("error", function (error) {
          alert('Transaction errored!');
        });
    }
  },
  computed: {
    isMember() {
      return userInfoVM.memberOrNot === '1';
    }
  }
});

var leaveHakoVM = new Vue({
  el: '#leaveHako',
  data: {
    debtToHakoOfUser: '',
    creditToHakoOfUser: '',
    debtToMemberOfUser: '',
    creditToMemberOfUser: '',
    noCheckSentence: '',
    okCheckSentence: '',
    ok: '',
    active: false
  },
  methods: {
    async check() {
      this.ok = false;
      this.debtToHakoOfUser = userInfoVM.debtToHakoOfUser;
      this.creditToHakoOfUser = userInfoVM.creditToHakoOfUser;
      this.debtToMemberOfUser = userInfoVM.debtToMemberOfUser;
      this.creditToMemberOfUser = userInfoVM.creditToMemberOfUser;
      if (this.debtToHakoOfUser !== '0') {
        this.noCheckSentence = 
        "NO! You have " + this.debtToHakoOfUser + " debt to Hako! You should return them all or you can't leave!";
      } else if (this.debtToMemberOfUser !== '0') {
        this.noCheckSentence = 
        "NO! You have " + this.debtToMemberOfUser + " debt to Member! You should return them all or you can't leave!";
      } else if (this.creditToMemberOfUser !== '0') {
        this.noCheckSentence = 
        "NO! You have " + this.creditToMemberOfUser + " credit to Member! You should collect them all or you can't leave!";
      } else {
        this.okCheckSentence = "OK! You leave Hako! " + this.creditToHakoOfUser + " credit returns to you!";
        this.ok = true;
      }
      this.active = !this.active;
    },
    leaveHako() {
      return hako.methods.leaveHako()
        .send({ from: userAccount })
        .on("receipt", function (receipt) {
          alert('Transaction successed!');
        })
        .on("error", function (error) {
          alert('Transaction errored!');
        });
    }
  },
  computed: {
    isMember() {
      return userInfoVM.memberOrNot === '1';
    },
    haveNotDebtToHako() {
      return userInfoVM.debtToHakoOfUser === '0';
    },
    haveNotDebtToMember() {
      return userInfoVM.debtToMemberOfUser === '0';
    },
    haveNotCreditToMember() {
      return userInfoVM.creditToMemberOfUser === '0';
    }
  }
});

var depositTokenVM = new Vue({
  el: '#depositToken',
  data: {
    value: '',
    balanceOfUser: '',
    noCheckSentence: '',
    okCheckSentence: '',
    ok: '',
    active: false
  },
  methods: {
    async check() {
      this.ok = false;
      if (!this.value) {
        this.noCheckSentence = "Please input a value!";
        this.active = !this.active;
        return;
      }
      this.balanceOfUser = userInfoVM.userBalance;
      if (Number(this.value) > Number(this.balanceOfUser)) {
        this.noCheckSentence = "NO! You have only " + this.balanceOfUser + " token! " + this.value + " is over!";
      } else {
        this.okCheckSentence = "OK! You deposit " + this.value + " token!";
        this.ok = true;
      }
      this.active = !this.active;
    },
    depositToken() {
      return hako.methods.depositToken(Number(this.value))
        .send({ from: userAccount })
        .on("receipt", function (receipt) {
          alert('Transaction successed!');
        })
        .on("error", function (error) {
          alert('Transaction errored!');
        });
    }
  },
  computed: {
    isMember() {
      return userInfoVM.memberOrNot === '1';
    }
  }
});

var withdrawTokenVM = new Vue({
  el: '#withdrawToken',
  data: {
    value: '',
    creditToHakoOfUser: '',
    debtToHakoOfUser: '',
    debtToMemberOfUser: '',
    noCheckSentence: '',
    okCheckSentence: '',
    ok: '',
    active: false
  },
  methods: {
    async check() {
      this.ok = false;
      if (!this.value) {
        this.noCheckSentence = "Please input a value!";
        this.active = !this.active;
        return;
      }
      this.creditToHakoOfUser = userInfoVM.creditToHakoOfUser;
      this.debtToHakoOfUser = userInfoVM.debtToHakoOfUser;
      this.debtToMemberOfUser = userInfoVM.debtToMemberOfUser;
      if (Number(this.value) > Number(this.creditToHakoOfUser)) {
        this.noCheckSentence = 
        "NO! You have only " + this.creditToHakoOfUser + " credit! " + this.value + " is over!";
      } else if (this.debtToHakoOfUser !== '0') {
        this.noCheckSentence = 
        "NO! You have " + this.debtToHakoOfUser + " debt to Hako! You should return them all or you can't withdraw token!";
      } else if (this.debtToMemberOfUser !== '0') {
        this.noCheckSentence = 
        "NO! You have " + this.debtToMemberOfUser + " debt to Member! You should return them all or you can't withdraw token!";
      } else {
        this.okCheckSentence = "OK! You withdraw " + this.value + " credit!";
        this.ok = true;
      }
      this.active = !this.active;
    },
    withdrawToken() {
      return hako.methods.withdrawToken(Number(this.value))
        .send({ from: userAccount })
        .on("receipt", function (receipt) {
          alert('Transaction successed!');
        })
        .on("error", function (error) {
          alert('Transaction errored!');
        });
    }
  },
  computed: {
    isMember() {
      return userInfoVM.memberOrNot === '1';
    },
    haveNotDebtToHako() {
      return userInfoVM.debtToHakoOfUser === '0';
    },
    haveNotDebtToMember() {
      return userInfoVM.debtToMemberOfUser === '0';
    }
  }
});