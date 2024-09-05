import { HtmlForm } from 'htmlmodule'
import { Example } from './Example.js'
import { Button } from './Button.js'

export default () => [
  new Example({
    classList : 'flex',
    children : [
      new Button({
        label : 'Button',
      }),
      new Button({
        label : 'Button action',
        classList : 'action',
      }),
      new Button({
        label : 'Button accent',
        classList : 'accent',
      }),
      new Button({
        label : 'Button attention',
        classList : 'attention',
      }),
      new Button({
        label : 'Button dim',
        classList : 'dim',
      }),
    ],
  }),
  /*new Example([
    new Button({
      label : 'Button icon',
      icon : 'ok-circled',
    }),
    new Button({
      title : 'Button icon',
      icon : 'ok-circled',
    }),
    new Button({
      title : 'Button + Icon',
      style : {
        fontSize : '1.5em',
      },
      children : new Icon('ok-circled'),
    }),
  ]),*/
  new Example([
    new HtmlForm({
      action : '/test',
      onsubmit : () => location.reload(),
      children : new Button({
        label : 'Button submit',
        type : 'submit',
      }),
    }),
  ]),
]
