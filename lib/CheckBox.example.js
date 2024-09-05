import { HtmlDiv } from 'htmlmodule'
import { Example } from './Example.js'
import { CheckBox } from './CheckBox.js'

class CheckBoxExample extends HtmlDiv
{
  state = {
    checked : undefined,
  }

  render() {
    return new CheckBox({
      label : this.props.labelText,
      checked : this.state.checked ?? this.props.isChecked,
      onchange : e => {
        this.setState(({ checked : e.target.value }))
      },
    })
  }
}

export default () => new Example([
  new CheckBoxExample({
    labelText : 'CheckBox',
    isChecked : false,
  }),
  new CheckBoxExample({
    labelText : 'CheckBox checked',
    isChecked : true,
  }),
  new CheckBoxExample({
    labelText : 'CheckBox mixed',
    isChecked : 'mixed',
  }),
])
