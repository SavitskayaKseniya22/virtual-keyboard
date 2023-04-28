/* eslint-disable import/extensions */
/* eslint-disable no-multi-assign */
import Key from '../key/Key.js';
import buttons from '../../assets/buttons.js';
import alphabet from '../../assets/scripts/utilities.js';

export default class Keyboard {
  constructor() {
    this.lang = window.localStorage.getItem('lang') || 'ENG';
    this.alpabet = buttons;
    this.isShiftActive = false;
    this.isCapsActive = false;
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
    <div class="textarea-container">
    <textarea id="text" name="text" class="keyboard-textarea" placeholder="Type something..." cols="60"></textarea>
    </div>
    
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
    <br> Press Shift + Ctrl to change language</p>`;
  }

  applySpecialBehaviour(keyName) {
    Keyboard.toggleSpecialButton(keyName);
    this.makeSpecialAction(keyName);
  }

  makeSpecialAction(keyName) {
    if (keyName === 'shift') {
      this.isShiftActive = !this.isShiftActive;
      Keyboard.updateCaseKeyboardLayout(this.isShiftActive !== this.isCapsActive);
      Keyboard.updateDigitsKeyboardLayout();
    } else if (keyName === 'capslock') {
      this.isCapsActive = !this.isCapsActive;
      Keyboard.updateCaseKeyboardLayout(
        this.isShiftActive !== this.isCapsActive,
      );
    } else if (keyName === 'control' && this.isShiftActive) {
      this.applySpecialBehaviour('shift');
      this.switchLang();
    } else if (keyName === 'control' || keyName === 'alt') {
      return keyName;
    } else {
      this.changeTextarea(keyName);
    }
    return keyName;
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

  static updateCaseKeyboardLayout(triggerCase) {
    const letters = document.querySelectorAll('.key_letters');
    letters.forEach((elem) => {
      const value = elem.getAttribute('data-value');
      const changedValue = triggerCase ? value.toUpperCase() : value.toLowerCase();
      const elemToChange = elem.querySelector('.key-main-value');
      elemToChange.innerText = changedValue;
    });
  }

  static updateDigitsKeyboardLayout() {
    const digits = document.querySelectorAll('.key_digits');
    digits.forEach((elem) => {
      const value = elem.getAttribute('data-value');
      if (value !== 'ё') {
        const addition = elem.getAttribute('data-additional-value');
        elem.setAttribute('data-value', addition);
        elem.setAttribute('data-additional-value', value);
        const mainElemToChange = elem.querySelector('.key-main-value');
        mainElemToChange.innerText = addition;
        const addElemToChange = elem.querySelector('.key-addition-value');
        addElemToChange.innerText = value;
      }
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

  static toggleKeyAnimation(node) {
    node.classList.add('pressed');

    setTimeout(() => {
      node.classList.remove('pressed');
    }, 300);
  }

  checkValueToConcat(keyName) {
    let valueToConcat = keyName;
    const simbols = {
      space: ' ',
      enter: '\n',
      tab: '\t',
      delete: '',
      backspace: '',
      arrowleft: '',
      arrowup: '',
      arrowdown: '',
      arrowright: '',
    };

    if (Object.keys(simbols).includes(keyName)) {
      valueToConcat = simbols[keyName];
    } else if (this.isShiftActive !== this.isCapsActive) {
      valueToConcat = keyName.toUpperCase();
    }
    return valueToConcat;
  }

  static checkPositionToConcat(keyName, textArea) {
    let [start, end] = [textArea.selectionStart, textArea.selectionEnd];
    const upValue = textArea.selectionEnd - Number(textArea.getAttribute('cols')) < 0 ? 0 : textArea.selectionEnd - Number(textArea.getAttribute('cols'));
    const downValue = Number(textArea.getAttribute('cols')) + textArea.selectionEnd > textArea.value.length ? textArea.value.length : Number(textArea.getAttribute('cols')) + textArea.selectionEnd;
    const positions = {
      delete: [start, end] = [textArea.selectionStart, textArea.selectionEnd + 1],
      backspace: [start, end] = [textArea.selectionStart - 1, textArea.selectionEnd],
      arrowleft: [start, end] = [textArea.selectionStart - 1, textArea.selectionEnd - 1],
      arrowup: [start, end] = [upValue, upValue],
      arrowdown: [start, end] = [downValue, downValue],
      arrowright: [start, end] = [textArea.selectionStart + 1, textArea.selectionEnd + 1],
    };

    if (textArea.selectionEnd !== 0 && positions[keyName]) {
      [start, end] = positions[keyName];
    }

    return [start, end];
  }

  changeTextarea(keyName) {
    const textArea = document.getElementById('text');
    textArea.focus();
    const valueToConcat = this.checkValueToConcat(keyName);
    const [start, end] = Keyboard.checkPositionToConcat(keyName, textArea);
    textArea.setRangeText(valueToConcat, start, end, 'end');
    textArea.scrollTop = textArea.scrollHeight;
  }

  transliterationLetter(keyName, keyCode = null) {
    if (
      keyName === '.'
      && ((this.lang === 'ENG' && keyCode === 'Period')
        || (this.lang === 'RU' && keyCode === 'Slash'))
    ) {
      return '.';
    }

    if (this.lang === 'RU' && alphabet.eng.includes(keyName || keyName.toLowerCase())) {
      const index = alphabet.eng.indexOf(keyName);
      return alphabet.ru[index];
    }
    if (this.lang === 'ENG' && alphabet.ru.includes(keyName || keyName.toLowerCase())) {
      const index = alphabet.ru.indexOf(keyName);
      return alphabet.eng[index];
    }
    return keyName;
  }

  addListener() {
    document.addEventListener('keydown', (event) => {
      const keyName = event.key === ' ' ? event.code : event.key;
      event.preventDefault();
      const order = (event.location);
      const index = order ? order - 1 : 0;
      const key = this.transliterationLetter(keyName.toLowerCase(), event.code);
      const target = document.querySelectorAll(`[data-value="${key}"]`)[index];
      if (target) {
        if (target.classList.contains('key_special')) {
          this.applySpecialBehaviour(key);
        } else {
          this.changeTextarea(key);
          if (this.isShiftActive) {
            this.applySpecialBehaviour('shift');
          }
        }
        Keyboard.toggleKeyAnimation(target);
      }
    });

    document.addEventListener('click', (event) => {
      const target = event.target.closest('.key');

      if (target) {
        const keyName = target.getAttribute('data-value');
        if (target.classList.contains('key_special')) {
          this.applySpecialBehaviour(keyName);
        } else {
          this.changeTextarea(keyName);
          if (this.isShiftActive) {
            this.applySpecialBehaviour('shift');
          }
        }
        Keyboard.toggleKeyAnimation(target);
      }
    });
  }
}
