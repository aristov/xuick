import { Example } from './Example.js'
import { TextBox } from './TextBox.js'
import { ValidationAlert } from './ValidationAlert.js'

class ValidationAlertExample extends Example
{
  state = {
    value : '',
    invalid : true,
  }

  render() {
    const state = this.state
    return [
      this._textBox = new TextBox({
        label : 'Name',
        invalid : state.invalid,
        value : state.value,
        oninput : e => {
          const target = e.target
          this.setState({
            value : target.value,
            invalid : !target.value.trim(),
          })
        },
      }),
      new ValidationAlert({
        anchor : this._textBox,
        open : state.invalid,
        text : 'You must enter your name',
        oncancel : () => {
          this.setState({ invalid : false })
        },
      }),
    ]
  }
}

export default () => new ValidationAlertExample
