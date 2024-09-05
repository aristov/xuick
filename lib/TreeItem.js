import { Widget } from './Widget.js'
import { Control } from './Control.js'
import './TreeItem.css'

export class TreeItem extends Widget
{
  static class = 'TreeItem'

  static role = 'treeitem'

  render() {
    const props = this.props
    return props.children ?? new TreeItemControl(props.content)
  }
}

export class TreeItemControl extends Control
{
  static class = 'TreeItemControl'
}
