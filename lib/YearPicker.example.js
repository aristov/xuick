import { HtmlDiv } from 'htmlmodule'
import { Example } from '../index.js'
import { YearPicker } from './YearPicker.js'

class YearPickerTest extends HtmlDiv
{
  static class = 'YearPickerTest'

  state = {
    value : undefined,
  }

  render() {
    return new YearPicker({
      label : this.props.labelText,
      value : this.state.value ?? this.props.value,
      onchange : e => {
        this.setState({ value : e.target.value })
      },
    })
  }
}

export default () => new Example({
  classList : 'flex',
  children : [
    new YearPickerTest({
      labelText : 'YearPicker',
    }),
    new YearPickerTest({
      labelText : 'YearPicker',
      value : 1984,
    }),
  ],
})
