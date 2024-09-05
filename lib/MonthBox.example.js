import { HtmlDiv } from 'htmlmodule'
import { Example } from '../index.js'
import { MonthBox } from './MonthBox.js'

class MonthBoxTest extends HtmlDiv
{
  state = {
    value : undefined,
  }

  render() {
    return new MonthBox({
      label : 'MonthBox',
      value : this.state.value,
      onchange : e => {
        this.setState({ value : e.target.value })
      },
    })
  }
}

export default () => new Example([
  new MonthBoxTest,
])
