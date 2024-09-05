import { HtmlDiv } from 'htmlmodule'
import { Example } from './Example.js'
import { TextBox } from './TextBox.js'

class TextBoxTest extends HtmlDiv
{
  static class = 'TextBoxTest'

  state = {
    value : null,
  }

  render() {
    const value = this.state.value
    return new TextBox({
      label : this.props.labelText,
      value : value === null ?
        this.props.value :
        value,
      placeholder : this.props.placeholderText,
      multiLine : this.props.isMultiLine,
      oninput : e => {
        this.setState({ value : e.target.value })
      },
    })
  }
}

export default () => [
  new Example({
    classList : 'flex',
    children : [
      new TextBoxTest({
        labelText : 'TextBox',
      }),
      new TextBoxTest({
        labelText : 'TextBox',
        value : 'Hello world!',
      }),
      new TextBoxTest({
        labelText : 'TextBox placeholder',
        placeholderText : 'Type something',
      }),
    ],
  }),
  new Example({
    classList : 'flex',
    children : [
      new TextBoxTest({
        labelText : 'TextBox multiLine',
        isMultiLine : true,
      }),
      new TextBoxTest({
        labelText : 'TextBox multiLine',
        isMultiLine : true,
        value : 'Hello world!',
      }),
      new TextBoxTest({
        labelText : 'TextBox multiLine placeholder',
        isMultiLine : true,
        placeholderText : 'Type something',
      }),
    ],
  }),
]
