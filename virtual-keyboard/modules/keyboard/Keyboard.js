export default class Keyboard {
  constructor() {
    this.status = false;
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
}
