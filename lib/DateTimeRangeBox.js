import { DateTime, Interval } from 'luxon'
import { Complex } from './Complex.js'
import { Label } from './Label.js'
import { Control } from './Control.js'
import { DateBox } from './DateBox.js'
import { TimeBox } from './TimeBox.js'
import { Span } from './Span.js'
import { Button } from './Button.js'
import { ClearButton } from './ClearButton.js'
import './DateTimeRangeBox.css'

export class DateTimeRangeBox extends Complex
{
  static class = 'DateTimeRangeBox'

  state = {
    dateA : undefined,
    dateB : undefined,
    timeA : undefined,
    timeB : undefined,
    dateOnly : true,
    startOnly : true,
  }

  init() {
    super.init()
    this.on('click', this.onClick)
    this.on('change', this.onChange)
  }

  render() {
    const { props, state } = this
    const interval = this.value && Interval.fromISO(this.value)
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
          this._dateBoxA = new DateBox({
            text : '____',
            value : interval?.start.toISODate() || state.dateA,
            format : DateTime.DATE_SHORT,
            required : props.required,
          }),
          state.dateOnly ? new TimeButton(new Control) : [
            this._timeBoxA = new TimeBox({
              value : interval?.start.toFormat('HH:mm') || state.timeA,
            }),
            state.startOnly || [
              new Span('—'),
              this._timeBoxB = new TimeBox({
                value : interval?.end.toFormat('HH:mm') || state.timeB,
              }),
            ],
          ],
          state.startOnly ?
            new EndButton(new Control) :
            this._dateBoxB = new DateBox({
              text : '____',
              value : interval ?
                (state.dateOnly ?
                  interval.end.minus({ days : 1 }).toISODate() :
                  interval.end.toISODate()) :
                state.dateB,
              format : DateTime.DATE_SHORT,
              required : props.required,
            }),
          props.required || new ClearButton({
            disabled : !this.value,
            tabIndex : -1,
          }),
        ],
      }),
    ]
  }

  mount() {
    if(!this.value) {
      return
    }
    this.setState({
      dateOnly : false,
      startOnly : false,
    })
  }

  update(prevProps, prevState) {
    super.update(prevProps, prevState)
    if(!prevProps.value || this.props.value) {
      return
    }
    this.setState({
      dateA : undefined,
      dateB : undefined,
      timeA : undefined,
      timeB : undefined,
    })
  }

  #updateValue() {
    const state = this.state
    const dateA = this._dateBoxA.value
    const timeA = state.dateOnly ? '00:00' : this._timeBoxA.value
    const dtA = dateA && timeA && DateTime.fromISO(dateA + 'T' + timeA)
    let dateB, timeB, dtB
    if(state.dateOnly && state.startOnly) {
      dtB = dtA.plus({ days : 1 })
    }
    else if(state.startOnly) {
      dtB = dtA
    }
    else if(state.dateOnly) {
      dateB = this._dateBoxB.value
      timeB = '00:00'
      dtB = dateB && DateTime.fromISO(dateB + 'T' + timeB).plus({ days : 1 })
    }
    else {
      dateB = this._dateBoxB.value
      timeB = this._timeBoxB.value
      dtB = dateB && timeB && DateTime.fromISO(dateB + 'T' + timeB)
    }
    const interval = dtA && dtB && Interval.fromDateTimes(dtA, dtB)
    if(!interval) {
      this.setState({ dateA, dateB, timeA, timeB })
      return
    }
    if(interval.isValid) {
      this.value = interval.toISO()
      this.emit('change')
    }
  }

  onChange(e) {
    if(e.target === this) {
      return
    }
    e.preventDefault()
    e.stopImmediatePropagation()
    this.#updateValue()
  }

  onClick(e) {
    const target = e.target
    if(target.closest(TimeButton)) {
      this.setState({ dateOnly : false })
      this.#updateValue()
      return
    }
    if(target.closest(EndButton)) {
      this.setState({ startOnly : false })
      return
    }
    if(target.closest(ClearButton)) {
      this.value = undefined
      this.emit('change')
    }
  }
}

class TimeButton extends Button
{
  static class = 'TimeButton'
}

class EndButton extends Button
{
  static class = 'EndButton'
}
