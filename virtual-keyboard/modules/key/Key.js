export default class Key {
  constructor(keyObject) {
    this.value = keyObject.value;
    this.secondValue = keyObject.secondValue;
    this.addition = keyObject.addition;
    this.isLong = keyObject.isLong;
    this.isSpecial = keyObject.isSpecial;
  }

  render() {
    this.keyContent = `<div class="key ${this.isLong ? 'key_long' : ''} ${
      this.isSpecial ? 'key_special' : ''
    } key_${this.value.toLowerCase()}">
      <span class="key-main-value">${this.value}</span
      ><span class="key-addition-value">${this.addition ?? ''}</span>
    </div>`;
    return this.keyContent;
  }
}
