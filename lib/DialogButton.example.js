import { HtmlP } from 'htmlmodule'
import { Example } from './Example.js'
import { DialogButton } from './DialogButton.js'
import { Dialog } from './Dialog.js'
import { DialogContent } from './DialogContent.js'
import { DialogHead } from './DialogHead.js'
import { Heading } from './Heading.js'
import { DialogCancelButton } from './DialogCancelButton.js'
import { DialogBody } from './DialogBody.js'
import { CancelButton } from './CancelButton.js'

export default () => new Example([
  new DialogButton({
    label : 'DialogButton',
    dialog : props => new Dialog({
      ...props,
      modal : true,
      children : new DialogContent([
        new DialogHead([
          new Heading('Hello'),
          new DialogCancelButton,
        ]),
        new DialogBody([
          new HtmlP('This dialog demonstrates usage of the DialogButton component.'),
          new CancelButton({
            label : 'OK',
            classList : 'action',
          }),
        ]),
      ]),
    }),
  }),
])
