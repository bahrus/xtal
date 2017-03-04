class AppDrawer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = "<b>I'm an app-drawer-markup!</b>";
  }
}
window.addEventListener('WebComponentsReady', function() {
  customElements.define('app-drawer', AppDrawer);
});
