import { Example } from './Example.js'
import { Button } from './Button.js'
import { Dialog } from './Dialog.js'
import { DialogContent } from './DialogContent.js'
import { DialogHead } from './DialogHead.js'
import { Heading } from './Heading.js'
import { DialogCancelButton } from './DialogCancelButton.js'
import { DialogBody } from './DialogBody.js'
import { TextBox } from './TextBox.js'

class DialogExample extends Example
{
  state = {
    hidden : true,
    text : '',
  }

  render() {
    return [
      this._button = new Button({
        onclick : () => {
          this.setState(state => ({ hidden : !state.hidden }))
        },
        label : this.state.hidden ? 'Open dialog' : 'Close dialog',
      }),
      new Dialog({
        open : !this.state.hidden,
        anchor : this._button,
        oncancel : () => this.setState({ hidden : true }),
        children : new DialogContent([
          new DialogHead([
            new Heading('Hello!'),
            new DialogCancelButton,
          ]),
          new DialogBody([
            new TextBox({
              label : 'Say something',
              value : this.state.text,
              style : { marginRight : '8px' },
              oninput : e => this.setState({ text : e.target.value }),
            }),
            new Button({
              onclick : () => this.setState({ hidden : true }),
              label : 'Close',
            }),
          ]),
        ]),
      }),
    ]
  }
}

class DialogModalExample extends Example
{
  state = {
    hidden : true,
  }

  render() {
    return [
      this._button = new Button({
        onclick : () => {
          this.setState(state => ({ hidden : !state.hidden }))
        },
        label : 'Modal dialog',
      }),
      new Dialog({
        modal : true,
        open : !this.state.hidden,
        anchor : this._button,
        oncancel : e => {
          if(e.target.cancelEvent.type !== 'focusin') {
            this.setState({ hidden : true })
          }
        },
        children : new DialogContent([
          new DialogHead([
            new Heading('Hello!'),
            new DialogCancelButton,
          ]),
          new DialogBody([
            new TextBox({
              label : 'Say something',
              value : this.state.text,
              style : { marginRight : '8px' },
              oninput : e => this.setState({ text : e.target.value }),
            }),
            new Button({
              onclick : () => this.setState({ hidden : true }),
              label : 'Close',
            }),
          ]),
        ]),
      }),
    ]
  }
}

export default () => [
  new DialogExample,
  new DialogModalExample,
]
