import { Example } from './Example.js'
import { DialogButton } from './DialogButton.js'
import { ConfirmDialog } from './ConfirmDialog.js'

export default () => new Example({
  classList : 'flex',
  children : [
    new DialogButton({
      label : 'ConfirmDialog',
      dialog : props => new ConfirmDialog({
        ...props,
        onsubmit : console.warn,
      }),
    }),
    new DialogButton({
      label : 'ConfirmDialog custom',
      dialog : props => new ConfirmDialog({
        ...props,
        title : 'Are you sure?',
        message : 'This action is irreversible',
        submitLabel : 'Yes',
        cancelLabel : 'No',
        onsubmit : console.warn,
      }),
    }),
    new DialogButton({
      label : 'ConfirmDialog delete',
      dialog : props => new ConfirmDialog({
        ...props,
        title : 'Вы хотите удалить аккаунт?',
        message : 'Восстановить удаленный аккаунт можно в течение 180 дней после авторизации в приложении. Через 180 дней после заявки на удаление при отсутствии активности аккаунт будет полностью удален.',
        submitLabel : 'Удалить',
        cancelLabel : 'Не удалять',
        onsubmit : console.warn,
      }),
    }),
  ],
})
