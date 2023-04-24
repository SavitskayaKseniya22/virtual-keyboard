export default class Key {
  constructor(keyObject) {
    this.value = keyObject.value;
    this.secondValue = keyObject.secondValue;
    this.addition = keyObject.addition || '';
    this.isSpecial = keyObject.isSpecial;
  }

  makeKeyHTML() {
    const shortCuts = {
      Control: 'Ctrl',
      Delete: 'Del',
      ArrowLeft: '←',
      ArrowRight: '→',
      ArrowUp: '↑',
      ArrowDown: '↓',
    };
    let className = 'key';
    if (this.isSpecial) {
      className += ' key_special';
    } else {
      className += /^[0-9-=\\]$/.test(this.value) ? ' key_digits' : ' key_letters';
    }
    className += this.value === 'Space' ? ' key_space' : '';
    className += this.value === 'Enter' ? ' key_enter' : '';
    className += this.value === '`' ? ' key_digits' : '';

    return `<div data-value="${this.value.toLowerCase()}" data-second-value="${this.secondValue.toLowerCase()}" data-additional-value="${this.addition}" class="${className}">
      <span class="key-main-value">${shortCuts[this.value] || this.value}</span
      ><span class="key-addition-value">${this.addition}</span>
    </div>`;
  }
}
