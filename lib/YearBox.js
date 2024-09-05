import { ComboBox } from './ComboBox.js'
import { Label } from './Label.js'
import { Control } from './Control.js'
import { Popup } from './Popup.js'
import { YearPicker } from './YearPicker.js'
import { Grid } from './Grid.js'
import './YearBox.css'

export class YearBox extends ComboBox
{
  static class = 'YearBox'

  static defaultProps = {
    hasPopup : 'grid',
  }

  static #offsets = {
    false : {
      ArrowUp : 1,
      ArrowRight : YearPicker.ROW_LENGTH,
      ArrowDown : -1,
      ArrowLeft : -YearPicker.ROW_LENGTH,
    },
    true : YearPicker.offsets,
  }

  init() {
    super.init()
    this.on('keydown', this.#onKeyDown)
  }

  render() {
    const props = this.props
    return [
      props.label && new YearBoxLabel({
        key : 'label',
        children : props.label,
      }),
      this._control = new YearBoxControl({
        key : 'control',
        children : this.value ?? props.text ?? ' ',
      }),
      new YearBoxPopup({
        key : 'popup',
        float : true,
        anchor : this,
        open : this.state.expanded,
        id : this.popupId,
        children : new YearPicker({
          classList : 'PopupContent',
          value : this.value,
          tabIndex : null,
          onclick : this.#onYearPickerClick,
          onchange : this.#onYearPickerChange,
        }),
        ...props.popup,
      }),
    ]
  }

  #onYearPickerClick = e => {
    if(e.target.closest(Grid)) {
      this.setState({ expanded : false })
    }
    this.focus()
  }

  #onYearPickerChange = e => {
    e.stopPropagation()
    this.value = e.target.value
    this.emit('change')
  }

  #onKeyDown(e) {
    const offset = YearBox.#offsets[this.expanded][e.code]
    if(!offset) {
      return
    }
    e.preventDefault()
    const value = this.value ?? new Date().getFullYear()
    this.value = value + offset
    this.emit('change')
  }
}

export class YearBoxLabel extends Label
{
  static class = 'YearBoxLabel'
}

export class YearBoxControl extends Control
{
  static class = 'YearBoxControl'
}

export class YearBoxPopup extends Popup
{
  static class = 'YearBoxPopup'
}
