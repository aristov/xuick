import { HtmlDiv } from 'htmlmodule'
import { Example } from '../index.js'
import { Slider } from './Slider.js'

class SliderTest extends HtmlDiv
{
  static class = 'SliderTest'

  static props = {
    valueMin : undefined,
    valueMax : undefined,
  }

  state = {
    value : undefined,
  }

  assign() {
    this.style = { width : '100%' }
  }

  render() {
    const props = this.props
    const sliderProps = {
      label : props.labelText,
      type : props.type,
      value : this.state.value ?? props.value,
      onchange : e => {
        console.log(e.target.value)
        this.setState({ value : e.target.value })
      },
    }
    if(props.valueMin) {
      sliderProps.valueMin = props.valueMin
    }
    if(props.valueMax) {
      sliderProps.valueMax = props.valueMax
    }
    return new Slider(sliderProps)
  }
}

export default () => new Example({
  classList : 'flex',
  children : [
    new SliderTest({
      labelText : 'Slider',
    }),
    new SliderTest({
      labelText : 'Slider 0',
      value : 0,
    }),
    new SliderTest({
      labelText : 'Slider 50',
      value : 50,
    }),
    new SliderTest({
      labelText : 'Slider 100',
      value : 100,
    }),
    new SliderTest({
      labelText : 'Slider 2 [1-3]',
      valueMin : 1,
      valueMax : 3,
      value : 2,
    }),
    new SliderTest({
      labelText : 'Slider range',
      type : 'range',
    }),
    new SliderTest({
      labelText : 'Slider range 25-75',
      type : 'range',
      value : [25, 75],
    }),
    new SliderTest({
      labelText : 'Slider range 2-4 [1-5]',
      type : 'range',
      value : [2, 4],
      valueMin : 1,
      valueMax : 5,
    }),
  ],
})
