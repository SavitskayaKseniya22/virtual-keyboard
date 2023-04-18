export default class Keyboard {
  constructor() {
    this.status = false;
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
      'Enter',
      'Shift',
      'Control',
      'Meta',
      'Alt',
      ' ',
      'Alt',
      'Control',
      'ArrowLeft',
      'ArrowDown',
      'ArrowRight',
      'ArrowUp',
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
      'Enter',
      'Shift',
      'Control',
      'Meta',
      'Alt',
      ' ',
      'AltGraph',
      'Control',
      'ArrowLeft',
      'ArrowDown',
      'ArrowRight',
      'ArrowUp',
    ];
    this.alpabet = this.merge(this.eng, this.ru);
  }

  merge(arr, arr2) {
    this.obj = {};
    arr.forEach((element, index) => {
      this.obj[`key${index}`] = [String(element)].concat([String(arr2[index])]);
    });
    console.log(this.obj);
  }

  render() {
    this.html = `
      <ul class="keyboard">
        <li class="keyboard-row"></li>
        <li class="keyboard-row"></li>
        <li class="keyboard-row"></li>
        <li class="keyboard-row"></li>
        <li class="keyboard-row"></li>
      </ul>
    `;
    return this.html;
  }

  addListener() {
    this.values = [];
    document.addEventListener('keydown', (event) => {
      const keyName = event.key;
      this.values.push(keyName);
      console.log(this.values);
    });
  }
}
