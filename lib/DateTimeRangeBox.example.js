import { DateTime, Interval } from 'luxon'
import { HtmlDiv } from 'htmlmodule'
import { Example } from './Example.js'
import { DateTimeRangeBox } from './DateTimeRangeBox.js'

class DateTimeRangeBoxTest extends HtmlDiv
{
  static class = 'DateTimeRangeBoxTest'

  state = {
    value : null,
  }

  render() {
    const value = this.state.value
    return [
      new DateTimeRangeBox({
        label : this.props.labelText,
        value : value === null ? this.props.value : value,
        required : this.props.isRequired,
        onchange : e => {
          this.setState({ value : e.target.value })
        },
      }),
    ]
  }
}

const now = DateTime.now()

export default () => new Example({
  classList : 'flex',
  children : [
    new DateTimeRangeBoxTest({
      labelText : 'DateTimeRangeBox',
    }),
    new DateTimeRangeBoxTest({
      labelText : 'DateTimeRangeBox',
      value : Interval.fromDateTimes(now, now.plus({ days : 1 })).toISO(),
    }),
    new DateTimeRangeBoxTest({
      labelText : 'DateTimeRangeBox *',
      value : Interval.fromDateTimes(now, now.plus({ days : 1 })).toISO(),
      isRequired : true,
    }),
  ],
})
