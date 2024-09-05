import { Widget } from './Widget.js'
import './Complex.css'

export class Complex extends Widget
{
  static class = 'Complex'

  static defaultProps = {
    tabIndex : null,
  }
}
