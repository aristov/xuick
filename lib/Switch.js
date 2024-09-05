import { CheckWidget } from './CheckWidget.js'
import { Control } from './Control.js'
import { Label } from './Label.js'
import './Switch.css'

export class Switch extends CheckWidget
{
  static class = 'Switch'

  static role = 'switch'

  render() {
    const label = this.props.label
    return [
      new SwitchControl,
      label && new SwitchLabel(label),
    ]
  }
}

export class SwitchControl extends Control
{
  static class = 'SwitchControl'
}

export class SwitchLabel extends Label
{
  static class = 'SwitchLabel'
}
