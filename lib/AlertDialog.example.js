import { Example } from './Example.js'
import { DialogButton } from './DialogButton.js'
import { AlertDialog } from './AlertDialog.js'

export default () => new Example({
  classList : 'flex',
  children : [
    new DialogButton({
      label : 'AlertDialog',
      dialog : props => new AlertDialog({
        ...props,
        title : 'Error',
      }),
    }),
    new DialogButton({
      label : 'AlertDialog custom',
      dialog : props => new AlertDialog({
        ...props,
        title : 'Validation failed',
        message : 'The specified data is incorrect',
        cancelLabel : 'Close',
      }),
    }),
    new DialogButton({
      label : 'AlertDialog error',
      dialog : props => new AlertDialog({
        ...props,
        error : new Error('Something went wrong'),
      }),
    }),
  ],
})
