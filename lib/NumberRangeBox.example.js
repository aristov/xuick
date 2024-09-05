import { HtmlDiv } from 'htmlmodule'
import { Example } from './Example.js'
import { NumberRangeBox } from './NumberRangeBox.js'

class NumberRangeBoxTest extends HtmlDiv
{
  static class = 'NumberRangeBoxTest'

  state = {
    value : null,
  }

  render() {
    const value = this.state.value
    return [
      new NumberRangeBox({
        label : this.props.labelText,
        value : value === null ? this.props.value : value,
        required : this.props.isRequired,
        onchange : e => {
          this.setState({ value : e.target.value })
          console.log(e.target.value)
        },
      }),
    ]
  }
}

export default () => new Example({
  classList : 'flex',
  children : [
    new NumberRangeBoxTest({
      labelText : 'NumberRangeBox',
    }),
    new NumberRangeBoxTest({
      labelText : 'NumberRangeBox',
      value : [-1, 1],
    }),
    new NumberRangeBoxTest({
      labelText : 'NumberRangeBox *',
      value : [0, 50],
      isRequired : true,
    }),
  ],
})
