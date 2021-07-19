Vue.component('header-component', {
  template: `
    <div class="header-item">
      <div class="header-logo">
        <a href="../index.html">Hako Finance</a>
      </div>
      <p class="introduction">
        Transfer, get, lend, borrow, and credit creation, all transactions are realized on Hako Finance!<br>
        Welcome to next-generation DeFi!
      </p>
    </div>
  `
})
var vm = new Vue({
  el: '#header',
})