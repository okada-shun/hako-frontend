Vue.component('footer-component', {
  template: `
    <div class="footer-item">
      <div class="footer-link">
        <a href="https://twitter.com/hakofinance" target="_blank" class="footer-icon">
          <i class="fab fa-twitter fa-fw fa-lg"></i>
        </a>
        <a href="https://github.com/okada-shun/hako-finance" target="_blank" class="footer-icon">
          <i class="fab fa-github fa-fw fa-lg"></i>
        </a>
        <a href="https://discord.gg/3hGkVqkqg9" target="_blank" class="footer-icon">
          <i class="fab fa-discord fa-fw fa-lg"></i>
        </a>
      </div>
      <small>© 2021 hako finance.</small>
    </div>
  `
})
var vm = new Vue({
  el: '#footer',
})