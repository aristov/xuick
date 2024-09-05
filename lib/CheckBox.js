import { CheckWidget } from './CheckWidget.js'
import { Control } from './Control.js'
import { Label } from './Label.js'
import './CheckBox.css'

export class CheckBox extends CheckWidget
{
  static class = 'CheckBox'

  static role = 'checkbox'

  render() {
    const label = this.props.label
    return [
      new CheckBoxControl,
      label && new CheckBoxLabel(label),
    ]
  }
}

export class CheckBoxControl extends Control
{
  static class = 'CheckBoxControl'
}

export class CheckBoxLabel extends Label
{
  static class = 'CheckBoxLabel'
}
