import { HtmlInput } from 'htmlmodule'
import { Button, ButtonControl } from './Button.js'
import './FileBox.css'

export class FileBox extends Button
{
  static class = 'FileBox'

  static role = null

  static defaultProps = {
    tabIndex : null,
  }

  file = null

  init() {
    super.init()
    this.on('change', this.#onChange)
  }

  render() {
    return [
      new ButtonControl(this.props.label),
      this._input = new HtmlInput({
        type : 'file',
        accept : this.props.accept,
      }),
    ]
  }

  reset() {
    this._input.value = ''
  }

  #onChange(e) {
    if(e.target === this) {
      return
    }
    e.stopImmediatePropagation()
    this.files = e.target.node.files
    this.file = this.files[0] || null
    this.emit('change')
  }
}
