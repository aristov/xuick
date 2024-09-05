import { Example } from './Example.js'
import { DateBox } from './DateBox.js'
import { DateTime, Interval } from 'luxon'
import { HtmlDiv } from 'htmlmodule'

class DateBoxTest extends HtmlDiv
{
  static class = 'DateBoxTest'

  state = {
    value : null,
  }

  render() {
    const value = this.state.value
    return new DateBox({
      label : this.props.labelText,
      text : this.props.text,
      type : this.props.type,
      popup : this.props.popup,
      value : value === null ? this.props.value : value,
      onchange : e => {
        this.setState({ value : e.target.value })
      },
    })
  }
}

const start = DateTime.now()
const end = start.plus({ weeks : 1 })
const interval = Interval.fromDateTimes(start, end)

export default () => [
  new Example({
    classList : 'flex',
    children : [
      new DateBoxTest({
        labelText : 'DateBox',
      }),
      new DateBoxTest({
        labelText : 'DateBox',
        text : 'Select date',
      }),
      new DateBoxTest({
        labelText : 'DateBox',
        value : start.toISODate(),
      }),
      new DateBoxTest({
        labelText : 'DateBox modal',
        value : start.toISODate(),
        popup : { modal : true },
      }),
    ],
  }),
  new Example({
    classList : 'flex',
    children : [
      new DateBoxTest({
        labelText : 'DateBox range',
        type : 'range',
      }),
      new DateBoxTest({
        labelText : 'DateBox range',
        text : 'Select interval',
        type : 'range',
      }),
      new DateBoxTest({
        labelText : 'DateBox range',
        value : interval.toISODate(),
        type : 'range',
      }),
      new DateBoxTest({
        labelText : 'DateBox range modal',
        value : interval.toISODate(),
        popup : { modal : true },
        type : 'range',
      }),
    ],
  }),
]
