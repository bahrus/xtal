class AppDrawer extends HTMLElement {
  constructor() {
    super();
  }

  // static get observedAttributes() {
  //   return ['my-prop'];
  // }

  connectedCallback() {
    this.innerHTML = "<b>I'm an app-drawer-markup!</b>";
  }

  private _myProp : string;
  /**
   * I am here
   */
  public get myProp() : string {
    return this._myProp;
  }

  public set myProp(val: string){
    this._myProp = val;
  }
}
window.addEventListener('WebComponentsReady', function() {
  customElements.define('app-drawer', AppDrawer);
});
