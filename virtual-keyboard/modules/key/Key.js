export default class Key {
  constructor(keyObject) {
    this.value = keyObject.value;
    this.secondValue = keyObject.secondValue;
    this.addition = keyObject.addition;
    this.isLong = keyObject.isLong;
  }

  render() {
    this.keyContent = `<div class="key ${this.isLong ? 'key_long' : ''}">
      <span class="key-main-value">${this.value}</span
      ><span class="key-addition-value">${this.addition ?? ''}</span>
    </div>`;
    return this.keyContent;
  }
}
