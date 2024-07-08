import "normalize.css";
import "./style.scss";

import Keyboard from "./modules/keyboard/Keyboard.js";

const keyboard = new Keyboard();
document.querySelector("body").insertAdjacentHTML("afterbegin", keyboard.makeKeyboardHTML());

keyboard.addListener();
