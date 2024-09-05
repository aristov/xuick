import { AttrType } from 'htmlmodule'
import { Command } from './Command.js'
import { Control } from './Control.js'
import { Icon } from './Icon.js'
import { Label } from './Label.js'
import { Popup } from './Popup.js'
import './Button.css'

export class Button extends Command
{
  static class = 'Button'

  static role = 'button'

  static props = {
    type : AttrType.define('type'),
  }

  state = {
    ...this.state,
    active : false,
  }

  init() {
    super.init()
    this.on('click', this.#onClick)
    this.on('keyup', this.#onKeyUp)
  }

  assign() {
    super.assign()
    const props = this.props
    if(props.hasOwnProperty('pressed')) {
      this.value = props.pressed
    }
    if(props.icon) {
      this.classList = ['icon', props.icon]
    }
  }

  render() {
    const props = this.props
    return [
      props.icon || props.label ?
        new ButtonControl([
          props.icon && new Icon(props.icon),
          props.label && new ButtonLabel(props.label),
        ]) :
        props.content ?? props.children,
      props.menu && this.renderMenu(),
      props.dialog && this.renderDialog(),
    ]
  }

  #onClick(e) {
    if(this.props.pressed !== undefined) {
      this.value = !this.value
      this.emit('change')
      return
    }
    if(this.type === 'submit') {
      this.form?.emit('submit', { submitter : this.node })
      return
    }
    if(this.type === 'cancel') {
      this.closest(Popup)?.cancel(e.nativeEvent)
    }
  }

  #onKeyUp(e) {
    if(e.code === 'Space') {
      this.click()
    }
  }
}

export class ButtonLabel extends Label
{
  static class = 'ButtonLabel'
}

export class ButtonControl extends Control
{
  static class = 'ButtonControl'
}
