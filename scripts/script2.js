var registerBorrowValueDurationVM = new Vue({
  el: '#registerBorrowValueDuration',
  data: {
    value: '',
    duration: '',
    days: '',
    hours: '',
    minutes: '',
    seconds: '',
    balanceOfUser: '',
    creditToHakoOfUser: '',
    debtToHakoOfUser: '',
    creditToMemberOfUser: '',
    debtToMemberOfUser: '',
    netAssetsOfUser: '',
    noCheckSentence: '',
    okCheckSentence: '',
    ok: '',
    active: false
  },
  methods: {
    async check() {
      this.ok = false;
      this.duration = 
      Number(this.days) * 24 * 60 * 60 + Number(this.hours) * 60 * 60 + Number(this.minutes) * 60 + Number(this.seconds);
      if (!this.value || !this.duration) {
        this.noCheckSentence = "Please input a value!";
        this.active = !this.active;
        return;
      }
      this.balanceOfUser = userInfoVM.userBalance;
      this.creditToHakoOfUser = userInfoVM.creditToHakoOfUser;
      this.debtToHakoOfUser = userInfoVM.debtToHakoOfUser;
      this.creditToMemberOfUser = userInfoVM.creditToMemberOfUser;
      this.debtToMemberOfUser = userInfoVM.debtToMemberOfUser;
      this.netAssetsOfUser = userInfoVM.netAssetsOfUser;
      if (this.netAssetsOfUser < 0) {
        this.noCheckSentence = 
        "NO! Your net assets is under zero! You can't register borrow value and borrow duration!";
      } else if (this.debtToMemberOfUser !== '0') {
        this.noCheckSentence = 
        "NO! You have " + this.debtToMemberOfUser + " debt to Member! You should return them all or you can't register!";
      } else if (Number(this.value) > this.netAssetsOfUser) {
        this.noCheckSentence = 
        "NO! Your net assets is only " + this.netAssetsOfUser + "! You can't register more than " + this.netAssetsOfUser + " credit!";
      } else {
        this.okCheckSentence = 
        "OK! You register that you want to borrow " + this.value + " credit for " + this.duration + " seconds!";
        this.ok = true;
      }
      this.active = !this.active;
    },
    registerBorrowValueDuration() {
      return hako.methods.registerBorrowValueDuration(Number(this.value), Number(this.duration))
      .send({from: userAccount})
      .on("receipt", function(receipt) {
        alert('Transaction successed!');
      })
      .on("error", function(error) {
        alert('Transaction errored!');
      });
    }
  },
  computed: {
    isMember() {
      return userInfoVM.memberOrNot === '1';
    },
    haveNotDebtToMember() {
      return userInfoVM.debtToMemberOfUser === '0';
    }
  }
});

