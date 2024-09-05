import { DateTime } from 'luxon'
import { Id } from 'htmlmodule'
import { Widget } from './Widget.js'
import { Option } from './Option.js'
import { Label } from './Label.js'
import { TextBox } from './TextBox.js'
import { Popup } from './Popup.js'
import { ListBox } from './ListBox.js'
import './TimeBox.css'

export class TimeBox extends Widget
{
  static class = 'TimeBox'

  static role = 'combobox'

  static defaultProps = {
    tabIndex : null,
    autoComplete : 'list',
    hasPopup : 'listbox',
  }

  state = {
    ...this.state,
    expanded : false,
    text : '',
  }

  #id = undefined

  #typing = false

  #click = false

  init() {
    super.init()
    this.on('click', this.#onClick)
    this.on('pointerdown', this.#onPointerDown)
    this.on('focusin', this.#onFocusIn)
    this.on('focusout', this.#onFocusOut)
    this.on('keydown', this.#onKeyDown)
  }

  assign() {
    super.assign()
    this.expanded = this.state.expanded
    this.controls = this.#id ??= Id.generate()
    if(this.props.value === undefined) {
      this.classList = 'blank'
    }
  }

  render() {
    const props = this.props
    const value = props.value
    const options = this.renderOptions()
    return [
      props.label && new Label({
        key : 'label',
        children : props.label,
      }),
      this._textBox = new TextBox({
        key : 'textbox',
        value : this.#typing ? this.state.text : value,
        placeholder : props.placeholder ?? '––:––',
        oninput : this.#onTextBoxInput,
      }),
      new Popup({
        key : 'popup',
        anchor : this,
        open : this.state.expanded,
        oncancel : this.#onPopupCancel,
        children : this._listBox = new ListBox({
          id : this.#id,
          value : options.some(opt => opt.props.value === value) ?
            value :
            undefined,
          tabIndex : null,
          classList : 'PopupContent',
          onclick : this.#onListBoxClick,
          onchange : this.#onListBoxChange,
          options,
        }),
      }),
    ]
  }

  renderOptions() {
    const options = []
    const now = DateTime.now()
    let dt = DateTime.fromISO('00:00')
    while(dt.hasSame(now, 'day')) {
      options.push(new Option({
        value : dt.toFormat('HH:mm'),
        text : dt.toFormat('HH:mm'),
      }))
      dt = dt.plus({ minutes : 15 })
    }
    return options
  }

  update(prevProps, prevState) {
    if(this.state.expanded && !prevState.expanded) {
      this._listBox.scrollToOption()
    }
  }

  focus() {
    this._textBox.focus()
  }

  #updateValue() {
    const text = this._textBox.value?.trim()
    const dt = text && DateTime.fromFormat(text, 'H:m')
    const value = dt?.isValid ?
      dt.toFormat('HH:mm') :
      undefined
    if(value !== this.value) {
      this.value = value
      this.emit('change')
    }
  }

  #onFocusIn() {
    if(this.#click) {
      this.#click = false
      return
    }
    if(!this.state.expanded) {
      this.setState({ expanded : true })
    }
  }

  #onFocusOut() {
    this.#updateValue()
  }

  #onClick(e) {
    if(e.target.closest(Popup)) {
      this.focus()
      return
    }
    if(!this.state.expanded) {
      this.setState({ expanded : true })
    }
    this.focus()
  }

  #onPopupCancel = () => {
    this.setState({ expanded : false })
  }

  #onTextBoxInput = e => {
    this.#typing = true
    this.setState({ text : e.target.value })
    this.#typing = false
  }

  #onListBoxChange = e => {
    e.stopPropagation()
    this.value = e.target.value
    this.emit('change')
  }

  #onListBoxClick = () => {
    this.setState({ expanded : false })
    this.#click = true
  }

  #onEnter() {
    this.#updateValue()
    this.setState(state => ({
      expanded : !state.expanded,
    }))
  }

  #onSpace(e) {
    e.preventDefault()
    this.setState(state => ({
      expanded : !state.expanded,
    }))
  }

  #onArrowUp(e) {
    e.preventDefault()
    if(!this.state.expanded) {
      this.setState({ expanded : true })
    }
    this._listBox.shiftFocus(-1, e)
    this.focus()
  }

  #onArrowDown(e) {
    e.preventDefault()
    if(!this.state.expanded) {
      this.setState({ expanded : true })
    }
    this._listBox.shiftFocus(1, e)
    this.focus()
  }

  #onPointerDown(e) {
    if(!e.target.closest(TextBox)) {
      setTimeout(() => this.focus())
    }
  }

  #onKeyDown(e) {
    if(e.code === 'Enter') {
      this.#onEnter(e)
      return
    }
    if(e.code === 'Space') {
      this.#onSpace(e)
      return
    }
    if(e.code === 'ArrowUp') {
      this.#onArrowUp(e)
      return
    }
    if(e.code === 'ArrowDown') {
      this.#onArrowDown(e)
    }
  }
}
