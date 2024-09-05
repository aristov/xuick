import { Link } from './Link.js'
import './MenuItemLink.css'

export class MenuItemLink extends Link
{
  static class = 'MenuItemLink MenuItem'

  static role = 'menuitem'
}
