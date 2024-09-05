import lodash from 'lodash'
import { Widget } from './Widget.js'
import { Label } from './Label.js'
import { Control } from './Control.js'
import { PrevButton } from './PrevButton.js'
import { NextButton } from './NextButton.js'
import { Button } from './Button.js'
import { Grid } from './Grid.js'
import { Row } from './Row.js'
import { GridCell } from './GridCell.js'
import './YearPicker.css'

const RANGE_OFFSET = 20
const ROW_LENGTH = 5

export class YearPicker extends Widget
{
  static class = 'YearPicker'

  static ROW_LENGTH = ROW_LENGTH

  static offsets = {
    ArrowUp : -ROW_LENGTH,
    ArrowRight : 1,
    ArrowDown : ROW_LENGTH,
    ArrowLeft : -1,
  }

  state = {
    ...this.state,
    start : undefined,
  }

  init() {
    super.init()
    this.on('click', this.#onClick)
    this.on('keydown', this.#onKeyDown)
  }

  render() {
    const props = this.props
    const start = this.#start
    const years = lodash.range(start, start + RANGE_OFFSET)
    const rows = lodash.chunk(years, ROW_LENGTH)
    const now = new Date().getFullYear()
    return [
      props.label && new YearPickerLabel({
        key : 'label',
        children : props.label,
      }),
      new YearPickerControl({
        key : 'control',
        children : [
          new PrevButton({
            classList : 'YearPickerButton',
            tabIndex : null,
          }),
          new NextButton({
            classList : 'YearPickerButton',
            tabIndex : null,
          }),
          new Grid(rows.map(row => {
            return new Row({
              key : row.join(),
              children : row.map(value => {
                return new GridCell({
                  key : value,
                  value,
                  selected : value === this.value,
                  current : value === now ? 'date' : null,
                  children : value,
                })
              }),
            })
          })),
        ],
      }),
    ]
  }

  update(prevProps, prevState) {
    super.update(prevProps, prevState)
    const start = this.state.start
    const value = this.value
    if(start === undefined || value === undefined || value === prevProps.value) {
      return
    }
    if(start <= value && value < start + RANGE_OFFSET) {
      return
    }
    this.setState({
      start : Math.floor(value / RANGE_OFFSET) * RANGE_OFFSET,
    })
  }

  #onClick(e) {
    const target = e.target
    if(target.closest(GridCell)) {
      this.#updateValue(target.value)
      return
    }
    if(!target.closest(Button)) {
      return
    }
    e.stopImmediatePropagation()
    if(target.type === 'prev') {
      this.setState({
        start : this.#start - RANGE_OFFSET,
      })
      return
    }
    if(target.type === 'next') {
      this.setState({
        start : this.#start + RANGE_OFFSET,
      })
    }
  }

  #onKeyDown(e) {
    if(e.code === 'Space') {
      e.preventDefault()
      return
    }
    const offset = YearPicker.offsets[e.code]
    if(!offset) {
      return
    }
    e.preventDefault()
    const value = this.value ?? new Date().getFullYear()
    this.state.start = this.#start
    this.value = value + offset
    this.emit('change')
  }

  #updateValue(value) {
    this.state.start = this.#start
    this.value = value
    this.emit('change')
  }

  get #start() {
    if(this.state.start !== undefined) {
      return this.state.start
    }
    const year = this.value ?? new Date().getFullYear()
    return Math.floor(year / RANGE_OFFSET) * RANGE_OFFSET
  }
}

export class YearPickerLabel extends Label
{
  static class = 'YearPickerLabel'
}

export class YearPickerControl extends Control
{
  static class = 'YearPickerControl'
}
