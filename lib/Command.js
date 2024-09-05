import { Id, AttrType } from 'htmlmodule'
import { Widget } from './Widget.js'
import { Dialog } from './Dialog.js'
import { Popup } from './Popup.js'
import { Menu } from './Menu.js'
import { App } from './App.js'
import './Command.css'

export class Command extends Widget
{
  static class = 'Command'

  static props = {
    href : AttrType.define('href'),
    target : AttrType.define('target'),
  }

  static defaultProps = {
    search : '',
  }

  constructor(props) {
    if(!props?.to) {
      super(props)
      return
    }
    super({
      tagName : 'a',
      role : null,
      ...props,
    })
  }

  state = {
    ...this.state,
    expanded : false,
  }

  popupId

  init() {
    super.init()
    this.on('keydown', this.#onKeyDown)
    this.on('click', this.#onClick)
  }

  assign() {
    super.assign()
    const { props, state } = this
    if(props.to) {
      const url = typeof props.to === 'string' ?
        new URL(props.to, location.origin) :
        Object.assign(new URL(location), props.to)
      const pathname = decodeURIComponent(location.pathname)
      if(props.nav ? !pathname.startsWith(props.to) : props.to !== pathname) {
        this.href = url.href
      }
      return
    }
    if(props.menu) {
      this.hasPopup = 'menu'
      this.controls = this.popupId ??= Id.generate()
      this.expanded = state.expanded
      return
    }
    if(props.dialog) {
      this.hasPopup = 'dialog'
      this.controls = this.popupId ??= Id.generate()
      this.expanded = state.expanded
    }
  }

  render() {
    const props = this.props
    return [
      super.render(),
      props.menu && this.renderMenu(),
      props.dialog && this.renderDialog(),
    ]
  }

  renderMenu() {
    const props = this.props
    const menu = Menu.isPrototypeOf(props.menu) ?
      menuProps => new props.menu(menuProps) :
      props.menu
    return new Popup({
      anchor : this,
      open : this.state.expanded,
      content : menu({
        id : this.popupId,
      }),
      oncancel : () => {
        this.setState({ expanded : false })
      },
      onclose : () => {
        this.setState({ expanded : false })
      },
      ...props.popup,
    })
  }

  renderDialog() {
    const props = this.props
    const dialog = Dialog.isPrototypeOf(props.dialog) ?
      dialogProps => new props.dialog(dialogProps) :
      props.dialog
    return dialog({
      id : this.popupId,
      anchor : this,
      open : this.state.expanded,
      oncancel : () => {
        this.setState({ expanded : false })
      },
      onclose : () => {
        this.setState({ expanded : false })
      },
      ...props.popup,
    })
  }

  #onClick(e) {
    const props = this.props
    if(props.dialog || props.menu) {
      if(this.find(Popup).contains(e.target)) {
        return
      }
      this.setState(state => ({
        expanded : !state.expanded,
      }))
      return
    }
    if(e.metaKey || e.ctrlKey) {
      return
    }
    if(!props.to) {
      return
    }
    const node = this.node
    if(!node.href || node.target === '_blank' || node.origin !== location.origin) {
      return
    }
    const app = this.closest(App)
    if(!app) {
      return
    }
    e.preventDefault()
    app.navigate(props.to || node.href, {
      data : props.data,
    })
  }

  #onKeyDown(e) {
    if(e.code === 'Space') {
      e.preventDefault()
    }
  }
}
