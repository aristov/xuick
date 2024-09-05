import { Button } from './Button.js'
import './PrevButton.css'

export class PrevButton extends Button
{
  static class = 'PrevButton'

  static defaultProps = {
    type : 'prev',
  }

  render() {
    return null
  }
}
