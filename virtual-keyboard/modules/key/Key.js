export default class Key {
  constructor(key, object, lang) {
    this.keyObject = object[key];
    this.value = lang === 'RU' ? this.keyObject.ru : this.keyObject.eng;
    this.secondValue = lang === 'RU' ? this.keyObject.eng : this.keyObject.ru;
    this.addition = this.keyObject.addition;
    this.shortcut = this.keyObject.shortcut;
    this.dataset = ` data-code="${key}"  data-value="${this.value.toLowerCase()}" data-second-value="${this.secondValue.toLowerCase()}" ${this.addition ? `data-additional-value="${this.addition}"` : ''}`;
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
