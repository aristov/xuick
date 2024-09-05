import { RoleType } from 'htmlmodule'
import { PopupContent } from './PopupContent.js'
import './Popup.css'

const OPEN_TIMEOUT_DELAY = 10
const UPDATE_POSITION_DEBOUNCE = 200
const UPDATE_POSITION_INTERVAL = 1000
const VERTICAL_DIRECTION_RE = /^(top|bottom)-/

export class Popup extends RoleType
{
  static class = 'Popup'

  static defaultProps = {
    open : false,
  }

  state = {
    hidden : true,
    direction : undefined,
  }

  cancelEvent = new Event('cancel', {
    cancelable : true,
  })

  #anchor = null
  #top = null
  #left = null
  #closeTimer = null
  #positionTimer = null

  init() {
    this.#anchor = this.props.anchor
    this.on('keydown', this.#onKeyDown)
    this.on('transitionend', this.#onTransitionEnd)
    if(!this.props.open) {
      return
    }
    if(!this.props.modal) {
      this.#updatePositionTick()
    }
    this.state.hidden = false
    this.#setHandlers()
  }

  assign() {
    const { props, state } = this
    if(!props.open && state.hidden) {
      return this.parent = null
    }
    if(props.modal) {
      this.dataset = {
        direction : props.direction,
      }
      this.parent = document.body
    }
    this.hidden = props.open && !state.hidden ?
      null :
      !props.open
  }

  render() {
    const props = this.props
    return props.content ?
      new PopupContent(props.content) :
      super.render()
  }

  update(prevProps, prevState) {
    this.#updateAnchor()
    if(this.state.hidden) {
      if(this.props.open) {
        this.#open()
      }
      return
    }
    if(this.props.open) {
      if(!this.props.modal) {
        this.#updatePositionTick()
      }
      return
    }
    const duration = this.getMaxTransitionDuration()
    this.#closeTimer = setTimeout(() => this.#close(), duration)
    this.#clearHandlers()
    if(this.props.modal || this.node.contains(document.activeElement)) {
      this.#anchor?.focus()
    }
  }

  destroy() {
    clearTimeout(this.#closeTimer)
    this.#closeTimer = null
    this.#clearHandlers()
  }

  close() {
    this.emit('close')
  }

  cancel(e) {
    this.cancelEvent = e
    this.emit('cancel')
  }

  #open() {
    if(!this.props.modal) {
      this.#updatePositionTick()
    }
    const open = () => {
      this.setState({ hidden : false })
      this.#setHandlers()
    }
    setTimeout(open, OPEN_TIMEOUT_DELAY)
  }

  #close() {
    const style = this.node.style
    if(!this.state.hidden) {
      this.setState({ hidden : true })
    }
    this.#top = style.top = null
    this.#left = style.left = null
    clearTimeout(this.#closeTimer)
    this.#closeTimer = null
  }

  #updateAnchor() {
    const anchorA = this.#anchor
    const anchorB = this.props.anchor || null
    if(anchorA?.constructor === anchorB?.constructor) {
      if(anchorA?.props.key === anchorB?.props.key) {
        return
      }
    }
    this.#anchor = anchorB
  }

  #updatePositionTick = (debounce = null) => {
    clearTimeout(this.#positionTimer)
    this.#positionTimer = setTimeout(
      this.#updatePositionTick,
      debounce || UPDATE_POSITION_INTERVAL,
    )
    if(!debounce) {
      this.#updatePosition()
    }
  }

