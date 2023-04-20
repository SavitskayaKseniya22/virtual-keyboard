export default class Key {
  constructor(keyObject) {
    this.value = keyObject.value;
    this.secondValue = keyObject.secondValue;
    this.addition = keyObject.addition;
    this.isSpecial = keyObject.isSpecial;
  }

  render() {
    let className;
    if (this.isSpecial) {
      className = 'key_special';
    } else {
      className = /^[0-9`\-=]$/.test(this.value) ? 'key_digits' : 'key_letters';
    }

    this.keyContent = `<div data-value="${this.value.toLowerCase()}" data-second-value="${this.secondValue.toLowerCase()}" data-additional-value="${
      this.addition
    }" class="key ${className}">
      <span class="key-main-value">${this.value}</span
      ><span class="key-addition-value">${this.addition ?? ''}</span>
    </div>`;
    return this.keyContent;
  }
}
