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
    <br> Press Shift and then Ctrl to change language</p>`;
  }

  applySpecialBehaviour(keyName, code) {
    Keyboard.toggleSpecialButton(keyName, code);
    this.makeSpecialAction(keyName, code);
  }

  makeSpecialAction(keyName, code) {
    if (keyName === 'Shift') {
      this.isShiftActive = !this.isShiftActive;
      Keyboard.updateCaseKeyboardLayout(this.isShiftActive !== this.isCapsActive);
      this.updateDigitsKeyboardLayout();
    } else if (keyName === 'CapsLock') {
      this.isCapsActive = !this.isCapsActive;
      Keyboard.updateCaseKeyboardLayout(
        this.isShiftActive !== this.isCapsActive,
      );
    } else if (keyName === 'Control' && this.isShiftActive) {
      this.applySpecialBehaviour('Shift', code);
      this.switchLang();
    } else {
      this.changeTextarea(keyName, code);
    }
    return keyName;
  }

  static toggleSpecialButton(keyName) {
    const keys = document.querySelectorAll(`[data-value="${keyName}"]`);
    keys.forEach((element) => {
      element.classList.toggle('active');

      if (keyName === 'Shift' || keyName === 'CapsLock') {
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

  updateDigitsKeyboardLayout() {
    const digits = document.querySelectorAll('.key_digits');
    digits.forEach((elem) => {
      const code = elem.getAttribute('data-code');
      const mainElemToChange = elem.querySelector('.key-main-value');
      const addElemToChange = elem.querySelector('.key-addition-value');
      const { addition } = this.keyDescriptions[code];
      const value = 'ENG' ? this.keyDescriptions[code].eng : this.keyDescriptions[code].ru;

      if (addElemToChange.innerText === addition) {
        addElemToChange.innerText = value;
        mainElemToChange.innerText = addition;
      } else {
        addElemToChange.innerText = addition;
        mainElemToChange.innerText = value;
      }
    });
  }

  updateLangKeyboardLayout() {
    const letters = document.querySelectorAll('.key_letters');
    letters.forEach((elem) => {
      const code = elem.getAttribute('data-code');
      const elemToChange = elem.querySelector('.key-main-value');
      elemToChange.innerText = this.lang === 'ENG' ? this.keyDescriptions[code].ru : this.keyDescriptions[code].eng;
    });
  }

  switchLang() {
    this.updateLangKeyboardLayout();
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

  checkValueToConcat(keyName, code) {
    let valueToConcat = keyName;

    const { value, addition } = this.keyDescriptions[code];

    if (value !== undefined) {
      valueToConcat = value;
    } else if (addition !== undefined && (this.isShiftActive)) {
      valueToConcat = addition;
    } else if (this.isShiftActive !== this.isCapsActive) {
      valueToConcat = keyName.toUpperCase();
    }

    return valueToConcat;
  }

  static checkPositionToConcat(keyName, textArea) {
    let [start, end] = [textArea.selectionStart, textArea.selectionEnd];

    const upValue = textArea.selectionEnd - Number(textArea.getAttribute('cols')) < 0 ? 0 : textArea.selectionEnd - Number(textArea.getAttribute('cols'));
    const positions = {
      Delete: [textArea.selectionStart, textArea.selectionEnd + 1],
      Backspace: [textArea.selectionStart - 1, textArea.selectionEnd],
      ArrowLeft: [textArea.selectionStart - 1, textArea.selectionEnd - 1],
      ArrowUp: [upValue, upValue],
      ArrowDown: [Number(textArea.getAttribute('cols')) + textArea.selectionEnd, Number(textArea.getAttribute('cols')) + textArea.selectionEnd],
      ArrowRight: [textArea.selectionStart + 1, textArea.selectionEnd + 1],
    };

    if (positions[keyName]) {
      if ((keyName === 'Backspace' || keyName === 'ArrowLeft' || keyName === 'ArrowUp') && textArea.selectionEnd === 0) {
        return [start, end];
      }
      [start, end] = positions[keyName];
    }

    return [start, end];
  }

  changeTextarea(keyName, code) {
    const textArea = document.getElementById('text');
    textArea.focus();
    const valueToConcat = this.checkValueToConcat(keyName, code);
    const [start, end] = Keyboard.checkPositionToConcat(keyName, textArea);
    textArea.setRangeText(valueToConcat, start, end, 'end');
    textArea.scrollTop = textArea.scrollHeight;
  }

  static chooseLangForKey(object, lang) {
    return object[lang.toLowerCase()];
  }

  addListener() {
    document.addEventListener('keydown', (event) => {
      event.preventDefault();
      if (this.keyDescriptions[event.code]) {
        let key = Keyboard.chooseLangForKey(this.keyDescriptions[event.code], this.lang);
        const target = document.querySelector(`[data-code="${event.code}"]`);
        if (this.isShiftActive && this.keyDescriptions[event.code].addition && !(event.code === 'Backquote' && this.lang === 'RU')) {
          key = this.keyDescriptions[event.code].addition;
        }

        if (target) {
          if (target.classList.contains('key_special')) {
            this.applySpecialBehaviour(key, event.code);
          } else {
            this.changeTextarea(key, event.code);
            if (this.isShiftActive) {
              this.applySpecialBehaviour('Shift', event.code);
            }
          }
          Keyboard.toggleKeyAnimation(target);
        }
      }
    });

    document.addEventListener('click', (event) => {
      const target = event.target.closest('.key');

      if (target) {
        const code = target.getAttribute('data-code');
        const key = Keyboard.chooseLangForKey(this.keyDescriptions[code], this.lang);
        if (target.classList.contains('key_special')) {
          this.applySpecialBehaviour(key, code);
        } else {
          this.changeTextarea(key, code);
          if (this.isShiftActive) {
            this.applySpecialBehaviour('Shift', code);
          }
        }
        Keyboard.toggleKeyAnimation(target);
      }
    });
  }
}
