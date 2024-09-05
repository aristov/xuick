import { Class } from 'htmlmodule'
import { Dialog } from './Dialog.js'
import { AlertDialog } from './AlertDialog.js'
import { Form } from './Form.js'
import { DialogContent } from './DialogContent.js'
import { Heading } from './Heading.js'
import { DialogMessage } from './DialogMessage.js'
import { FootBlock } from './FootBlock.js'
import { Button } from './Button.js'
import './ConfirmDialog.css'

export class ConfirmDialog extends Dialog
{
  static class = ['ConfirmDialog', AlertDialog.class].join(' ')

  static role = 'alertdialog'

  static props = {
    title : undefined,
    busy : false,
  }

  static defaultProps = {
    modal : true,
    title : 'Confirmation required',
    submitLabel : 'OK',
    cancelLabel : 'Cancel',
    direction : 'bottom',
  }

  init() {
    super.init()
    this.on('keydown', this.#onKeyDown)
    this.on('submit', this.#onSubmit)
  }

  render() {
    const { props, state } = this
    return new Form({
      classList : Class.generate(DialogContent),
      children : [
        new Heading(props.title),
        props.message && new DialogMessage({
          innerText : props.message,
        }),
        new FootBlock([
          new Button({
            type : 'cancel',
            classList : 'dim',
            label : props.cancelLabel,
            disabled : state.busy,
          }),
          new Button({
            type : 'submit',
            classList : 'accent',
            label : props.submitLabel,
            disabled : state.busy,
          }),
        ]),
      ],
    })
  }

  #onKeyDown(e) {
    if(e.code === 'Enter') {
      this.emit('submit', { submitter : this.node })
    }
  }

  #onSubmit(e) {
    if(e.target === this) {
      return
    }
    e.stopImmediatePropagation()
    this.emit('submit')
  }
}
