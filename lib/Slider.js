import { HtmlDiv, RoleSlider } from 'htmlmodule'
import { Widget } from './Widget.js'
import { Label } from './Label.js'
import { Control } from './Control.js'
import './Slider.css'

export class Slider extends Widget
{
  static class = 'Slider'

  static props = {
    valueMin : RoleSlider.props.valueMin.defaultValue,
    valueMax : RoleSlider.props.valueMax.defaultValue,
  }

  state = {
    value : undefined,
    control : null,
  }

  type
  value

  init() {
    super.init()
    this.on('click', this.#onClick)
    this.on('contextmenu', this.#onContextMenu)
    this.on('touchmove', this.#onTouchMove)
  }

  assign() {
    super.assign()
    if(this.state.control) {
      this.classList = 'active'
    }
  }

  render() {
    const props = this.props
    const valueMin = this.valueMin
    const valueMax = this.valueMax
    const valueRange = valueMax - valueMin
    let value = this.state.value ?? props.value
    let hidden = false
    let valueA, valueB, percentA, percentB
    if(value === undefined) {
      hidden = !this.state.control
      if(props.type === 'range') {
        percentA = 0
        percentB = 100
      }
    }
    else {
      if(props.type === 'range') {
        [valueA, valueB] = value
      }
      else {
        valueA = valueMin
        valueB = value
      }
      percentA = 100 * (valueA - valueMin) / valueRange
      percentB = 100 * (valueB - valueMin) / valueRange
    }
    return [
      props.label && new SliderLabel({
        key : 'label',
        children : props.label,
      }),
      new SliderTrack({
        key : 'track',
        children : [
          new SliderFill({
            hidden,
            style : value === undefined ? null : {
              left : percentA + '%',
              right : 100 - percentB + '%',
            },
          }),
          this._line = new SliderLine([
            props.type === 'range' && new SliderControl({
              hidden,
              valueMin,
              valueMax,
              valueNow : valueA,
              style : percentA === undefined ? null : {
                left : percentA + '%',
              },
            }),
            new SliderControl({
              hidden,
              valueMin,
              valueMax,
              valueNow : valueB,
              style : percentB === undefined ? null : {
                left : percentB + '%',
              },
            }),
          ]),
        ],
      }),
      new SliderValue(
        value === undefined ?
          ' ' :
          props.type === 'range' ?
            value.map(Math.round).join('-') :
            Math.round(value),
      ),
    ]
  }

  #onClick(e) {
    const track = e.target.closest(SliderTrack)
    if(!track) {
      return
    }
    const rect = this._line.node.getBoundingClientRect()
    const fraction = (e.clientX - rect.left) / rect.width
    let value = this.valueMin + fraction * (this.valueMax - this.valueMin)
    value = Math.max(value, this.valueMin)
    value = Math.min(value, this.valueMax)
    value = Math.round(value)
    if(this.type === 'range') {
      value = [value, value]
      if(value.join() === this.value?.join()) {
        return
      }
    }
    else if(value === this.value) {
      return
    }
    this.value = value
    this.emit('change')
  }

  #onContextMenu(e) {
    e.preventDefault()
  }

  #onTouchMove(e) {
    if(e.touches.length > 1) {
      return
    }
    e.preventDefault()
    const [touch] = e.touches
    const state = this.state
    const rect = this._line.node.getBoundingClientRect()
    const fraction = (touch.clientX - rect.left) / rect.width
    let control = state.control
    let value = this.valueMin + fraction * (this.valueMax - this.valueMin)
    value = Math.min(value, this.valueMax)
    value = Math.max(value, this.valueMin)
    if(this.type === 'range') {
      const [controlA, controlB] = this.findAll(SliderControl)
      if(!control) {
        const rectA = controlA.node.getBoundingClientRect()
        const rectB = controlB.node.getBoundingClientRect()
        const deltaA = Math.abs(rectA.left + rectA.width / 2 - touch.clientX)
        const deltaB = Math.abs(rectB.left + rectB.width / 2 - touch.clientX)
        control = deltaA < deltaB ? controlA : controlB
      }
      if(control === controlA) {
        let valueB = state.value?.[1] ?? this.value?.[1] ?? this.valueMax
        valueB = Math.max(valueB, value)
        value = [value, valueB]
      }
      else {
        let valueA = state.value?.[0] ?? this.value?.[0] ?? this.valueMin
        valueA = Math.min(valueA, value)
        value = [valueA, value]
      }
    }
    this.setState({
      control : control || this.find(SliderControl),
      value,
    })
    this.on('touchend', this.#onTouchEnd, { once : true })
  }

  #onTouchEnd() {
    let value = this.state.value
    if(this.type === 'range') {
      value = value.map(Math.round)
      if(value.join() === this.value?.join()) {
        this.setState({
          control : null,
          value : undefined,
        })
        return
      }
    }
    else {
      value = Math.round(value)
      if(value === this.value) {
        this.setState({
          control : null,
          value : undefined,
        })
        return
      }
    }
    this.state.control = null
    this.state.value = undefined
    this.value = value
    this.emit('change')
  }
}

export class SliderLabel extends Label
{
  static class = 'SliderLabel'
}

export class SliderTrack extends Control
{
  static class = 'SliderTrack'
}

export class SliderFill extends HtmlDiv
{
  static class = 'SliderFill'
}

export class SliderLine extends HtmlDiv
{
  static class = 'SliderLine'
}

export class SliderControl extends RoleSlider
{
  static class = 'SliderControl'
}

export class SliderValue extends HtmlDiv
{
  static class = 'SliderValue'
}
