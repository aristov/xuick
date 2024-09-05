import { DateTime } from 'luxon'
import { Complex } from './Complex.js'
import { Label } from './Label.js'
import { Control } from './Control.js'
import { PrevButton } from './PrevButton.js'
import { NextButton } from './NextButton.js'
import { MonthBox } from './MonthBox.js'
import { YearBox } from './YearBox.js'
import { Button } from './Button.js'
import './MonthYearBox.css'

export class MonthYearBox extends Complex
{
  static class = 'MonthYearBox'

  init() {
    super.init()
    this.on('click', this.#onClick)
    this.on('change', this.#onChange)
  }

  render() {
    const props = this.props
    const dt = this.value && DateTime.fromISO(this.value)
    return [
      props.label && new MonthYearBoxLabel({
        key : 'label',
        children : props.label,
      }),
      new MonthYearBoxControl({
        key : 'control',
        children : [
          new PrevButton({
            classList : 'MonthYearBoxButton',
            tabIndex : -1,
            disabled : props.disabled,
          }),
          new NextButton({
            classList : 'MonthYearBoxButton',
            tabIndex : -1,
            disabled : props.disabled,
          }),
          new MonthBox({
            name : 'month',
            text : 'Month',
            value : dt?.month,
            disabled : props.disabled,
          }),
          new YearBox({
            name : 'year',
            text : 'Year',
            value : dt?.year,
            disabled : props.disabled,
          }),
        ],
      }),
    ]
  }

  #onClick(e) {
    e.stopImmediatePropagation()
    const target = e.target
    if(!target.closest(Button)) {
      return
    }
    const dt = this.value ?
      DateTime.fromISO(this.value) :
      DateTime.now()
    if(target.closest(PrevButton)) {
      this.value = dt.minus({ months : 1 }).toISODate()
      this.emit('change')
      return
    }
    if(target.closest(NextButton)) {
      this.value = dt.plus({ months : 1 }).toISODate()
      this.emit('change')
    }
  }

  #onChange(e) {
    const target = e.target
    if(target === this) {
      return
    }
    e.stopImmediatePropagation()
    const dtA = this.value ?
      DateTime.fromISO(this.value) :
      DateTime.now()
    const dtB = dtA.set({
      [target.name] : target.value,
    })
    this.value = dtB.toISODate()
    this.emit('change')
  }
}

export class MonthYearBoxLabel extends Label
{
  static class = 'MonthYearBoxLabel'
}

export class MonthYearBoxControl extends Control
{
  static class = 'MonthYearBoxControl'
}
