import { CancelButton } from './CancelButton.js'
import './DialogCancelButton.css'

export class DialogCancelButton extends CancelButton
{
  static class = 'DialogCancelButton'

  static defaultProps = {
    tabIndex : -1,
  }
}
