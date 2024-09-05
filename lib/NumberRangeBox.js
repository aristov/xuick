import { Complex } from './Complex.js'
import { Control } from './Control.js'
import { Button } from './Button.js'
import { Label } from './Label.js'
import { Span } from './Span.js'
import { NativeInputBox } from './NativeInputBox.js'
import './NumberRangeBox.css'

export class NumberRangeBox extends Complex
{
  static class = 'NumberRangeBox'

  state = {
    startOnly : true,
  }

  init() {
    super.init()
    this.on('click', this.onClick)
    this.on('change', this.onChange)
  }

  render() {
    const props = this.props
    const value = this.value
    return [
      props.label && new Label({
        key : 'label',
        children : props.label,
      }),
      new Control({
        key : 'control',
        children : [
          this._inputA = new NativeInputBox({
            type : 'number',
            value : value?.[0] ?? null,
            max : value?.[1],
          }),
          this.state.startOnly ? new Button(new Control) : [
            new Span('—'),
            this._inputB = new NativeInputBox({
              type : 'number',
              value : value?.[1] ?? null,
              min : value?.[0],
            }),
          ],
        ],
      }),
    ]
  }

  mount() {
    if(this.value) {
      this.setState({ startOnly : false })
    }
  }

  onChange(e) {
    if(e.target === this) {
      return
    }
    e.preventDefault()
    e.stopImmediatePropagation()
    const valueA = this._inputA.value
    const valueB = this.state.startOnly ?
      valueA :
      this._inputB.value
    const value = valueA && valueB && [+valueA, +valueB]
    if(!value) {
      return
    }
    if(value[0] <= value[1]) {
      this.value = value
      this.emit('change')
    }
    else this.setState()
  }

  onClick(e) {
    if(e.target.closest(Button)) {
      this.setState({ startOnly : false })
    }
  }
}
