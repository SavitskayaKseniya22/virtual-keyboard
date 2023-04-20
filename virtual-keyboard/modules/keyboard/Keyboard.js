/* eslint-disable import/extensions */
import Key from '../key/Key.js';

export default class Keyboard {
  constructor() {
    this.eng = [
      '`',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      '-',
      '=',
      'Backspace',
      'Del',
      '\\',
      ']',
      '[',
      'p',
      'o',
      'i',
      'u',
      'y',
      't',
      'r',
      'e',
      'w',
      'q',
      'Tab',
      'CapsLock',
      'a',
      's',
      'd',
      'f',
      'g',
      'h',
      'j',
      'k',
      'l',
      ';',
      "'",
      'Enter',
      'Shift',
      '/',
      '.',
      ',',
      'm',
      'n',
      'b',
      'v',
      'c',
      'x',
      'z',
      'Shift',
      'Ctrl',
      'Win',
      'Alt',
      'Space',
      'Alt',
      'Ctrl',
      '←',
      '↑',
      '↓',
      '→',
    ];
    this.ru = [
      'ё',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      '-',
      '=',
      'Backspace',
      'Del',
      '\\',
      'ъ',
      'х',
      'з',
      'щ',
      'ш',
      'г',
      'н',
      'е',
      'к',
      'у',
      'ц',
      'й',
      'Tab',
      'CapsLock',
      'ф',
      'ы',
      'в',
      'а',
      'п',
      'р',
      'о',
      'л',
      'д',
      'ж',
      'э',
      'Enter',
      'Shift',
      '.',
      'ю',
      'б',
      'ь',
      'т',
      'и',
      'м',
      'с',
      'ч',
      'я',

      'Shift',
      'Ctrl',
      'Win',
      'Alt',
      'Space',
      'Alt',
      'Ctrl',
      '←',
      '↑',
      '↓',
      '→',
    ];
    this.additions = [
      '~',
      '!',
      '@',
      '#',
      '$',
      '%',
      '^',
      '&',
      '*',
      '(',
      ')',
      '_',
      '+',
      '',
      '',
      '/',
    ];
    this.alpabet = this.merge(this.eng, this.ru, this.additions);
    this.isShiftActive = false;
    this.isCapsActive = false;
  }

  merge(arr, arr2, arr3) {
    this.array = [];
    arr.forEach((element, index) => {
      this.array.push({
        value: element,
        secondValue: arr2[index],
        addition: arr3[index] ?? null,
        isSpecial: element.length > 1,
      });
    });
    return this.array;
  }

  makeKey(element) {
    const key = new Key(element);
    this.keyContent = key.render();
    return this.keyContent;
  }

  makeKeyArray(array) {
    this.keyboardContent = [];
    array.forEach((element) => {
      this.keyboardContent.push(this.makeKey(element));
    });
    return this.keyboardContent.join('');
  }

  render() {
    this.keyboard = `
    <div class="keyboard-container">
    <textarea id="text" name="text" class="keyboard-textarea" placeholder="Type something..."></textarea>
      <ul class="keyboard">
        <li class="keyboard-row">
        ${this.makeKeyArray(this.alpabet.slice(0, 14))}</li>
        <li class="keyboard-row">
        ${this.makeKeyArray(this.alpabet.slice(14, 29).reverse())}</li>
        <li class="keyboard-row">
        ${this.makeKeyArray(this.alpabet.slice(29, 42))}</li>
        <li class="keyboard-row">
        ${this.makeKeyArray(this.alpabet.slice(42, 54).reverse())}</li>
        <li class="keyboard-row">
        ${this.makeKeyArray(this.alpabet.slice(54, this.alpabet.length))}</li>
      </ul>
    </div>
    <p class="keyboard-addition">
   <b><span class="keyboard-addition__lang">${this.lang}</span></b>
    <br> Press Shift + Alt to change language</p>
    
    `;
    return this.keyboard;
  }

