import { HtmlDiv } from 'htmlmodule'
import { Example } from '../index.js'
import { PrevButton } from './PrevButton.js'

class PrevButtonTest extends HtmlDiv
{
  static class = 'PrevButtonTest'

  render() {
    return new PrevButton
  }
}

export default () => new Example([
  new PrevButtonTest,
])
