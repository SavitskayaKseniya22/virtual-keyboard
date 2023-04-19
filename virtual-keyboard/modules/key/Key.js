export default class Key {
  constructor(keyObject) {
    this.value = keyObject.value;
    this.secondValue = keyObject.secondValue;
    this.addition = keyObject.addition;
    this.isLong = keyObject.isLong;
    this.isSpecial = keyObject.isSpecial;
  }

  render() {
    const long = this.isLong ? ' key_long' : '';
    const special = this.isSpecial ? ' key_special' : '';
    this.keyContent = `<div class="key${long}${special} key_${this.value.toLowerCase()}">
      <span class="key-main-value">${this.value}</span
      ><span class="key-addition-value">${this.addition ?? ''}</span>
    </div>`;
    return this.keyContent;
  }
}
