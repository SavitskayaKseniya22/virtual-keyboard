/* eslint-disable import/extensions */
import Keyboard from './modules/keyboard/Keyboard.js';

const keyboard = new Keyboard();
document
  .querySelector('body')
  .insertAdjacentHTML('afterbegin', keyboard.render());

Keyboard.setLang();
keyboard.addListener();
