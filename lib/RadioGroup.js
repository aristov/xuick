import { Widget } from './Widget.js'
import { Label } from './Label.js'
import { Inner } from './Inner.js'
import { Radio, RadioContext } from './Radio.js'
import './RadioGroup.css'

export class RadioGroup extends Widget
{
  static class = 'RadioGroup'

  static role = 'radiogroup'

  static #offsets = {
    ArrowUp : -1,
    ArrowLeft : -1,
    ArrowDown : 1,
    ArrowRight : 1,
  }

  init() {
    super.init()
    this.on('keydown', this.#onKeyDown)
    this.on('keyup', this.#onKeyUp)
    this.on('click', this.#onClick)
  }

  render() {
    const props = this.props
    return [
      props.label && new RadioGroupLabel({
        key : 'label',
        children : props.label,
      }),
      new Inner({
        key : 'inner',
        children : RadioContext.Provider({
          value : this.value,
          focus : false,
          children : this.renderRadios(),
        }),
      }),
    ]
  }

  renderRadios() {
    return this.props.radios || this.props.children
  }

  #updateValue(value) {
    if(this.props.disabled) {
      return
    }
    if(value === this.value) {
      return
    }
    this.value = value
    this.emit('change')
  }

  #onClick(e) {
    const radio = e.target.closest(Radio)
    if(radio) {
      this.#updateValue(radio.value)
    }
  }

  #onKeyDown(e) {
    if(e.code === 'Space') {
      e.preventDefault()
      return
    }
    const offset = RadioGroup.#offsets[e.code]
    if(!offset) {
      return
    }
    e.preventDefault()
    const value = this.value
    const radios = this.findAll(Radio)
    let index = radios.length + offset
    if(value) {
      index += radios.findIndex(radio => radio.value === value)
    }
    index %= radios.length
    this.#updateValue(radios[index].value)
  }

  #onKeyUp(e) {
    if(e.code !== 'Space') {
      return
    }
    const radio = this.find(Radio, radio => radio.focused)
    if(radio) {
      this.#updateValue(radio.value)
    }
  }
}

export class RadioGroupLabel extends Label
{
  static class = 'RadioGroupLabel'
}
