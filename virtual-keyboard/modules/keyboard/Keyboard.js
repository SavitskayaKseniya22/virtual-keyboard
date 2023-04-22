/* eslint-disable import/extensions */
import Key from '../key/Key.js';

export default class Keyboard {
  constructor() {
    this.lang = window.localStorage.getItem('lang') || 'ENG';

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
      'Control',
      'Win',
      'Alt',
      'Space',
      'Alt',
      'Control',
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
      'Control',
      'Win',
      'Alt',
      'Space',
      'Alt',
      'Control',
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
    this.keyContent = key.makeKeyHTML();
    return this.keyContent;
  }

  makeKeyArray(array) {
    this.keyboardContent = [];
    array.forEach((element) => {
      this.keyboardContent.push(this.makeKey(element));
    });
    return this.keyboardContent.join('');
  }

  makeKeyboardHTML() {
    return `
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
    <br> Press Shift + Control to change language</p>`;
  }

  applySpecialBehaviour(keyName) {
    Keyboard.toggleSpecialButton(keyName);
    this.makeSpecialAction(keyName);
  }

  makeSpecialAction(keyName) {
    if (keyName === 'shift') {
      this.isShiftActive = !this.isShiftActive;
      Keyboard.updateCaseKeyboardLayout(
        this.isShiftActive !== this.isCapsActive,
      );
      return;
    }
    if (keyName === 'capslock') {
      this.isCapsActive = !this.isCapsActive;
      Keyboard.updateCaseKeyboardLayout(
        this.isShiftActive !== this.isCapsActive,
      );
      return;
    }
    if (keyName === 'control' && this.isShiftActive) {
      this.applySpecialBehaviour('shift');
      this.switchLang();
    }
  }

  static toggleSpecialButton(keyName) {
    const keys = document.querySelectorAll(`[data-value="${keyName}"]`);
    keys.forEach((element) => {
      element.classList.toggle('active');

      if (keyName === 'shift' || keyName === 'capslock') {
        return;
      }

      setTimeout(() => {
        element.classList.toggle('active');
      }, 300);
    });
  }

  static updateCaseKeyboardLayout(trigger) {
    const letters = document.querySelectorAll('.key_letters');
    letters.forEach((elem) => {
      const value = elem.getAttribute('data-value');
      const changedValue = trigger ? value.toUpperCase() : value.toLowerCase();
      const elemToChange = elem.querySelector('.key-main-value');
      elemToChange.innerText = changedValue;
    });
  }

  static updateLangKeyboardLayout() {
    const letters = document.querySelectorAll('.key_letters');
    letters.forEach((elem) => {
      const value = elem.getAttribute('data-value');
      const secondValue = elem.getAttribute('data-second-value');
      elem.setAttribute('data-value', secondValue);
      elem.setAttribute('data-second-value', value);
      const elemToChange = elem.querySelector('.key-main-value');
      elemToChange.innerText = secondValue;
    });
  }

  switchLang() {
    Keyboard.updateLangKeyboardLayout();
    this.lang = this.lang === 'ENG' ? 'RU' : 'ENG';
    Keyboard.saveLang(this.lang);
  }

  static saveLang(langValue) {
    window.localStorage.setItem('lang', langValue);
    document.querySelector('.keyboard-addition__lang').innerText = langValue;
  }

  setLang() {
    if (this.lang === 'RU') {
      Keyboard.updateLangKeyboardLayout();
    }
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

  changeTextarea(keyName, addition = null) {
    const textArea = document.getElementById('text');
    let valueToConcat = keyName;

    if (this.isShiftActive !== this.isCapsActive) {
      valueToConcat = addition || keyName.toUpperCase();
    }

    textArea.value += valueToConcat;
  }

  transliterationLetter(keyName, keyCode = null) {
    if (
      keyName === '.'
      && ((this.lang === 'ENG' && keyCode === 'Period')
        || (this.lang === 'RU' && keyCode === 'Slash'))
    ) {
      return '.';
    }

    if (this.lang === 'RU' && this.eng.includes(keyName || keyName.toLowerCase())) {
      const index = this.eng.indexOf(keyName);
      return this.ru[index];
    }
    if (this.lang === 'ENG' && this.ru.includes(keyName || keyName.toLowerCase())) {
      const index = this.ru.indexOf(keyName);
      return this.eng[index];
    }
    return keyName;
  }

  addListener() {
    document.addEventListener('keydown', (event) => {
      event.preventDefault();
      const key = this.transliterationLetter(event.key.toLowerCase(), event.code);
      const target = document.querySelector(`[data-value="${key}"]`);

      if (target.classList.contains('key_special')) {
        this.applySpecialBehaviour(key);
      } else {
        const addition = target?.getAttribute('data-additional-value') || null;
        this.changeTextarea(key, addition);
        if (this.isShiftActive) {
          this.applySpecialBehaviour('shift');
        }
      }
      Keyboard.toggleKeyAnimation(key);
    });

    document.addEventListener('click', (event) => {
      const target = event.target.closest('.key');
      if (target) {
        const keyName = target.getAttribute('data-value');
        if (target.classList.contains('key_special')) {
          this.applySpecialBehaviour(keyName);
        } else {
          const addition = target.getAttribute('data-additional-value');
          this.changeTextarea(keyName, addition);
          if (this.isShiftActive) {
            this.applySpecialBehaviour('shift');
          }
        }
        Keyboard.toggleKeyAnimation(keyName);
      }
    });
  }
}
