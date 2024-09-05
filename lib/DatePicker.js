import { DateTime, Interval, Duration } from 'luxon'
import { HtmlDiv } from 'htmlmodule'
import { Widget } from './Widget.js'
import { Label } from './Label.js'
import { Control } from './Control.js'
import { Button } from './Button.js'
import { GridCell } from './GridCell.js'
import { MonthYearBox } from './MonthYearBox.js'
import { DatePickerGrid } from './DatePickerGrid.js'
import './DatePicker.css'

export class DatePicker extends Widget
{
  static class = 'DatePicker'

  static role = 'application'

  static offsets = {
    ArrowLeft : -1,
    ArrowRight : 1,
    ArrowUp : -7,
    ArrowDown : 7,
  }

  state = {
    ...this.state,
    month : undefined,
    start : undefined,
  }

  init() {
    super.init()
    this.on('click', this.#onClick)
    this.on('change', this.#onChange)
    this.on('keydown', this.#onKeyDown)
  }

  render() {
    const { props, state } = this
    const value = props.type === 'range' ?
      this.value :
      this.value && [this.value, this.value].join('/')
    let interval = value && Interval.fromISO(value)
    if(interval && props.type === 'range') {
      // interval = Interval.fromDateTimes(interval.start, interval.end.minus({ days : 1 }))
    }
    const start = interval?.start || state.start
    const now = DateTime.now()
    const month = state.month || start?.startOf('month') || now.startOf('month')
    return [
      props.label && new DatePickerLabel({
        key : 'label',
        children : props.label,
      }),
      new DatePickerControl({
        key : 'control',
        children : [
          new DatePickerHead([
            this._monthYearBox = new MonthYearBox({
              value : month.toISODate(),
              disabled : props.disabled,
            }),
            new DatePickerButton({
              type : 'today',
              children : false,
              disabled : props.disabled,
            }),
          ]),
          new DatePickerGrid({
            interval, month, now, start,
            multiSelectable : props.type === 'range',
            disabled : props.disabled,
          }),
        ],
      }),
    ]
  }

  reset() {
    this.setState({
      month : undefined,
      start : undefined,
    })
  }

  #updateValue(value) {
    const dt = DateTime.fromISO(value)
    if(value !== this.value) {
      this.state.month = dt.startOf('month')
      this.value = value
    }
    else this.value = undefined
    this.emit('change')
  }

  #updateRange(value) {
    const props = this.props
    const dt = DateTime.fromISO(value)
    if(props.duration) {
      const duration = Duration.fromISO(props.duration)
      const end = dt.plus(duration.minus({ days : 1 }))
      const interval = Interval.fromDateTimes(dt, end)
      const value = interval.toISODate()
      if(value === this.value) {
        if(props.required) {
          return
        }
        this.value = undefined
      }
      else this.value = value
      this.state.month = dt.startOf('month')
      this.emit('change')
      return
    }
    const start = this.state.start
    if(!start || dt < start) {
      this.state.start = dt
      this.state.month = dt.startOf('month')
      this.value = Interval.fromDateTimes(dt, dt/*.plus({ days : 1 })*/).toISODate()
      this.emit('change')
      return
    }
    if(dt.hasSame(start, 'day')) {
      this.state.start = undefined
      this.state.month = dt.startOf('month')
      this.value = undefined
      this.emit('change')
      return
    }
    const interval = Interval.fromDateTimes(start, dt/*.plus({ days : 1 })*/)
    this.state.start = undefined
    this.state.month = interval.end.startOf('month')
    this.value = interval.toISODate()
    this.emit('change')
  }

  #setToday() {
    const props = this.props
    if(props.duration) {
      const start = DateTime.now()
      const duration = Duration.fromISO(props.duration)
      const end = start.plus(duration)
      // const interval = Interval.fromDateTimes(start, end.minus({ days : 1 }))
      const interval = Interval.fromDateTimes(start, end)
      this.state.month = start.startOf('month')
      this.value = interval.toISODate()
      this.emit('change')
      return
    }
    if(props.type === 'range') {
      const start = DateTime.now().startOf('day')
      const month = start.startOf('month')
      if(!this.value) {
        this.setState({ start, month })
        return
      }
      this.state.start = start
      this.state.month = month
      this.value = undefined
      this.emit('change')
      return
    }
    const dt = DateTime.now()
    const value = dt.toISODate()
    const month = dt.startOf('month')
    if(value !== this.value) {
      this.state.month = month
      this.value = value
      this.emit('change')
      return
    }
    if(!this.state.month?.hasSame(dt, 'month')) {
      this.setState({ month })
    }
  }

