import { HtmlDiv } from 'htmlmodule'
import { DateTime } from 'luxon'
import { Example } from './Example.js'
import { DateTimeBox } from './DateTimeBox.js'

class DateTimeBoxTest extends HtmlDiv
{
  static class = 'DateTimeBoxTest'

  state = {
    value : null,
  }

  render() {
    const value = this.state.value
    return [
      new DateTimeBox({
        label : this.props.labelText,
        value : value === null ? this.props.value : value,
        required : this.props.isRequired,
        onchange : e => {
          this.setState({ value : e.target.value })
        },
      }),
    ]
  }
}

export default () => new Example({
  classList : 'flex',
  children : [
    new DateTimeBoxTest({
      labelText : 'DateTimeBox',
    }),
    new DateTimeBoxTest({
      labelText : 'DateTimeBox',
      value : DateTime.now().toISO(),
    }),
    new DateTimeBoxTest({
      labelText : 'DateTimeBox *',
      value : DateTime.now().toISO(),
      isRequired : true,
    }),
  ],
})
