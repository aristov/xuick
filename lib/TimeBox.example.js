import { Example } from './Example.js'
import { TimeBox } from './TimeBox.js'
import { DateTime } from 'luxon'
import { HtmlDiv } from 'htmlmodule'

class TimeBoxTest extends HtmlDiv
{
  static class = 'TimeBoxTest'

  state = {
    value : null,
  }

  render() {
    const value = this.state.value
    return new TimeBox({
      label : this.props.labelText,
      value : value === null ? this.props.value : value,
      required : this.props.isRequired,
      onchange : e => {
        this.setState({ value : e.target.value })
      },
    })
  }
}

export default () => new Example({
  classList : 'flex',
  children : [
    new TimeBoxTest({
      labelText : 'TimeBox',
    }),
    new TimeBoxTest({
      labelText : 'TimeBox',
      value : DateTime.now().toFormat('HH:mm'),
    }),
    new TimeBoxTest({
      labelText : 'TimeBox *',
      value : DateTime.now().toFormat('HH:mm'),
      isRequired : true,
    }),
  ],
})
