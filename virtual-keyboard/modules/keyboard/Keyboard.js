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
        isLong: element.length > 1,
        isSpecial: element.length > 1,
      });
    });
    console.log(this.array);
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
   <b>${this.lang}</b> 
    <br> Press Shift + Alt to change language</p>
    
    `;
    return this.keyboard;
  }

  shiftBehaviour() {
    const buttons = document.querySelectorAll('.key_shift');
    buttons.forEach((element) => {
      element.classList.toggle('active');
      this.isShiftActive = element.classList.contains('active');
    });
  }

  tapKey(keyName) {
    document.querySelector(`.key_${keyName}`).classList.add('pressed');
    setTimeout(() => {
      document.querySelector(`.key_${keyName}`)?.classList.remove('pressed');
    }, 300);
    const textArea = document.getElementById('text');
    if (this.isShiftActive) {
      textArea.value += keyName.toUpperCase();
      this.shiftBehaviour();
    } else {
      textArea.value += keyName;
    }
  }

  addListener() {
    this.values = [];
    document.addEventListener('keydown', (event) => {
      const keyName = event.key;
      this.values.push(keyName);
      if (keyName === 'Shift') {
        this.shiftBehaviour();
      } else if (/^[A-Za-zА-Яа-я]$/.test(keyName)) {
        this.tapKey(keyName);
      }
    });

    document.addEventListener('click', (event) => {
      if (event.target.closest('.key_shift')) {
        this.shiftBehaviour();
      } else if (
        event.target.closest('.key') &&
        !event.target.closest('.key').classList.contains('key_special')
      ) {
        this.tapKey(event.target.innerText);
      }
    });

    window.addEventListener('beforeunload', () => {
      window.localStorage.setItem('lang', this.lang);
    });
  }
}
