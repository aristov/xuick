import { Id } from 'htmlmodule'
import { Widget } from './Widget.js'
import { Popup } from './Popup.js'
import './ComboBox.css'

export class ComboBox extends Widget
{
  static class = 'ComboBox'

  static role = 'combobox'

  state = {
    ...this.state,
    active : false,
    hasPopup : true,
    expanded : false,
  }

  popupId

  init() {
    super.init()
    this.on('click', this.onClick)
    this.on('keydown', this.#onKeyDown)
    document.addEventListener('cancel', this.#onDocCancel, true)
  }

  assign() {
    super.assign()
    this.popupId ??= Id.generate()
    this.controls = this.popupId
    this.expanded = this.state.expanded
    if(this.props.value === undefined) {
      this.classList = 'blank'
    }
  }

  /**
   * @param {EventType} e
   * @protected
   */
  onClick(e) {
    if(!e.isTrusted) {
      return
    }
    if(this.find(Popup).contains(e.target)) {
      return
    }
    this.setState(state => ({
      expanded : !state.expanded,
    }))
  }

  #onDocCancel = e => {
    if(!this.expanded) {
      return
    }
    const popup = this.find(Popup)
    if(e.target === popup.node) {
      this.setState({ expanded : false })
    }
  }

  #onKeyDown(e) {
    if(e.code === 'Space') {
      e.preventDefault()
      return
    }
    if(e.code === 'Enter') {
      e.stopPropagation()
      this.setState(state => ({
        expanded : !state.expanded,
      }))
      return
    }
    if(e.code === 'Escape') {
      if(!this.expanded) {
        return
      }
      e.stopPropagation()
      this.setState({ expanded : false })
    }
  }
}
