import { Popup } from './Popup.js'
import { PopupContent } from './PopupContent.js'
import './ValidationAlert.css'

export class ValidationAlert extends Popup
{
  static class = 'ValidationAlert'

  static role = 'alert'

  render() {
    return new PopupContent(this.props.text)
  }
}