var lendCreditVM = new Vue({
  el: '#lendCredit',
  data: {
    to: '',
    value: '',
    duration: '',
    days: '',
    hours: '',
    minutes: '',
    seconds: '',
    memberOrNotOfTo: '',
    creditToHakoOfUser: '',
    debtToHakoOfTo: '',
    borrowValueDurationOfTo: '',
    valueDuration: {
      value: '',
      duration: ''
    },
    noCheckSentence: '',
    okCheckSentence: '',
    ok: '',
    active: false
  },
  methods: {
    async check() {
      this.ok = false;
      this.duration = 
      Number(this.days) * 24 * 60 * 60 + Number(this.hours) * 60 * 60 + Number(this.minutes) * 60 + Number(this.seconds);
      if (!this.to || !this.value || !this.duration) {
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
      this.borrowValueDurationOfTo = await hako.methods.getBorrowValueDurationOf(this.to).call();
      this.valueDuration.value = this.borrowValueDurationOfTo['0'];
      this.valueDuration.duration = this.borrowValueDurationOfTo['1'];
      if (this.memberOrNotOfTo !== '1') {
        this.noCheckSentence = 
        "NO! <" + this.to + "> is not a member account! You can't lend your credit to non-member account!";
      } else if (Number(this.value) > Number(this.creditToHakoOfUser)) {
        this.noCheckSentence = 
        "NO! You have only " + this.creditToHakoOfUser + " credit! " + this.value + " is over!";
      } else if (this.debtToHakoOfTo !== '0') {
        this.noCheckSentence = 
        "NO! <" + this.to + "> has debt to Hako! You can't lend your credit to the account that has debt to Hako!";
      } else if (Number(this.value) > Number(this.valueDuration.value)) {
        this.noCheckSentence = 
        "NO! The borrower wants to borrow only " + this.valueDuration.value + " credit! " + this.value + " is over!";
      } else if (Number(this.duration) < Number(this.valueDuration.duration)) {
        this.noCheckSentence = 
        "NO! The borrower wants to borrow credit for " + this.valueDuration.duration + " seconds over! " + 
        this.duration + " seconds is not enough!";
      } else {
        this.okCheckSentence = 
        "OK! You lend " + this.value + " credit to <" + this.to + "> for " + this.duration + " seconds!";
        this.ok = true;
      }
      this.active = !this.active;
    },
    lendCredit() {
      return hako.methods.lendCredit(this.to, Number(this.value), Number(this.duration))
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

var collectDebtFromVM = new Vue({
  el: '#collectDebtFrom',
  data: {
    debtor: '',
    id: '',
    creditToMemberIds: '',
    creditToMemberIDListOfUser: '',
    rawLendRecord: '',
    lendRecordsOfUser: {
      '0': {
        id: '',
        debtor: '',
        value: '',
        duration: '',
        time: '',
        deadline: '',
        over: ''
      }
    },
    lendRecordsNumber: '',
    lendRecords: '',
    lendRecordActive: false,
    noCheckSentence: '',
    okCheckSentence: '',
    ok: '',
    active: false
  },
  methods: {
    async getCreditToMemberInfo() {
      this.creditToMemberIDListOfUser = [];
      this.creditToMemberIds = await hako.methods.getCreditToMemberIds().call({from: userAccount});
      for (ID of this.creditToMemberIds) {
        if (ID !== '0') {
          this.creditToMemberIDListOfUser.push(ID);
        }
      }
      this.lendRecordsNumber = 1;
      for (ID of this.creditToMemberIDListOfUser) {
        this.rawLendRecord = await hako.methods.getLendRecords(ID).call();
        this.lendRecordsOfUser[String(this.lendRecordsNumber)] = {
          id: '',
          debtor: '',
          value: '',
          duration: '',
          time: '',
          deadline: '',
          over: ''
        };
        this.lendRecordsOfUser[String(this.lendRecordsNumber)].id = "ID: " + this.rawLendRecord['0'];
        this.lendRecordsOfUser[String(this.lendRecordsNumber)].debtor = "Debtor: " + this.rawLendRecord['2'];
        this.lendRecordsOfUser[String(this.lendRecordsNumber)].value = "Value: " + this.rawLendRecord['3'];
        this.lendRecordsOfUser[String(this.lendRecordsNumber)].duration = "Duration: " + this.rawLendRecord['4'];
        this.lendRecordsOfUser[String(this.lendRecordsNumber)].time = 
        "Time: " + String(new Date(Number(this.rawLendRecord['5']) * 1000));
        this.lendRecordsOfUser[String(this.lendRecordsNumber)].deadline = 
        "Deadline: " + String(new Date(Number(this.rawLendRecord['5']) * 1000 + Number(this.rawLendRecord['4']) * 1000));
        if (Number(new Date()) >= Number(this.rawLendRecord['5']) * 1000 + Number(this.rawLendRecord['4']) * 1000) {
          this.lendRecordsOfUser[String(this.lendRecordsNumber)].over = "You can collect debt!";
        } else {
          this.lendRecordsOfUser[String(this.lendRecordsNumber)].over = "You cannot collect debt!";
        }
        this.lendRecordsNumber = this.lendRecordsNumber + 1;
      }
      this.lendRecordsNumber = '';
      delete this.lendRecordsOfUser['0'];
      this.lendRecordActive = !this.lendRecordActive;
    },
    async check() {
      this.ok = false;
      if (!this.debtor || !this.id) {
        this.noCheckSentence = "Please input a value!";
        this.active = !this.active;
        return;
      }
      try {
        await hako.methods.memberCheckOf(this.debtor).call();
      } catch (error) {
        this.noCheckSentence = "Please input an address exactly!";
        this.active = !this.active;
        return;
      }
      try {
        this.lendRecords = await hako.methods.getLendRecords(this.id).call();
      } catch (error) {
        this.noCheckSentence = "Lending ID error! Make sure ID again!";
        this.active = !this.active;
        return;
      }
      if (this.lendRecords['1'].toUpperCase() !== userAccount.toUpperCase()) {
        this.noCheckSentence = "NO! You are not the creditor of this lending!";
      } else if (this.lendRecords['2'].toUpperCase() !== this.debtor.toUpperCase()) {
        this.noCheckSentence = "NO! <" + this.debtor + "> is not the debtor of this lending!";
      } else if ((Date.now() / 1000) < Number(this.lendRecords['4']) + Number(this.lendRecords['5'])) {
        this.noCheckSentence = "NO! The duration is yet to be passed!";
      } else if (this.lendRecords['6'] !== "1") {
        this.noCheckSentence = "NO! Lending ID: " + this.id + " is wrong or this lending had already finished!";
      } else {
        this.okCheckSentence = "OK! You collect " + this.lendRecords['3'] + " debt from <" + this.debtor + ">!";
        this.ok = true;
      }
      this.active = !this.active;
    },
    collectDebtFrom() {
      return hako.methods.collectDebtFrom(this.debtor, Number(this.id))
      .send({from: userAccount})
      .on("receipt", function(receipt) {
        alert('Transaction successed!');
      })
      .on("error", function(error) {
        alert('Transaction errored!');
      });
    }
  },
  computed: {
    isMember() {
      return userInfoVM.memberOrNot === '1';
    },
    haveNotCreditToMember() {
      return userInfoVM.creditToMemberOfUser === '0';
    }
  }
});

var returnDebtToVM = new Vue({
  el: '#returnDebtTo',
  data: {
    creditor: '',
    id: '',
    debtToMemberIds: '',
    debtToMemberIDListOfUser: '',
    rawLendRecord: '',
    lendRecordsOfUser: {
      '0': {
        id: '',
        creditor: '',
        value: '',
        duration: '',
        time: '',
        deadline: '',
        over: ''
      }
    },
    lendRecordsNumber: '',
    lendRecords: '',
    lendRecordActive: false,
    creditToHakoOfUser: '',
    noCheckSentence: '',
    okCheckSentence: '',
    ok: '',
    active: false
  },
  methods: {
    async getDebtToMemberInfo() {
      this.debtToMemberIDListOfUser = [];
      this.debtToMemberIds = await hako.methods.getDebtToMemberIds().call({from: userAccount});
      for (ID of this.debtToMemberIds) {
        if (ID !== '0') {
          this.debtToMemberIDListOfUser.push(ID);
        }
      }
      this.lendRecordsNumber = 1;
      for (ID of this.debtToMemberIDListOfUser) {
        this.rawLendRecord = await hako.methods.getLendRecords(ID).call();
        this.lendRecordsOfUser[String(this.lendRecordsNumber)] = {
          id: '',
          creditor: '',
          value: '',
          duration: '',
          time: '',
          deadline: '',
          over: ''
        };
        this.lendRecordsOfUser[String(this.lendRecordsNumber)].id = "ID: " + this.rawLendRecord['0'];
        this.lendRecordsOfUser[String(this.lendRecordsNumber)].creditor = "Creditor: " + this.rawLendRecord['1'];
        this.lendRecordsOfUser[String(this.lendRecordsNumber)].value = "Value: " + this.rawLendRecord['3'];
        this.lendRecordsOfUser[String(this.lendRecordsNumber)].duration = "Duration: " + this.rawLendRecord['4'];
        this.lendRecordsOfUser[String(this.lendRecordsNumber)].time = 
        "Time: " + String(new Date(Number(this.rawLendRecord['5']) * 1000));
        this.lendRecordsOfUser[String(this.lendRecordsNumber)].deadline = 
        "Deadline: " + String(new Date(Number(this.rawLendRecord['5']) * 1000 + this.rawLendRecord['4'] * 1000));
        if (Number(new Date()) >= Number(this.rawLendRecord['5']) * 1000 + Number(this.rawLendRecord['4']) * 1000) {
          this.lendRecordsOfUser[String(this.lendRecordsNumber)].over = "Deadline is already passed!!";
        } else {
          this.lendRecordsOfUser[String(this.lendRecordsNumber)].over = "Deadline is yet to be passed!!";
        }
        this.lendRecordsNumber = this.lendRecordsNumber + 1;
      }
      this.lendRecordsNumber = '';
      delete this.lendRecordsOfUser['0'];
      this.lendRecordActive = !this.lendRecordActive;
    },
    async check() {
      this.ok = false;
      if (!this.creditor || !this.id) {
        this.noCheckSentence = "Please input a value!";
        this.active = !this.active;
        return;
      }
      try {
        await hako.methods.memberCheckOf(this.creditor).call();
      } catch (error) {
        this.noCheckSentence = "Please input an address exactly!";
        this.active = !this.active;
        return;
      }
      try {
        this.lendRecords = await hako.methods.getLendRecords(this.id).call();
      } catch (error) {
        this.noCheckSentence = "Lending ID error! Make sure ID again!";
        this.active = !this.active;
        return;
      }
      this.creditToHakoOfUser = userInfoVM.creditToHakoOfUser;
      if (Number(this.lendRecords['3']) > Number(this.creditToHakoOfUser)) {
        this.noCheckSentence = "NO! You have only " + this.creditToHakoOfUser + " credit! " + this.lendRecords['3'] + " is over!";
      } else if (this.lendRecords['2'].toUpperCase() !== userAccount.toUpperCase()) {
        this.noCheckSentence = "NO! You are not the debtor of this lending!";
      } else if (this.lendRecords['1'].toUpperCase() !== this.creditor.toUpperCase()) {
        this.checkSenoCheckSentencentence = "NO! <" + this.creditor + "> is not the creditor of this lending!";
      } else if (this.lendRecords['6'] !== "1") {
        this.noCheckSentence = "NO! Lending ID: " + this.id + " is wrong or this lending had already finished!";
      } else {
        this.okCheckSentence = "OK! You return " + this.lendRecords['3'] + " debt to <" + this.creditor + ">!";
        this.ok = true;
      }
      this.active = !this.active;
    },
    returnDebtTo() {
      return hako.methods.returnDebtTo(this.creditor, Number(this.id))
      .send({from: userAccount})
      .on("receipt", function(receipt) {
        alert('Transaction successed!');
      })
      .on("error", function(error) {
        alert('Transaction errored!');
      });
    }
  },
  computed: {
    isMember() {
      return userInfoVM.memberOrNot === '1';
    },
    haveNotDebtToMember() {
      return userInfoVM.debtToMemberOfUser === '0';
    }
  }
});

var creditCreationByMemberVM = new Vue({
  el: '#creditCreationByMember',
  data: {
    value: '',
    balanceOfUser: '',
    creditToHakoOfUser: '',
    debtToHakoOfUser: '',
    creditToMemberOfUser: '',
    debtToMemberOfUser: '',
    netAssetsOfUser: '',
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
      this.creditToHakoOfUser = userInfoVM.creditToHakoOfUser;
      this.debtToHakoOfUser = userInfoVM.debtToHakoOfUser;
      this.creditToMemberOfUser = userInfoVM.creditToMemberOfUser;
      this.debtToMemberOfUser = userInfoVM.debtToMemberOfUser;
      this.netAssetsOfUser = userInfoVM.netAssetsOfUser;
      if (this.netAssetsOfUser < 0) {
        this.noCheckSentence = 
        "NO! Your net assets is under zero! You can't register borrow value and borrow duration!";
      } else if (this.debtToHakoOfUser !== '0') {
        this.noCheckSentence = 
        "NO! You have " + this.debtToHakoOfUser + " debt to Hako! You should return them all or you can't create credit!";
      } else if (Number(this.value) > Number(this.netAssetsOfUser)) {
        this.noCheckSentence = 
        "NO! Your net assets is only " + this.netAssetsOfUser + "! You can't create more than " + this.netAssetsOfUser + " credit!";
      } else {
        this.okCheckSentence = 
        "OK! You create " + this.value + " credit! At this time, you have " + this.value + " debt to Hako!";
        this.ok = true;
      }
      this.active = !this.active;
    },
    creditCreationByMember() {
      return hako.methods.creditCreationByMember(Number(this.value))
      .send({from: userAccount})
      .on("receipt", function(receipt) {
        alert('Transaction successed!');
      })
      .on("error", function(error) {
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
    }
  }
});

var arrangementVM = new Vue({
  el: '#arrangement',
  data: {
    value: '',
    creditToHakoOfUser: '',
    debtToHakoOfUser: '',
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
      if (Number(this.value) > Number(this.creditToHakoOfUser)) {
        this.noCheckSentence = "NO! You have only " + this.creditToHakoOfUser + " credit! " + this.value + " is over!";
      } else if (Number(this.value) > Number(this.debtToHakoOfUser)) {
        this.noCheckSentence = "NO! You have only " + this.debtToHakoOfUser + " debt! " + this.value + " is over!";
      } else {
        this.okCheckSentence = "OK! You reduce " + this.value + " debt by reducing " + this.value + " credit!";
        this.ok = true;
      }
      this.active = !this.active;
    },
    arrangement() {
      return hako.methods.arrangement(Number(this.value))
      .send({from: userAccount})
      .on("receipt", function(receipt) {
        alert('Transaction successed!');
      })
      .on("error", function(error) {
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
    }
  }
});