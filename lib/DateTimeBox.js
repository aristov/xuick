import { DateTime } from 'luxon'
import { Complex } from './Complex.js'
import { Label } from './Label.js'
import { Control } from './Control.js'
import { DateBox } from './DateBox.js'
import { TimeBox } from './TimeBox.js'
import { ClearButton } from './ClearButton.js'
import './DateTimeBox.css'

export class DateTimeBox extends Complex
{
  static class = 'DateTimeBox'

  state = {
    date : undefined,
    time : undefined,
  }

  init() {
    super.init()
    this.on('click', this.onClick)
    this.on('change', this.onChange)
  }

  render() {
    const props = this.props
    const dt = this.value && DateTime.fromISO(this.value)
    if(!this.value) {
      this.classList = 'blank'
    }
    return [
      props.label && new Label({
        key : 'label',
        children : props.label,
      }),
      new Control({
        key : 'control',
        children : [
          this._dateBox = new DateBox({
            text : '____',
            value : dt?.toISODate() || this.state.date,
            format : DateTime.DATE_SHORT,
            required : props.required,
          }),
          this._timeBox = new TimeBox({
            value : dt?.toFormat('HH:mm') || this.state.time,
          }),
          props.required || new ClearButton({
            disabled : !this.value,
            tabIndex : -1,
          }),
        ],
      }),
    ]
  }

  update(prevProps, prevState) {
    super.update(prevProps, prevState)
    if(prevProps.value && !this.props.value) {
      this.setState({
        date : undefined,
        time : undefined,
      })
    }
  }

  onChange(e) {
    if(e.target === this) {
      return
    }
    e.preventDefault()
    e.stopImmediatePropagation()
    const date = this._dateBox.value
    const time = this._timeBox.value
    const dt = date && time && DateTime.fromISO(date + 'T' + time)
    if(dt) {
      this.value = dt.toISO()
      this.emit('change')
    }
    else this.setState({ date, time })
  }

  onClick(e) {
    if(e.target.closest(ClearButton)) {
      this.value = undefined
      this.emit('change')
    }
  }
}
