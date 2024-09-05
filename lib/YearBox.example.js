import { HtmlDiv } from 'htmlmodule'
import { Example } from '../index.js'
import { YearBox } from './YearBox.js'

class YearBoxTest extends HtmlDiv
{
  static class = 'YearBoxTest'

  state = {
    value : undefined,
  }

  render() {
    return new YearBox({
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
    new YearBoxTest({
      labelText : 'YearBox',
    }),
    new YearBoxTest({
      labelText : 'YearBox',
      value : 1984,
    }),
    new YearBoxTest({
      labelText : 'YearBox',
      value : 1992,
    }),
  ],
})
