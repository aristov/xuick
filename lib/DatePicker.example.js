import { Example } from './Example.js'
import { DatePicker } from './DatePicker.js'
import { Interval, DateTime } from 'luxon'

class DatePickerExample extends Example
{
  state = {
    value : null,
  }

  render() {
    const { props, state } = this
    return new DatePicker({
      label : props.labelText,
      type : props.type,
      duration : props.duration,
      required : props.isRequired,
      disabled : props.isDisabled,
      value : state.value === null ? props.value : state.value,
      onchange : e => {
        console.log(e.target.value)
        this.setState({ value : e.target.value })
      },
    })
  }
}

const start = DateTime.now()
const end = start.plus({ weeks : 1 })
const interval = Interval.fromDateTimes(start, end)

export default () => [
  new DatePickerExample({
    labelText : 'DatePicker',
  }),
  new DatePickerExample({
    labelText : 'DatePicker',
    value : start.toISODate(),
  }),
  new DatePickerExample({
    labelText : 'DatePicker range',
    type : 'range',
  }),
  new DatePickerExample({
    labelText : 'DatePicker range',
    type : 'range',
    value : interval.toISODate(),
  }),
  new DatePickerExample({
    labelText : 'DatePicker range disabled',
    type : 'range',
    isDisabled : true,
    value : interval.toISODate(),
  }),
  new DatePickerExample({
    labelText : 'DatePicker duration',
    type : 'range',
    duration : 'P7D',
  }),
  new DatePickerExample({
    labelText : 'DatePicker duration required',
    type : 'range',
    duration : 'P7D',
    isRequired : true,
  }),
  new DatePickerExample({
    labelText : 'DatePicker duration required',
    type : 'range',
    duration : 'P5D',
    isRequired : true,
    value : '2023-01-10/2023-01-14',
  }),
]
