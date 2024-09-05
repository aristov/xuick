import { Command } from './Command.js'
import { Icon } from './Icon.js'
import { Label } from './Label.js'
import './MenuItem.css'

export class MenuItem extends Command
{
  static class = 'MenuItem'

  static role = 'menuitem'

  static defaultProps = {
    tabIndex : -1,
  }

  render() {
    const props = this.props
    return [
      props.icon || props.label ?
        [
          props.icon && new Icon(props.icon),
          props.label && new Label(props.label),
        ] :
        props.content ?? props.children,
      props.menu && this.renderMenu(),
      props.dialog && this.renderDialog(),
    ]
  }
}
