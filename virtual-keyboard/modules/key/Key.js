export default class Key {
  constructor(keyObject) {
    this.value = keyObject.value;
    this.secondValue = keyObject.secondValue;
    this.addition = keyObject.addition;
    this.shortcut = keyObject.shortcut;
    this.dataset = `data-value="${this.value.toLowerCase()}" data-second-value="${this.secondValue.toLowerCase()}" ${this.addition ? `data-additional-value="${this.addition}"` : ''}`;
    this.classList = Key.makeClassList(this.value);
  }

  static makeClassList(value) {
    let classList = 'key';
    if (value.length > 1) {
      classList += ` key_special key_${value.toLowerCase()}`;
    } else {
      classList += /^[0-9-=\\]$/.test(value) ? ' key_digits' : ' key_letters';
    }
    classList += value === '`' ? ' key_digits' : '';
    return classList;
  }

  makeKeyHTML() {
    return `<div ${this.dataset} class="${this.classList}">
      <span class="key-main-value">${this.shortcut || this.value}</span
      >${this.addition ? `<span class="key-addition-value">${this.addition}</span>` : ''}
    </div>`;
  }
}
