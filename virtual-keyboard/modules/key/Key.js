export default class Key {
  constructor(keyObject) {
    this.value = keyObject.value;
    this.secondValue = keyObject.secondValue;
    this.addition = keyObject.addition;

    this.isSpecial = keyObject.isSpecial;
  }

  render() {
    const special = this.isSpecial ? ' key_special' : '';
    const digits = /^[0-9|`|\-|=]$/.test(this.value) ? ' key_digits' : '';
    const letters = /^[A-Za-zА-Яа-я]$/.test(this.value) ? ' key_letters' : '';

    this.keyContent = `<div data-value="${this.value.toLowerCase()}" class="key${special}${digits}${letters}">
      <span class="key-main-value">${this.value}</span
      ><span class="key-addition-value">${this.addition ?? ''}</span>
    </div>`;
    return this.keyContent;
  }
}
