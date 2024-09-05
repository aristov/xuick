import { HtmlDiv } from 'htmlmodule'
import { Example } from './Example.js'
import { SelectBox } from './SelectBox.js'
import { Option } from './Option.js'

class SelectBoxTest extends HtmlDiv
{
  static class = 'SelectBoxTest'

  state = {
    value : null,
  }

  render() {
    const props = this.props
    const value = this.state.value
    return new SelectBox({
      label : this.props.labelText,
      value : value === null ? props.value : value,
      checkable : props.isCheckable,
      multiSelectable : props.isMultiSelectable,
      required : props.isRequired,
      onchange : e => {
        console.log(e.target.value)
        this.setState({ value : e.target.value })
      },
      options : [
        new Option({
          value : 1,
          text : 'One',
        }),
        new Option({
          value : 2,
          text : 'Two',
        }),
        new Option({
          value : 3,
          text : 'Three',
        }),
        new Option({
          value : 4,
          text : 'Four',
        }),
        new Option({
          value : 5,
          text : 'Five',
        }),
        new Option({
          value : 6,
          text : 'Six',
        }),
        new Option({
          value : 7,
          text : 'Seven',
        }),
      ],
    })
  }
}

export default () => [
  new Example({
    classList : 'flex',
    children : [
      new SelectBoxTest({
        labelText : 'SelectBox',
      }),
      new SelectBoxTest({
        labelText : 'SelectBox',
        value : 3,
      }),
      new SelectBoxTest({
        labelText : 'SelectBox multi',
        isMultiSelectable : true,
      }),
      new SelectBoxTest({
        labelText : 'SelectBox multi',
        isMultiSelectable : true,
        value : [3, 4, 5, 6],
      }),
    ],
  }),
  new Example({
    classList : 'flex',
    children : [
      new SelectBoxTest({
        labelText : 'SelectBox check',
        isCheckable : true,
      }),
      new SelectBoxTest({
        labelText : 'SelectBox check',
        isCheckable : true,
        value : 4,
      }),
      new SelectBoxTest({
        labelText : 'SelectBox check *',
        isCheckable : true,
        isRequired : true,
      }),
      new SelectBoxTest({
        labelText : 'SelectBox multi check',
        isMultiSelectable : true,
        isCheckable : true,
      }),
      new SelectBoxTest({
        labelText : 'SelectBox multi check',
        isMultiSelectable : true,
        isCheckable : true,
        value : [2, 3, 4, 5],
      }),
      new SelectBoxTest({
        labelText : 'SelectBox multi check *',
        isMultiSelectable : true,
        isCheckable : true,
        isRequired : true,
      }),
    ],
  }),
]
