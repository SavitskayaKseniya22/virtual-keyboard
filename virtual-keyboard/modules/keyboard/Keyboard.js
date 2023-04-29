/* eslint-disable import/extensions */

import Key from '../key/Key.js';
import alphabet from '../../assets/scripts/utilities.js';

export default class Keyboard {
  constructor() {
    this.lang = window.localStorage.getItem('lang') || 'ENG';
    this.keyCodes = alphabet.codes;
    this.keyDescriptions = alphabet.merge();
    this.isShiftActive = false;
    this.isCapsActive = false;
  }

  makeKey(element, object, lang) {
    const key = new Key(element, object, lang);
    this.keyContent = key.makeKeyHTML();
    return this.keyContent;
  }

  makeKeyArray(array, object, lang) {
    this.keyboardContent = [];
    array.forEach((element) => {
      this.keyboardContent.push(this.makeKey(element, object, lang));
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
        ${this.makeKeyArray(this.keyCodes.slice(0, 14), this.keyDescriptions, this.lang)}</li>
        <li class="keyboard-row">
        ${this.makeKeyArray(this.keyCodes.slice(14, 29).reverse(), this.keyDescriptions, this.lang)}</li>
        <li class="keyboard-row">
        ${this.makeKeyArray(this.keyCodes.slice(29, 42), this.keyDescriptions, this.lang)}</li>
        <li class="keyboard-row">
        ${this.makeKeyArray(this.keyCodes.slice(42, 54).reverse(), this.keyDescriptions, this.lang)}</li>
        <li class="keyboard-row">
        ${this.makeKeyArray(this.keyCodes.slice(54, this.keyCodes.length), this.keyDescriptions, this.lang)}</li>
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
    const positions = {
      delete: [textArea.selectionStart, textArea.selectionEnd + 1],
      backspace: [textArea.selectionStart - 1, textArea.selectionEnd],
      arrowleft: [textArea.selectionStart - 1, textArea.selectionEnd - 1],
      arrowup: [upValue, upValue],
      arrowdown: [Number(textArea.getAttribute('cols')) + textArea.selectionEnd, Number(textArea.getAttribute('cols')) + textArea.selectionEnd],
      arrowright: [textArea.selectionStart + 1, textArea.selectionEnd + 1],
    };

    if (positions[keyName]) {
      if ((keyName === 'backspace' || keyName === 'arrowleft' || keyName === 'arrowup') && textArea.selectionEnd === 0) {
        return [start, end];
      }
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
      let key = this.transliterationLetter(keyName.toLowerCase(), event.code);
      let target = document.querySelectorAll(`[data-value="${key}"]`)[index];

      if (!target && this.isShiftActive) {
        target = document.querySelectorAll(`[data-additional-value="${key}"]`)[index];
        key = target?.getAttribute('data-value');
      }

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
