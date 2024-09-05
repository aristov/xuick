import { Example } from './Example.js'
import { CameraBox } from './CameraBox.js'

export default () => new Example([
  new CameraBox({
    label : 'Сделать фото',
    onchange : console.log,
  }),
])
