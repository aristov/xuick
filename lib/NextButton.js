import { Button } from './Button.js'
import './NextButton.css'

export class NextButton extends Button
{
  static class = 'NextButton'

  static defaultProps = {
    type : 'next',
  }

  render() {
    return null
  }
}
