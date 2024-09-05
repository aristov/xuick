import { HtmlDiv } from 'htmlmodule'
import './DialogBody.css'

export class DialogBody extends HtmlDiv
{
  static class = 'DialogBody'

  state = {
    scrolled : false,
  }

  init() {
    this.on('scroll', this.onScroll)
  }

  assign() {
    this.classList = this.state.scrolled && 'scrolled'
  }

  onScroll() {
    const scrolled = !!this.node.scrollTop
    if(scrolled !== this.state.scrolled) {
      this.setState({ scrolled })
    }
  }
}
