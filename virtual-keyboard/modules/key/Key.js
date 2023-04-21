export default class Key {
  constructor(keyObject) {
    this.value = keyObject.value;
    this.secondValue = keyObject.secondValue;
    this.addition = keyObject.addition;
    this.isSpecial = keyObject.isSpecial;
  }

  makeKeyHTML() {
    let className;
    if (this.isSpecial) {
      className = 'key_special';
    } else {
      className = /^[0-9\-=]$/.test(this.value) ? 'key_digits' : 'key_letters';
    }

    return `<div data-value="${this.value.toLowerCase()}" data-second-value="${this.secondValue.toLowerCase()}" data-additional-value="${
      this.addition || ''
    }" class="key ${className}${this.value === 'Space' ? ' key_space' : ''}${
      this.value === 'Enter' ? ' key_enter' : ''
    }">
      <span class="key-main-value">${this.value}</span
      ><span class="key-addition-value">${this.addition ?? ''}</span>
    </div>`;
  }
}
