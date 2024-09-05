import { HtmlDiv } from 'htmlmodule'
import { Example } from './Example.js'
import { Switch } from './Switch.js'

class CheckBoxTest extends HtmlDiv
{
  static class = 'CheckBoxTest'

  state = {
    checked : undefined,
  }

  render() {
    return new Switch({
      label : this.props.labelText,
      checked : this.state.checked ?? this.props.isChecked,
      onchange : e => {
        this.setState(({ checked : e.target.value }))
      },
    })
  }
}

export default () => new Example({
  classList : 'flex',
  children : [
    new CheckBoxTest({
      labelText : 'Switch',
      isChecked : false,
    }),
    new CheckBoxTest({
      labelText : 'Switch checked',
      isChecked : true,
    }),
  ],
})