  #updatePosition() {
    const props = this.props
    const anchor = this.#anchor
    if(!props.open || !anchor?.node) {
      return
    }
    const style = this.node.style
    let direction = props.direction || 'bottom-right'
    style.transition = null
    if(direction === 'none') {
      this.#top = style.top = null
      this.#left = style.left = null
      this.node.dataset.direction = 'none'
      return
    }
    const main = Popup.#directions[direction]
    const rectA = anchor.node.getBoundingClientRect()
    let rectP = this.node.getBoundingClientRect()
    let position, alternative
    if(props.width === 'anchor') {
      style.width = rectA.width + 'px'
    }
    else style.width = null
    if(props.height === 'auto' && VERTICAL_DIRECTION_RE.test(direction)) {
      const maxHeight = Math.max(rectA.top, innerHeight - rectA.bottom)
      style.maxHeight = maxHeight - 1 + 'px'
      rectP = this.node.getBoundingClientRect()
    }
    else style.maxHeight = null
    if(!props.float || main.condition(rectA, rectP)) {
      position = main.position(rectA, rectP)
    }
    else for(direction of main.alternatives) {
      alternative = Popup.#directions[direction]
      if(alternative.condition(rectA, rectP)) {
        position = alternative.position(rectA, rectP)
        break
      }
    }
    let [top, left] = position || main.fallback(rectP)
    left = Math.max(left, 0)
    left = Math.min(left, innerWidth - rectP.width)
    style.top = top + 'px'
    style.left = left + 'px'
    this.#top = rectA.top
    this.#left = rectA.left
    this.node.dataset.direction = direction
  }

  #onKeyDown(e) {
    if(e.code !== 'Escape' || !this.props.open) {
      return
    }
    e.stopPropagation()
    this.cancel(e.nativeEvent)
  }

  #onTransitionEnd() {
    if(!this.props.open && !this.state.hidden) {
      this.#close()
    }
  }

  #setHandlers() {
    document.addEventListener('click', this.#onDocClick)
    document.addEventListener('focusin', this.#onDocFocusIn)
    document.addEventListener('keydown', this.#onDocKeyDown, true)
    if(this.props.modal) {
      return
    }
    document.addEventListener('scroll', this.#onDocScroll, true)
    window.addEventListener('resize', this.#onWinResize)
  }

  #clearHandlers() {
    document.removeEventListener('click', this.#onDocClick)
    document.removeEventListener('focusin', this.#onDocFocusIn)
    document.removeEventListener('keydown', this.#onDocKeyDown, true)
    if(this.props.modal) {
      return
    }
    document.removeEventListener('scroll', this.#onDocScroll, true)
    window.removeEventListener('resize', this.#onWinResize)
    clearTimeout(this.#positionTimer)
    this.#positionTimer = null
  }

  #onDocClick = e => {
    if(!this.props.open) {
      return
    }
    if(!document.contains(e.target)) {
      return
    }
    if(e.target !== this.node && this.node.contains(e.target)) {
      return
    }
    if(this.#anchor?.node.contains(e.target)) {
      return
    }
    const popup = e.target.closest('.Popup[aria-modal=true]')
    if(popup && !popup.contains(this.node)) {
      return
    }
    this.cancel(e)
  }

  #onDocFocusIn = e => {
    if(!this.props.open) {
      return
    }
    if(this.node.contains(e.target) || this.#anchor?.node.contains(e.target)) {
      return
    }
    const popup = e.target.closest('.Popup[aria-modal=true]')
    if(popup && !popup.contains(this.node)) {
      return
    }
    this.cancel(e)
  }

  #onDocKeyDown = e => {
    if(!this.props.open || e.code !== 'Escape') {
      return
    }
    if(e.target === document.body || this.#anchor?.node.contains(e.target)) {
      e.stopPropagation()
      this.cancel(e)
    }
  }

  #onDocScroll = async e => {
    if(!this.props.open || !this.#anchor || this.props.direction === 'none') {
      return
    }
    if(!e.target.contains(this.node)) {
      return
    }
    await new Promise(requestAnimationFrame)
    const rectA = this.#anchor.node.getBoundingClientRect()
    const rectP = this.node.getBoundingClientRect()
    const style = this.node.style
    style.transition = 'none'
    style.top = rectA.top + rectP.top - this.#top + 'px'
    style.left = rectA.left + rectP.left - this.#left + 'px'
    this.#top = rectA.top
    this.#left = rectA.left
    this.#updatePositionTick(UPDATE_POSITION_DEBOUNCE)
  }

  #onWinResize = () => {
    if(!this.props.open || !this.#anchor) {
      return
    }
    this.#updatePositionTick(UPDATE_POSITION_DEBOUNCE)
  }

  getMaxTransitionDuration() {
    const style = getComputedStyle(this.node)
    const items = style.transitionDuration.split(', ')
    const durations = items.map(duration => {
      return parseFloat(duration) * 1000
    })
    return Math.max(...durations)
  }

  static #directions = {
    'top-left' : {
      condition : (anchor, popup) => {
        return anchor.top - popup.height >= 0
      },
      position : (anchor, popup) => {
        return [anchor.top - popup.height, anchor.right - popup.width]
      },
      fallback : () => [0, 0],
      alternatives : [
        'top-right',
        'bottom-left',
        'bottom-right',
      ],
    },
    'top-right' : {
      condition : (anchor, popup) => {
        return anchor.top - popup.height >= 0
      },
      position : (anchor, popup) => {
        return [anchor.top - popup.height, anchor.left]
      },
      fallback : (popup) => [0, innerWidth - popup.width],
      alternatives : [
        'top-left',
        'bottom-right',
        'bottom-left',
      ],
    },
    'right-top' : {
      condition : (anchor, popup) => {
        return anchor.bottom - popup.height >= 0
      },
      position : (anchor, popup) => {
        return [anchor.bottom - popup.height, anchor.right]
      },
      fallback : (popup) => [0, innerWidth - popup.width],
      alternatives : [
        'right-bottom',
        'left-top',
        'left-bottom',
      ],
    },
    'right-bottom' : {
      condition : (anchor, popup) => {
        return anchor.top + popup.height <= innerHeight
      },
      position : (anchor) => {
        return [anchor.top, anchor.right]
      },
      fallback : (popup) => [
        innerHeight - popup.height,
        innerWidth - popup.width,
      ],
      alternatives : [
        'right-top',
        'left-bottom',
        'left-top',
      ],
    },
    'bottom-right' : {
      condition : (anchor, popup) => {
        return anchor.bottom + popup.height <= innerHeight
      },
      position : (anchor) => {
        return [anchor.bottom, anchor.left]
      },
      fallback : (popup) => [
        innerHeight - popup.height,
        innerWidth - popup.width,
      ],
      alternatives : [
        'bottom-left',
        'top-right',
        'top-left',
      ],
    },
    'bottom-center-right' : {
      condition : (anchor, popup) => {
        return anchor.left + anchor.width / 2 + popup.width <= innerWidth
      },
      position : (anchor) => {
        return [anchor.bottom, anchor.left + anchor.width / 2]
      },
      fallback : (popup) => [
        innerHeight - popup.height,
        innerWidth - popup.width,
      ],
      alternatives : [
        'bottom-center-left',
      ],
    },
    'bottom-left' : {
      condition : (anchor, popup) => {
        return anchor.bottom + popup.height <= innerHeight
      },
      position : (anchor, popup) => {
        return [anchor.bottom, anchor.right - popup.width]
      },
      fallback : (popup) => [innerHeight - popup.height, 0],
      alternatives : [
        'bottom-right',
        'top-left',
        'top-right',
      ],
    },
    'bottom-center-left' : {
      condition : (anchor, popup) => {
        return anchor.right - anchor.width / 2 - popup.width >= 0
      },
      position : (anchor, popup) => {
        return [anchor.bottom, anchor.right - anchor.width / 2 - popup.width]
      },
      fallback : (popup) => [innerHeight - popup.height, 0],
      alternatives : [
        'bottom-center-right',
      ],
    },
    'left-bottom' : {
      condition : (anchor, popup) => {
        return anchor.top + popup.height <= innerHeight
      },
      position : (anchor, popup) => {
        return [anchor.top, anchor.left - popup.width]
      },
      fallback : (popup) => [innerHeight - popup.height, 0],
      alternatives : [
        'left-top',
        'right-bottom',
        'right-top',
      ],
    },
    'left-top' : {
      condition : (anchor, popup) => {
        return anchor.bottom - popup.height >= 0
      },
      position : (anchor, popup) => {
        return [anchor.bottom - popup.height, anchor.left - popup.width]
      },
      fallback : () => [0, 0],
      alternatives : [
        'left-bottom',
        'right-top',
        'right-bottom',
      ],
    },
  }
}

export { PopupContent }
