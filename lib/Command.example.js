import { HtmlDiv } from 'htmlmodule'
import { Example } from '../index.js'
import { Command } from './Command.js'
import { Control } from './Control.js'

class CommandTest extends HtmlDiv
{
  render() {
    return new Command(new Control('Command'))
  }
}

export default () => new Example([
  new CommandTest,
])
