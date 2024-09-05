import { DateTime, Interval } from 'luxon'
import { Class } from 'htmlmodule'
import { ComboBox } from './ComboBox.js'
import { Label } from './Label.js'
import { Control } from './Control.js'
import { Inner } from './Inner.js'
import { Popup } from './Popup.js'
import { PopupContent } from './PopupContent.js'
import { DatePicker } from './DatePicker.js'
import './DateBox.css'

export class DateBox extends ComboBox
{
  static class = 'DateBox'

  static defaultProps = {
    hasPopup : 'dialog',
    format : DateTime.DATE_FULL,
  }

  static #codes = {
    true : DatePicker.offsets,
    false : {
      ArrowLeft : -1,
      ArrowRight : 1,
      ArrowUp : 7,
      ArrowDown : -7,
    },
  }

  init() {
    super.init()
    this.on('keydown', this.#onKeyDown)
  }

  render() {
    const props = this.props
    const value = props.type === 'range' ?
      props.value :
      this.value && [this.value, this.value].join('/')
    const interval = value && Interval.fromISO(value)
    const text = props.type === 'range' ?
      interval?.toLocaleString(props.format) :
      interval?.start.toLocaleString(props.format)
    return [
      props.label && new DateBoxLabel({
        key : 'label',
        children : props.label,
      }),
      new DateBoxControl({
        key : 'control',
        children : [
          new Inner({
            key : 'inner',
            children : text || props.text || ' ',
          }),
        ],
      }),
      new DateBoxPopup({
        key : 'popup',
        role : 'Dialog',
        float : true,
        anchor : this,
        open : this.state.expanded,
        children : new DatePicker({
          id : this.popupId,
          tabIndex : null,
          type : props.type,
          classList : Class.generate(PopupContent),
          required : props.required,
          value : props.value,
          onchange : this.#onDatePickerChange,
        }),
        ...props.popup,
      }),
    ]
  }

  #onDatePickerChange = e => {
    e.stopPropagation()
    if(this.expanded && this.props.type !== 'range') {
      this.state.expanded = false
    }
    this.value = e.target.value
    this.emit('change')
  }

  /**
   * @param {EventType} e
   */
  #onKeyDown(e) {
    if(e.code === 'Backspace') {
      if(this.required) {
        return
      }
      this.value = undefined
      this.emit('change')
      return
    }
    if(e.target !== this || this.props.type === 'range') {
      return
    }
    const days = DateBox.#codes[this.expanded][e.code]
    if(!days) {
      return
    }
    e.preventDefault()
    const dt = this.value ?
      DateTime.fromISO(this.value) :
      DateTime.now()
    this.value = dt.plus({ days }).toISODate()
    this.emit('change')
  }
}

export class DateBoxLabel extends Label
{
  static class = 'DateBoxLabel'
}

export class DateBoxControl extends Control
{
  static class = 'DateBoxControl'
}

export class DateBoxPopup extends Popup
{
  static class = 'DateBoxPopup'

  static role = 'dialog'
}
