import { Dialog } from './Dialog.js'
import { DialogContent } from './DialogContent.js'
import { Heading } from './Heading.js'
import { DialogMessage } from './DialogMessage.js'
import { FootBlock } from './FootBlock.js'
import { Button } from './Button.js'
import './AlertDialog.css'

export class AlertDialog extends Dialog
{
  static class = 'AlertDialog'

  static role = 'alertdialog'

  static props = {
    title : undefined,
  }

  static defaultProps = {
    modal : true,
    cancelLabel : 'OK',
  }

  init() {
    super.init()
    this.on('keydown', this.#onKeyDown)
  }

  render() {
    const props = this.props
    const error = props.error
    if(!error && !props.title && !props.message) {
      return
    }
    const title = props.title || error?.name || error?.constructor.name
    const message = props.message || error?.message
    return new DialogContent([
      new Heading(title),
      message && new DialogMessage(message),
      new FootBlock(
        new Button({
          type : 'cancel',
          classList : 'accent',
          label : props.cancelLabel,
        }),
      ),
    ])
  }

  #onKeyDown(e) {
    if(e.code === 'Enter') {
      this.cancel(e.nativeEvent)
    }
  }
}
