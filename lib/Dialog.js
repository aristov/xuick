import { Popup } from './Popup.js'
import './Dialog.css'

export class Dialog extends Popup
{
  static class = 'Dialog'

  static role = 'dialog'

  init() {
    super.init()
    this.on('keydown', this.#onKeyDown)
  }

  mount() {
    super.mount()
    if(this.props.open) {
      this.focus()
    }
  }

  update(prevProps, prevState) {
    super.update(prevProps, prevState)
    if(this.props.open && this.state.hidden && !prevProps.open) {
      this.focus()
    }
  }

  focus() {
    if(!this.props.open || !this.props.modal) {
      return
    }
    const node = this.node
    const autofocus = node.querySelector('[autofocus]')
    node.removeAttribute('tabindex')
    if(autofocus) {
      autofocus.focus()
      return
    }
    const nodes = this.#getTabSequence()
    if(nodes[0]) {
      nodes[0].focus()
      return
    }
    node.tabIndex = -1
    node.focus()
  }

  #getTabSequence(node = this.node) {
    const result = []
    for(const child of node.children) {
      if(getComputedStyle(child).display === 'none') {
        continue
      }
      if(child.isContentEditable && !child.hasAttribute('tabindex')) {
        result.push(child)
      }
      else if(child.tabIndex > -1) {
        if(child.disabled) {
          continue
        }
        if(child.tagName === 'INPUT' && child.type === 'hidden') {
          continue
        }
        if('href' in child && !child.href) {
          continue
        }
        result.push(child)
      }
      if(child.hasChildNodes()) {
        result.push(...this.#getTabSequence(child))
      }
    }
    return result
  }

  #onKeyDown(e) {
    if(e.code !== 'Tab' || !this.props.modal) {
      return
    }
    const nodes = this.#getTabSequence()
    if(!nodes.length) {
      e.preventDefault()
      return
    }
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if(e.shiftKey && e.nativeEvent.target === first) {
      e.preventDefault()
      last.focus()
    }
    else if(!e.shiftKey && e.nativeEvent.target === last) {
      e.preventDefault()
      first.focus()
    }
  }
}
