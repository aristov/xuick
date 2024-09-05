import { Popup } from './Popup.js'
import './ToolTip.css'

export class ToolTip extends Popup
{
  static class = 'ToolTip'

  static role = 'tooltip'

  static defaultProps = {
    float : true,
    direction : 'bottom-center-right',
  }
}
