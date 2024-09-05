import { TextBox } from './TextBox.js'
import './SearchBox.css'

export class SearchBox extends TextBox
{
  static class = 'SearchBox'

  static defaultProps = {
    inputRole : 'SearchBox',
    inputMode : 'search',
    enterKeyHint : 'search',
    autocapitalize : 'none',
    spellcheck : 'false',
  }

  init() {
    super.init()
    this.on('keydown', this.#onKeyDown)
  }

  #onKeyDown(e) {
    if(e.code !== 'Escape') {
      return
    }
    this.value = ''
    this.emit('input')
  }
}