  toggleSpecialButton(keyName) {
    const keys = document.querySelectorAll(`[data-value="${keyName}"]`);
    keys.forEach((element) => {
      element.classList.toggle('active');
      const triggerStatus = element.classList.contains('active');

      if (keyName === 'shift') {
        this.isShiftActive = triggerStatus;
      } else if (keyName === 'capslock') {
        this.isCapsActive = triggerStatus;
      }
    });
  }

  static setLang() {
    this.lang = window.localStorage.getItem('lang') || 'ENG';
    if (this.lang === 'RU') {
      Keyboard.changeLang();
    }
    Keyboard.saveLang();
  }

  static changeLang(trigger = null) {
    const letters = document.querySelectorAll('.key_letters');
    letters.forEach((elem) => {
      const value = elem.getAttribute('data-value');
      const secondValue = elem.getAttribute('data-second-value');
      elem.setAttribute('data-value', secondValue);
      elem.setAttribute('data-second-value', value);
      const elemToChange = elem.querySelector('.key-main-value');
      elemToChange.innerText = secondValue;
    });

    if (trigger) {
      this.lang = window.localStorage.getItem('lang') === 'ENG' ? 'RU' : 'ENG';
    }
  }

  static saveLang() {
    window.localStorage.setItem('lang', this.lang);
    document.querySelector('.keyboard-addition__lang').innerText = this.lang;
  }

  static toggleKeyAnimation(keyName) {
    document
      .querySelector(`[data-value="${keyName}"]`)
      ?.classList.add('pressed');

    setTimeout(() => {
      document
        .querySelector(`[data-value="${keyName}"]`)
        ?.classList.remove('pressed');
    }, 300);
  }

  tapKey(keyName, addition = null) {
    const key = this.transliterationLetter(keyName);
    Keyboard.toggleKeyAnimation(key);
    this.changeTextarea(key, addition);
  }

  changeTextarea(keyName, addition = null) {
    const textArea = document.getElementById('text');
    let valueToConcat = keyName;

    if (this.isShiftActive !== this.isCapsActive) {
      valueToConcat = addition || keyName.toUpperCase();
    }

    if (this.isShiftActive && this.isCapsActive) {
      this.toggleSpecialButton('shift');
    } else if (this.isShiftActive && !this.isCapsActive) {
      this.toggleSpecialButton('shift');
    }
    textArea.value += valueToConcat;
  }

  transliterationLetter(item) {
    const lang = window.localStorage.getItem('lang');

    if (lang === 'RU' && this.eng.includes(item || item.toLowerCase())) {
      const index = this.eng.indexOf(item);
      return this.ru[index];
    }
    if (lang === 'ENG' && this.ru.includes(item || item.toLowerCase())) {
      const index = this.ru.indexOf(item);
      return this.eng[index];
    }
    return item;
  }

  addListener() {
    document.addEventListener('keydown', (event) => {
      const keyName = event.key;
      if (keyName === 'Shift') {
        this.toggleSpecialButton('shift');
      } else if (keyName === 'CapsLock') {
        this.toggleSpecialButton('capslock');
      } else if (keyName.length === 1) {
        const target = document.querySelector(`[data-value="${keyName}"]`);
        const addition = target?.getAttribute('data-additional-value') || null;
        this.tapKey(keyName, addition);
      } else if (keyName === 'Control') {
        Keyboard.changeLang(true);
        Keyboard.saveLang();
      }
    });

    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-value="shift"]')) {
        this.toggleSpecialButton('shift');
      } else if (event.target.closest('[data-value="capslock"]')) {
        this.toggleSpecialButton('capslock');
      } else if (
        event.target.closest('.key_digits') ||
        event.target.closest('.key_letters')
      ) {
        const target =
          event.target.closest('.key_digits') ||
          event.target.closest('.key_letters');
        const value = target.getAttribute('data-value');
        const addition = target.getAttribute('data-additional-value');
        this.tapKey(value, addition);
      } else if (event.target.closest('[data-value="ctrl"]')) {
        Keyboard.changeLang(true);
        Keyboard.saveLang();
      }
    });
  }
}
