import { RoleOption, Context, Id } from 'htmlmodule'
import './Option.css'

export const OptionContext = new Context({})

export class Option extends RoleOption
{
  static class = 'Option'

  #id = undefined

  value = undefined

  text = undefined

  assign() {
    this.id = this.#id ??= Id.generate()
    OptionContext.Consumer(props => {
      if(props.checkable) {
        this.checked = props.multiSelectable ?
          !!props.value?.includes(this.props.value) :
          this.props.value === props.value
      }
      if(props.selection) {
        this.selected = props.selection.includes(this)
        return
      }
      if(props.checkable) {
        return
      }
      this.selected = props.multiSelectable ?
        !!props.value?.includes(this.props.value) :
        this.props.value === props.value
    })
  }

  render() {
    return this.props.text ?? this.props.children
  }
}
