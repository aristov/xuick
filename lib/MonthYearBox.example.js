import { DateTime } from 'luxon'
import { HtmlDiv } from 'htmlmodule'
import { Example } from '../index.js'
import { MonthYearBox } from './MonthYearBox.js'

class MonthYearBoxTest extends HtmlDiv
{
  static class = 'MonthYearBoxTest'

  state = {
    value : undefined,
  }

  render() {
    return new MonthYearBox({
      label : 'MonthYearBox',
      value : this.state.value ?? this.props.value,
      onchange : e => {
        console.warn(e.target.value)
        this.setState({ value : e.target.value })
      },
    })
  }
}

const dt = DateTime.now()

export default () => new Example({
  classList : 'flex',
  children : [
    new MonthYearBoxTest,
    new MonthYearBoxTest({
      value : dt.startOf('month').toISODate(),
    }),
  ],
})
