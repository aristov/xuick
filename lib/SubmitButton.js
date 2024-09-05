import { Button } from './Button.js'

export class SubmitButton extends Button
{
  static class = 'SubmitButton'

  static defaultProps = {
    type : 'submit',
  }
}
