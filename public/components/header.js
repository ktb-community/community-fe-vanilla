class Header extends HTMLElement {
  constructor() {
    super();
    this.state = {}
  }

  static get observedAttributes(name, oldValue, newValue) {

  }

  render() {
    this.innerHTML = this.template(this.state);
  }

  template(state) {

  }
}

window.customElements.define('custom-header', Header);