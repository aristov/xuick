import { HtmlDiv } from 'htmlmodule'
import { Example, Button } from '../index.js'
import { ToolTip } from './ToolTip.js'

class ToolTipTest extends HtmlDiv
{
  static class = 'ToolTipTest'

  state = {
    expanded : true,
  }

  render() {
    return [
      this._button = new Button({
        label : 'ToolTip',
        classList : 'action',
        onclick : () => {
          this.setState(state => ({ expanded : !state.expanded }))
        },
      }),
      new ToolTip({
        anchor : this._button,
        open : this.state.expanded,
        content : 'ToolTip content',
        oncancel : () => {
          this.setState({ expanded : false })
        },
      }),
    ]
  }
}

export default () => new Example({
  classList : 'flex',
  style : {
    justifyContent : 'space-between',
  },
  children : [
    new ToolTipTest,
    new ToolTipTest,
  ],
})
