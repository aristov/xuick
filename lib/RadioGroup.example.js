import { Example } from './Example.js'
import { RadioGroup } from './RadioGroup.js'
import { Radio } from './Radio.js'

class RadioGroupExample extends Example
{
  state = {
    value : undefined,
  }

  render() {
    return new RadioGroup({
      label : 'RadioGroup',
      value : this.state.value,
      onchange : e => {
        this.setState({ value : e.target.value })
      },
      children : [
        new Radio({
          label : 'Радио 1',
          value : '1',
        }),
        new Radio({
          label : 'Радио 2',
          value : '2',
        }),
        new Radio({
          label : 'Радио 3',
          value : '3',
        }),
      ],
    })
  }
}

export default () => new RadioGroupExample
