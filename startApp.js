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

async function getTransactionData(event) {
  let txHash = event.transactionHash;
  let blockN = await web3.eth.getTransaction(txHash);
  let blockData = await web3.eth.getBlock(blockN.blockNumber);
  let time = new Date(blockData.timestamp * 1000).toLocaleString();
  return ([txHash, blockN, blockData, time]);
}