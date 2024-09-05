import { ElemType, HtmlForm, RoleForm, RoleSearch, RoleType } from 'htmlmodule'
import './Widget.css'

export class Widget extends RoleType
{
  static class = 'Widget'

  static defaultProps = {
    tabIndex : 0,
  }

  state = {
    active : undefined,
  }

  name

  value

  init() {
    this.on('click', this.#onClick)
    this.on('blur', this.#onBlur)
    this.on('keydown', this.#onKeyDown)
    this.on('keyup', this.#onKeyUp)
  }

  assign() {
    if(this.props.disabled) {
      this.tabIndex = null
    }
    if(this.state.active) {
      this.classList = 'active'
    }
  }

  #onClick(e) {
    if(this.disabled) {
      e.stopImmediatePropagation()
    }
  }

  #onBlur() {
    if(this.state.active) {
      this.setState({ active : false })
    }
  }

  #onKeyDown(e) {
    const active = this.state.active
    if(e.code !== 'Space' || e.repeat || active !== false) {
      return
    }
    this.setState({ active : true })
  }

  #onKeyUp(e) {
    if(e.code === 'Space' && this.state.active) {
      this.setState({ active : false })
    }
  }

  get form() {
    return this.closest(ElemType, elem => {
      return Widget.formTypes.some(type => elem instanceof type)
    })
  }

  static formTypes = [HtmlForm, RoleForm, RoleSearch]
}
