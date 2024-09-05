import { Example } from './Example.js'
import { Button } from './Button.js'
import { Popup } from './Popup.js'
import { PopupContent } from './PopupContent.js'

class PopupExample extends Example
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
        label : this.state.hidden ? 'Open popup' : 'Close popup',
      }),
      new Popup({
        open : !this.state.hidden,
        anchor : this._button,
        oncancel : () => this.setState({ hidden : true }),
        children : new PopupContent({
          style : { padding : '50px' },
          children : new Button({
            onclick : () => this.setState({ hidden : true }),
            label : 'Close',
          }),
        }),
      }),
    ]
  }
}

class PopupModalExample extends Example
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
        label : 'Modal popup',
      }),
      new Popup({
        modal : true,
        open : !this.state.hidden,
        anchor : this._button,
        oncancel : e => {
          if(e.target.cancelEvent.type !== 'focusin') {
            this.setState({ hidden : true })
          }
        },
        children : new PopupContent({
          style : { padding : '50px' },
          children : new Button({
            onclick : () => this.setState({ hidden : true }),
            label : 'Close',
          }),
        }),
      }),
    ]
  }
}

export default () => [
  new PopupExample,
  new PopupModalExample,
]
