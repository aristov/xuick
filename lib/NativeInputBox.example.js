import { Example } from './Example.js'
import { NativeInputBox } from './NativeInputBox.js'

class NativeInputBoxExample extends Example
{
  state = {
    value : '',
  }

  render() {
    return [
      new NativeInputBox({
        label : this.props.labelText,
        value : this.state.value,
        multiLine : this.props.multiLine,
        oninput : e => {
          this.setState({ value : e.target.value })
        },
      }),
    ]
  }
}

export default () => [
  new NativeInputBoxExample({
    labelText : 'NativeInputBox',
  }),
]
