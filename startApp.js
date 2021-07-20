var hako;
var userAccount;
async function startApp() {
  hako = new web3.eth.Contract(hakoABI, hakoAddress);
  userAccount = await web3.eth.getCoinbase();
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