import { FileBox } from './FileBox.js'
import { Example } from './Example.js'

export default () => new Example([
  new FileBox({
    label : 'Attach the file'
  })
])
