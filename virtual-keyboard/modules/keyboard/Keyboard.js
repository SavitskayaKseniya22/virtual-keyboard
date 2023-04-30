import Key from '../key/Key.js';
import alphabet from '../../assets/scripts/utilities.js';

export default class Keyboard {
  constructor() {
    this.lang = window.localStorage.getItem('lang') || 'ENG';
    this.keyCodes = alphabet.codes;
    this.keyDescriptions = alphabet.merge(this.lang);
    this.isShiftActive = false;
    this.isCapsActive = false;
  }

  makeKey(element, object) {
    const key = new Key(element, object);
    this.keyContent = key.makeKeyHTML();
    return this.keyContent;
  }

  makeKeyArray(array, object) {
    this.keyboardContent = [];
    array.forEach((element) => {
      this.keyboardContent.push(this.makeKey(element, object));
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
        ${this.makeKeyArray(this.keyCodes.slice(0, 14), this.keyDescriptions)}</li>
        <li class="keyboard-row">
        ${this.makeKeyArray(this.keyCodes.slice(14, 29).reverse(), this.keyDescriptions)}</li>
        <li class="keyboard-row">
        ${this.makeKeyArray(this.keyCodes.slice(29, 42), this.keyDescriptions)}</li>
        <li class="keyboard-row">
        ${this.makeKeyArray(this.keyCodes.slice(42, 54).reverse(), this.keyDescriptions)}</li>
        <li class="keyboard-row">
        ${this.makeKeyArray(this.keyCodes.slice(54, this.keyCodes.length), this.keyDescriptions)}</li>
      </ul>
    </div>
    <p class="keyboard-addition">
   <b><span class="keyboard-addition__lang">${this.lang}</span></b>
    <br> Press Shift and then Ctrl to change language</p>`;
  }

  applySpecialBehaviour(keyName, code) {
    Keyboard.toggleSpecialButton(keyName);
    this.makeSpecialAction(keyName, code);
  }

  makeSpecialAction(keyName, code) {
    if (keyName === 'Shift') {
      this.isShiftActive = !this.isShiftActive;
      this.updateDigitsKeyboardLayout();
      this.updateCaseKeyboardLayout(this.isShiftActive !== this.isCapsActive);
    } else if (keyName === 'CapsLock') {
      this.isCapsActive = !this.isCapsActive;
      this.updateCaseKeyboardLayout(
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
    const keys = document.querySelectorAll(`.key_${keyName.toLowerCase()}`);
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

  updateCaseKeyboardLayout(triggerCase) {
    const letters = document.querySelectorAll('.key_letters');
    letters.forEach((elem) => {
      const code = elem.getAttribute('data-code');
      const { activeValue } = this.keyDescriptions[code];
      const changedValue = triggerCase ? activeValue.toUpperCase() : activeValue.toLowerCase();
      const elemToChange = elem.querySelector('.key-main-value');
      elemToChange.innerText = changedValue;
      this.keyDescriptions[code].activeValue = changedValue;
    });
  }

  updateDigitsKeyboardLayout() {
    const digits = document.querySelectorAll('.key_digits');
    digits.forEach((elem) => {
      const code = elem.getAttribute('data-code');
      if (!(code === 'Backquote' && this.lang === 'RU')) {
        const mainElemToChange = elem.querySelector('.key-main-value');
        const addElemToChange = elem.querySelector('.key-addition-value');
        const {
          addition, activeValue, ru, eng,
        } = this.keyDescriptions[code];

        if (addition !== activeValue) {
          this.keyDescriptions[code].activeValue = addition;
        } else {
          this.keyDescriptions[code].activeValue = this.lang === 'RU' ? ru : eng;
        }

        mainElemToChange.innerText = this.keyDescriptions[code].activeValue;
        addElemToChange.innerText = activeValue;
      }
    });
  }

  updateLangKeyboardLayout() {
    const letters = document.querySelectorAll('.key_letters');
    letters.forEach((elem) => {
      const code = elem.getAttribute('data-code');
      const elemToChange = elem.querySelector('.key-main-value');
      const changedValue = this.lang === 'ENG' ? this.keyDescriptions[code].ru : this.keyDescriptions[code].eng;
      elemToChange.innerText = changedValue;
      this.keyDescriptions[code].activeValue = changedValue;
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
    const { value, activeValue } = this.keyDescriptions[code];
    if (value !== undefined) {
      valueToConcat = value;
    } else {
      valueToConcat = activeValue;
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

  addListener() {
    document.addEventListener('keydown', (event) => {
      event.preventDefault();
      if (this.keyDescriptions[event.code]) {
        const key = this.keyDescriptions[event.code].activeValue;
        const target = document.querySelector(`[data-code="${event.code}"]`);
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
        const key = this.keyDescriptions[code].activeValue;
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
