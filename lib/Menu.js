import { HtmlDiv } from 'htmlmodule'
import { Widget } from './Widget.js'
import { Label } from './Label.js'
import './Menu.css'

export class Menu extends Widget
{
  static class = 'Menu'

  static role = 'menu'

  render() {
    const props = this.props
    return props.children ?? [
      props.label && new Label(props.label),
      props.items && new MenuItems(props.items),
    ]
  }
}

export class MenuItems extends HtmlDiv
{
  static class = 'MenuItems'
}
