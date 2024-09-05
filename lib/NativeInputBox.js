import pick from 'lodash/pick'
import { HtmlInput } from 'htmlmodule'
import { Widget } from './Widget.js'
import { Label } from './Label.js'
import { Control } from './Control.js'
import { NativeInput } from './NativeInput.js'
import './NativeInputBox.css'

const keys = [
  ...Object.keys(HtmlInput.props),
  'autocapitalize',
  'enterKeyHint',
  'spellcheck',
  'dir',
]

export class NativeInputBox extends Widget
{
  static role = null

  static class = 'NativeInputBox'

  static defaultProps = {
    tabIndex : null,
  }

  value = ''

  init() {
    super.init()
    this.on('input', this.#onInput)
    this.on('change', this.#onChange)
    this.on('pointerdown', this.#onPointerDown)
  }

  render() {
    const props = this.props
    return [
      props.label && new NativeInputBoxLabel({
        key : 'label',
        children : props.label,
      }),
      new NativeInputBoxControl({
        key : 'control',
        children : this._input = new NativeInput(pick(this.props, keys)),
      }),
    ]
  }

  focus() {
    this._input.focus()
  }

  blur() {
    this._input.blur()
  }

  #onInput(e) {
    if(e.target === this) {
      return
    }
    e.preventDefault()
    e.stopImmediatePropagation()
    this.value = e.target.value
    this.emit('input')
  }

  #onChange(e) {
    if(e.target === this) {
      return
    }
    e.stopImmediatePropagation()
    this.emit('change')
  }

  #onPointerDown(e) {
    if(e.target !== this._input) {
      setTimeout(() => this._input.focus())
    }
  }
}

export class NativeInputBoxLabel extends Label
{
  static class = 'NativeInputBoxLabel'
}

export class NativeInputBoxControl extends Control
{
  static class = 'NativeInputBoxControl'
}
