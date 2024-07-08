export default {
  eng: [
    "`",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "-",
    "=",
    "Backspace",
    "Delete",
    "\\",
    "]",
    "[",
    "p",
    "o",
    "i",
    "u",
    "y",
    "t",
    "r",
    "e",
    "w",
    "q",
    "Tab",
    "CapsLock",
    "a",
    "s",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    ";",
    "'",
    "Enter",
    "Shift",
    "/",
    ".",
    ",",
    "m",
    "n",
    "b",
    "v",
    "c",
    "x",
    "z",
    "Shift",
    "Control",

    "Alt",
    "Space",
    "Alt",
    "Control",
    "ArrowLeft",
    "ArrowUp",
    "ArrowDown",
    "ArrowRight",
  ],
  ru: [
    "ё",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "-",
    "=",
    "Backspace",
    "Delete",
    "\\",
    "ъ",
    "х",
    "з",
    "щ",
    "ш",
    "г",
    "н",
    "е",
    "к",
    "у",
    "ц",
    "й",
    "Tab",
    "CapsLock",
    "ф",
    "ы",
    "в",
    "а",
    "п",
    "р",
    "о",
    "л",
    "д",
    "ж",
    "э",
    "Enter",
    "Shift",
    ".",
    "ю",
    "б",
    "ь",
    "т",
    "и",
    "м",
    "с",
    "ч",
    "я",

    "Shift",
    "Control",

    "Alt",
    "Space",
    "Alt",
    "Control",
    "ArrowLeft",
    "ArrowUp",
    "ArrowDown",
    "ArrowRight",
  ],
  additions: ["~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "", "", "/"],
  codes: [
    "Backquote",
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
    "Digit0",
    "Minus",
    "Equal",
    "Backspace",
    "Delete",
    "Backslash",
    "BracketRight",
    "BracketLeft",
    "KeyP",
    "KeyO",
    "KeyI",
    "KeyU",
    "KeyY",
    "KeyT",
    "KeyR",
    "KeyE",
    "KeyW",
    "KeyQ",
    "Tab",
    "CapsLock",
    "KeyA",
    "KeyS",
    "KeyD",
    "KeyF",
    "KeyG",
    "KeyH",
    "KeyJ",
    "KeyK",
    "KeyL",
    "Semicolon",
    "Quote",
    "Enter",
    "ShiftRight",
    "Slash",
    "Period",
    "Comma",
    "KeyM",
    "KeyN",
    "KeyB",
    "KeyV",
    "KeyC",
    "KeyX",
    "KeyZ",
    "ShiftLeft",
    "ControlLeft",
    "AltLeft",
    "Space",
    "AltRight",
    "ControlRight",
    "ArrowLeft",
    "ArrowUp",
    "ArrowDown",
    "ArrowRight",
  ],
  makeShortcut() {
    const array = new Array(63);
    array.splice(14, 0, "Del");
    array.splice(54, 0, "Ctrl");
    array.splice(58, 0, "Ctrl");
    array.splice(59, 0, "←");
    array.splice(60, 0, "↑");
    array.splice(61, 0, "↓");
    array.splice(62, 0, "→");
    return array;
  },
  makeValueToConcat() {
    const array = new Array(63);
    array.splice(13, 0, "");
    array.splice(14, 0, "");
    array.splice(28, 0, "\t");
    array.splice(41, 0, "\n");
    array.splice(54, 0, "");
    array.splice(55, 0, "");
    array.splice(56, 0, " ");
    array.splice(57, 0, "");
    array.splice(58, 0, "");
    array.splice(59, 0, "");
    array.splice(60, 0, "");
    array.splice(61, 0, "");
    array.splice(62, 0, "");

    return array;
  },

  merge(lang) {
    const shortcut = this.makeShortcut();
    const values = this.makeValueToConcat();
    const object = {};
    this.codes.forEach((element, index) => {
      object[element] = {
        activeValue: lang === "RU" ? this.ru[index] : this.eng[index],
        ru: this.ru[index],
        eng: this.eng[index],
        addition: this.additions[index],
        shortcut: shortcut[index],
        value: values[index],
        index,
      };
    });

    return object;
  },
};
