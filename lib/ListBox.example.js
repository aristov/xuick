import * as htmlmodule from 'htmlmodule'
import { HtmlDiv } from 'htmlmodule'
import { Example } from './Example.js'
import { ListBox } from './ListBox.js'
import { Option } from './Option.js'

const options = [
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
]

class ListBoxTest extends HtmlDiv
{
  static class = 'ListBoxTest'

  state = {
    value : null,
  }

  render() {
    const props = this.props
    const value = this.state.value
    return new ListBox({
      label : props.labelText,
      value : value === null ? props.value : value,
      checkable : props.isCheckable,
      multiSelectable : props.isMultiSelectable,
      required : props.isRequired,
      onchange : e => {
        this.setState({ value : e.target.value })
      },
      options : props.options.map(value => {
        return new Option({ value, text : value })
      }),
    })
  }
}

export default () => [
  new Example({
    classList : 'flex',
    children : [
      new ListBoxTest({
        labelText : 'ListBox',
        options,
      }),
      new ListBoxTest({
        labelText : 'ListBox',
        value : 'Three',
        options,
      }),
      new ListBoxTest({
        labelText : 'ListBox multi',
        isMultiSelectable : true,
        options,
      }),
      new ListBoxTest({
        labelText : 'ListBox multi',
        isMultiSelectable : true,
        value : ['Two', 'Three', 'Four', 'Five'],
        options,
      }),
    ],
  }),
  new Example({
    classList : 'flex',
    children : [
      new ListBoxTest({
        labelText : 'ListBox check',
        isCheckable : true,
        options,
      }),
      new ListBoxTest({
        labelText : 'ListBox check',
        isCheckable : true,
        value : 'Three',
        options,
      }),
      new ListBoxTest({
        labelText : 'ListBox check *',
        isCheckable : true,
        isRequired : true,
        options,
      }),
      new ListBoxTest({
        labelText : 'ListBox multi check',
        isMultiSelectable : true,
        isCheckable : true,
        options,
      }),
      new ListBoxTest({
        labelText : 'ListBox multi check',
        isMultiSelectable : true,
        isCheckable : true,
        value : ['Three', 'Four', 'Five', 'Six'],
        options,
      }),
      new ListBoxTest({
        labelText : 'ListBox multi check *',
        isMultiSelectable : true,
        isCheckable : true,
        isRequired : true,
        options,
      }),
    ],
  }),
  new Example([
    new ListBoxTest({
      labelText : 'ListBox',
      options : Object.keys(htmlmodule),
    }),
  ]),
]
