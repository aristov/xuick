import { HtmlDiv } from 'htmlmodule'
import { Example } from '../index.js'
import { NextButton } from './NextButton.js'

class NextButtonTest extends HtmlDiv
{
  static class = 'NextButtonTest'

  render() {
    return new NextButton
  }
}

export default () => new Example([
  new NextButtonTest,
])
