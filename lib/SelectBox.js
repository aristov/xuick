import { Class } from 'htmlmodule'
import { ComboBox } from './ComboBox.js'
import { Label } from './Label.js'
import { Control } from './Control.js'
import { Inner } from './Inner.js'
import { Popup, PopupContent } from './Popup.js'
import { ListBox } from './ListBox.js'
import './SelectBox.css'

export class SelectBox extends ComboBox
{
  static class = 'SelectBox'

  static props = {
    orientation : 'vertical',
  }

  static defaultProps = {
    hasPopup : 'listbox',
    listBox : props => new ListBox(props),
  }

  state = {
    ...this.state,
    hasPopup : 'listbox',
    value : undefined,
  }

  popupId = undefined

  init() {
    this.on('change', this.#onChange)
    this.on('keydown', this.#onKeyDown)
    this.on('keyup', this.#onKeyUp)
    super.init()
  }

  render() {
    const { props, state } = this
    let value
    if(this.props.checkable) {
      // fixme
      value = state.value === undefined ?
        state.expanded ? undefined : props.value :
        state.value
    }
    else {
      value = state.value === undefined ?
        props.value :
        state.value
    }
    const options = this.renderOptions()
    let text
    if(props.multiSelectable) {
      const texts = options.flatMap(opt => {
        return value?.includes(opt.props.value) ?
          opt.props.text || opt.props.children :
          []
      })
      text = texts.join(', ')
    }
    else {
      const option = options.find(opt => {
        return opt.props.value === value
      })
      text = option?.props.text || option?.props.children
    }
    return [
      props.label && new SelectBoxLabel({
        key : 'label',
        children : props.label,
      }),
      new SelectBoxControl({
        key : 'control',
        children : new Inner(text || props.text || ' '),
      }),
      new SelectBoxPopup({
        key : 'popup',
        anchor : this,
        open : state.expanded,
        children : this._listBox = props.listBox({
          value,
          id : this.popupId,
          classList : Class.generate(PopupContent),
          tabIndex : null,
          multiSelectable : props.multiSelectable,
          checkable : props.checkable,
          required : props.required,
          options,
        }),
        ...props.popup,
      }),
    ]
  }

  renderOptions() {
    return this.props.options || []
  }

  update(prevProps, prevState) {
    super.update()
    const state = this.state
    if(state.expanded && !prevState.expanded) {
      this._listBox.scrollToOption()
      return
    }
    if(state.expanded || !prevState.expanded) {
      return
    }
    if(this.multiSelectable) {
      if(this.value?.join() === state.value?.join()) {
        return
      }
    }
    else if(this.value === state.value) {
      return
    }
    this.value = state.value
    this.state.value = undefined
    this.emit('change')
  }

  /**
   * @param {EventType} e
   * @protected
   */
  onClick(e) {
    if(this.props.checkable || this.multiSelectable) {
      if(e.target.closest(ListBox)) {
        return
      }
    }
    this.setState(state => ({
      expanded : !state.expanded,
    }))
  }

  #onChange(e) {
    const target = e.target
    if(target === this) {
      return
    }
    e.preventDefault()
    e.stopImmediatePropagation()
    if(!this.expanded) {
      this.value = target.value
      this.emit('change')
      return
    }
    this.setState({
      value : target.value,
    })
  }

  #onKeyDown(e) {
    if(e.code === 'KeyA') {
      if(e.metaKey || e.ctrlKey) {
        e.preventDefault()
        if(this.expanded) {
          this._listBox.selectAllOptions()
        }
      }
      return
    }
    const offset = ListBox.offsets[this.orientation][e.code]
    if(!offset) {
      return
    }
    e.preventDefault()
    if(!this.expanded) {
      this.setState({ expanded : true })
    }
    this._listBox.shiftFocus(offset, e)
  }

  #onKeyUp(e) {
    if(e.code.startsWith('Shift')) {
      if(this.expanded && !this.props.checkable) {
        this._listBox.updateValue()
      }
    }
    if(e.code === 'Space') {
      if(this.expanded && this.props.checkable) {
        this._listBox.updateValue()
      }
      else this.click()
    }
  }
}

export class SelectBoxLabel extends Label
{
  static class = 'SelectBoxLabel'
}

export class SelectBoxControl extends Control
{
  static class = 'SelectBoxControl'
}

export class SelectBoxPopup extends Popup
{
  static class = 'SelectBoxPopup'
}
