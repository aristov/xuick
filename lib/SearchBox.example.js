import { HtmlDiv } from 'htmlmodule'
import { Example } from './Example.js'
import { SearchBox } from './SearchBox.js'

class SearchBoxTest extends HtmlDiv
{
  static class = 'SearchBoxTest'

  state = {
    value : null,
  }

  render() {
    const value = this.state.value
    return new SearchBox({
      label : this.props.labelText,
      value : value === null ? this.props.value : value,
      placeholder : this.props.placeholderText,
      oninput : e => {
        this.setState({ value : e.target.value })
      },
    })
  }
}

export default () => new Example({
  classList : 'flex',
  children : [
    new SearchBoxTest({
      labelText : 'SearchBox',
    }),
    new SearchBoxTest({
      labelText : 'SearchBox',
      value : 'Gecko',
    }),
    new SearchBoxTest({
      labelText : 'SearchBox placeholder',
      placeholderText : 'Type something',
    }),
  ],
})
