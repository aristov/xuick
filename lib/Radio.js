import { Context } from 'htmlmodule'
import { Widget } from './Widget.js'
import { Control } from './Control.js'
import { Label } from './Label.js'
import './Radio.css'

export const RadioContext = new Context

export class Radio extends Widget
{
  static class = 'Radio'

  static role = 'radio'

  static defaultProps = {
    tabIndex : null,
  }

  focused = false

  assign() {
    RadioContext.Consumer(props => {
      const checked = props.value !== undefined && props.value === this.props.value
      this.checked = checked
      if(props.value === undefined && !props.focus) {
        this.focused = props.focus = true
      }
      else this.focused = checked
      this.classList = this.focused && 'focus'
    })
  }

  render() {
    return this.props.children ?? [
      new RadioControl,
      this.props.label && new RadioLabel(this.props.label),
    ]
  }
}

export class RadioControl extends Control
{
  static class = 'RadioControl'
}

export class RadioLabel extends Label
{
  static class = 'RadioLabel'
}
