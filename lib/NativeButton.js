import { HtmlButton } from 'htmlmodule'
import { Control } from './Control.js'
import './NativeButton.css'

export class NativeButton extends HtmlButton
{
  static class = 'NativeButton Button Widget'

  render() {
    const label = this.props.label
    return label === undefined ?
      this.props.children :
      new Control({
        tagName : 'span',
        children : label,
      })
  }
}
