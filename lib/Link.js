import { Command } from './Command.js'
import './Link.css'

export class Link extends Command
{
  static class = 'Link'

  static tagName = 'a'

  static defaultProps = {
    tabIndex : null,
  }
}
