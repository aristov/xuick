import { TokenType } from 'htmlmodule'
import { Widget } from './Widget.js'
import { Control } from './Control.js'
import { Label } from './Label.js'
import { Option, OptionContext } from './Option.js'
import './ListBox.css'

export class ListBox extends Widget
{
  static class = 'ListBox'

  static role = 'listbox'

  static props = {
    orientation : TokenType.define('aria-orientation', 'vertical'),
  }

  static offsets = {
    vertical : {
      ArrowUp : -1,
      ArrowDown : 1,
    },
    horizontal : {
      ArrowLeft : -1,
      ArrowRight : 1,
    },
  }

  state = {
    ...this.state,
    selection : [],
  }

  #selecting = false

  #pointer = false

  init() {
    super.init()
    this.on('pointerdown', this.#onPointerDown)
    this.on('pointerover', this.#onPointerOver)
    this.on('click', this.#onClick)
    this.on('focus', this.#onFocus)
    this.on('keydown', this.#onKeyDown)
    this.on('keyup', this.#onKeyUp)
  }

  render() {
    const props = this.props
    const selection = this.state.selection
    this.activeDescendant = selection.at(-1)?.id
    return [
      props.label && new ListBoxLabel({
        key : 'label',
        children : props.label,
      }),
      this._control = new ListBoxControl({
        key : 'control',
        children : OptionContext.Provider({
          value : props.value,
          selection : this.#selecting || props.checkable ? selection : null,
          checkable : props.checkable,
          multiSelectable : props.multiSelectable,
          children : this.renderOptions(),
        }),
      }),
    ]
  }

  renderOptions() {
    return this.props.options
  }

  mount() {
    super.mount()
    if(this.tabIndex === null) {
      this.#setSelection()
    }
  }

  scrollToOption(option, behavior = 'auto') {
    option ??= this.find(Option, item => item.selected)
    if(!option) {
      return
    }
    const node = this._control.node
    const clientHeight = node.clientHeight
    if(node.scrollHeight === clientHeight) {
      return
    }
    const rectC = node.getBoundingClientRect()
    const rectO = option.node.getBoundingClientRect()
    if(rectO.bottom + rectO.height < rectC.bottom) {
      if(rectO.top - rectO.height > rectC.top) {
        return
      }
    }
    node.scrollTo({
      top : option.node.offsetTop + rectO.height / 2 - clientHeight / 2,
      behavior,
    })
  }

  shiftFocus(offset, e) {
    if(!offset) {
      return
    }
    e.preventDefault()
    const options = this.findAll(Option, item => !item.disabled)
    const selection = this.state.selection.filter(option => {
      return options.find(item => item === option)
    })
    const active = selection.at(-1)
    const indexA = active ? options.indexOf(active) : -(offset > 0)
    const indexB = indexA + offset
    const option = active ? options[indexB] : options.at(indexB)
    if(!option) {
      return
    }
    this.#selecting = true
    if(e.shiftKey && this.multiSelectable) {
      this.#updateSelection(option, options)
    }
    else this.setState({ selection : [option] })
    if(!e.shiftKey) {
      this.#selecting = false
      if(!this.props.checkable) {
        this.updateValue()
      }
    }
    this.scrollToOption(null, e.repeat ? 'auto' : 'smooth')
  }

  selectAllOptions() {
    if(!this.multiSelectable) {
      return
    }
    this.#selecting = true
    this.setState({
      selection : this.findAll(Option),
    })
    this.#selecting = false
    if(!this.props.checkable) {
      this.updateValue()
    }
  }

  updateValue() {
    if(!this.multiSelectable) {
      const option = this.find(Option, item => item.selected)
      const value = option?.value
      if(value !== this.value) {
        this.value = value
        this.emit('change')
        return
      }
      if(this.props.checkable && !this.required) {
        this.value = undefined
        this.emit('change')
      }
      return
    }
    const filter = this.props.checkable ?
      item => (item.selected && !item.checked) || (!item.selected && item.checked) :
      item => item.selected
    const options = this.findAll(Option, filter)
    const value = options.map(item => item.value)
    if(!value.length && this.required) {
      return
    }
    if(value.join() !== this.value?.join()) {
      this.value = value
      this.emit('change')
    }
  }

  #setSelection() {
    if(this.props.checkable || this.value === undefined) {
      return
    }
    const { multiSelectable, value } = this
    const selection = this.findAll(Option, option => (
      multiSelectable ?
        value.includes(option.value) :
        option.value === value
    ))
    this.setState({ selection })
  }

  #updateSelection(
    option,
    options = this.findAll(Option, item => !item.disabled),
  ) {
    const anchor = this.state.selection[0] || options.find(item => item.selected) || option
    const indexA = options.indexOf(anchor)
    const indexB = options.indexOf(option)
    const [min, max] = [indexA, indexB].sort((a, b) => a - b)
    const set = new Set([anchor])
    let i
    if(indexA < indexB) {
      for(i = 0; i < options.length; i++) {
        i >= min && i <= max && set.add(options[i])
      }
    }
    else {
      for(i = options.length - 1; i >= 0; i--) {
        i >= min && i <= max && set.add(options[i])
      }
    }
    this.setState({
      selection : Array.from(set),
    })
  }

  #onFocus() {
    if(this.#pointer) {
      this.#pointer = false
      return
    }
    this.#setSelection()
  }

  #onPointerDown(e) {
    if(e.pointerType === 'touch') {
      return
    }
    const option = e.target.closest(Option)
    if(!option || option.disabled) {
      return
    }
    this.#pointer = true
    this.#selecting = true
    if(e.shiftKey && this.multiSelectable) {
      this.#updateSelection(option)
    }
    else this.setState({ selection : [option] })
    document.addEventListener('pointerup', this.#onDocPointerUp, {
      once : true,
    })
  }

  #onPointerOver(e) {
    if(e.pointerType === 'touch' || e.buttons !== 1) {
      return
    }
    const option = e.target.closest(Option)
    if(!option) {
      return
    }
    if(this.multiSelectable) {
      this.#updateSelection(option)
    }
    else this.setState({ selection : [option] })
  }

  #onDocPointerUp = () => {
    this.#selecting = false
    this.updateValue()
  }

  #onClick(e) {
    if(e.pointerType === 'mouse') {
      return
    }
    const option = e.target.closest(Option)
    if(!option || option.disabled) {
      return
    }
    this.#selecting = true
    if(this.multiSelectable && !this.props.checkable) {
      this.setState(state => ({
        selection : option.selected ?
          state.selection.filter(item => item !== option) :
          [...state.selection, option],
      }))
    }
    else this.setState({ selection : [option] })
    this.#selecting = false
    this.updateValue()
  }

  #onKeyDown(e) {
    if(e.code === 'Space') {
      e.preventDefault()
      return
    }
    if(e.code === 'KeyA') {
      if(e.metaKey || e.ctrlKey) {
        e.preventDefault()
        this.selectAllOptions()
      }
      return
    }
    const offset = ListBox.offsets[this.orientation][e.code]
    if(offset) {
      this.shiftFocus(offset, e)
    }
  }

  #onKeyUp(e) {
    if(e.code === 'Space') {
      if(this.props.checkable && this.state.selection.length) {
        this.updateValue()
      }
      return
    }
    if(e.code === 'Shift') {
      this.#selecting = false
      if(!this.props.checkable) {
        this.updateValue()
      }
    }
  }
}

class ListBoxLabel extends Label
{
  static class = 'ListBoxLabel'
}

class ListBoxControl extends Control
{
  static class = 'ListBoxControl'
}