  #onClick(e) {
    const target = e.target
    const cell = target.closest(GridCell)
    if(cell) {
      if(this.props.type === 'range') {
        this.#updateRange(cell.value)
      }
      else this.#updateValue(cell.value)
      return
    }
    if(!target.closest(DatePickerButton)) {
      return
    }
    if(target.type === 'today') {
      e.stopImmediatePropagation()
      this.#setToday()
    }
  }

  #onChange(e) {
    if(e.target === this) {
      return
    }
    e.stopImmediatePropagation()
    this.setState({
      month : DateTime.fromISO(this._monthYearBox.value),
    })
  }

  /**
   * @param {EventType} e
   */
  #onKeyDown(e) {
    if(e.target !== this) {
      return
    }
    if(e.code === 'Space') {
      e.preventDefault()
      return
    }
    if(e.code === 'Backspace') {
      this.#onBackspace(e)
      return
    }
    const days = DatePicker.offsets[e.code]
    if(!days) {
      return
    }
    e.preventDefault()
    if(this.props.duration) {
      if(!this.value) {
        this.#setToday()
        return
      }
      const intervalA = Interval.fromISO(this.value)
      const intervalB = intervalA.mapEndpoints(dt => dt.plus({ days }))
      this.state.month = intervalB.start.startOf('month')
      this.value = intervalB.toISODate()
      this.emit('change')
      return
    }
    if(this.props.type !== 'range') {
      const dtA = this.value ?
        DateTime.fromISO(this.value) :
        DateTime.now()
      const dtB = dtA.plus({ days })
      this.state.month = dtB.startOf('month')
      this.value = dtB.toISODate()
      this.emit('change')
      return
    }
    const start = this.state.start || DateTime.now()
    if(!e.shiftKey) {
      const dt = start.plus({ days })
      if(!this.value) {
        this.setState({
          start : dt,
          month : dt.startOf('month'),
        })
        return
      }
      this.state.start = dt
      this.state.month = dt.startOf('month')
      this.value = undefined
      this.emit('change')
      return
    }
    if(!this.value) {
      const dt = start.plus({ days })
      if(dt < start) {
        this.setState({
          start : dt,
          month : dt.startOf('month'),
        })
        return
      }
      const interval = Interval.fromDateTimes(start, dt)
      this.state.month = interval.end.startOf('month')
      this.value = interval.toISODate()
      this.emit('change')
      return
    }
    const intervalA = Interval.fromISO(this.value)
    const dt = intervalA.end.plus({ days })
    if(dt <= start) {
      this.state.start = dt
      this.state.month = dt.startOf('month')
      this.value = undefined
      this.emit('change')
      return
    }
    const intervalB = intervalA.set({ end : dt })
    this.state.month = intervalB.end.startOf('month')
    this.value = intervalB.toISODate()
    this.emit('change')
  }

  #onBackspace() {
    if(this.required) {
      return
    }
    if(this.value === undefined) {
      if(this.state.start) {
        this.setState({ start : undefined })
      }
      return
    }
    if(this.props.type === 'range') {
      const interval = Interval.fromISO(this.value)
      this.state.start = interval.start
      this.state.month = interval.start.startOf('month')
    }
    this.value = undefined
    this.emit('change')
  }
}

export class DatePickerLabel extends Label
{
  static class = 'DatePickerLabel'
}

export class DatePickerControl extends Control
{
  static class = 'DatePickerControl'
}

export class DatePickerHead extends HtmlDiv
{
  static class = 'DatePickerHead'
}

export class DatePickerButton extends Button
{
  static class = 'DatePickerButton'
}
