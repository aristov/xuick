import { HtmlSpan } from 'htmlmodule'
import './Icon.css'

export class Icon extends HtmlSpan
{
  static class = 'Icon'

  constructor(props) {
    if(typeof props === 'string') {
      props = { name : props }
    }
    super(props)
  }

  assign() {
    this.classList = 'Icon_' + this.props.name
  }
}
