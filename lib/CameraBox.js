import { Button } from './Button.js'
import { CameraDialog } from './CameraDialog.js'
import './CameraBox.css'

async function getPicture(options) {
  return new Promise((resolve, reject) => {
    navigator.camera.getPicture(resolve, reject, options)
  })
}

export class CameraBox extends Button
{
  static class = 'CameraBox'

  state = {
    expanded : false,
  }

  file = null

  init() {
    super.init()
    this.on('click', this.#onClick)
  }

  render() {
    return [
      super.render(),
      new CameraDialog({
        modal : true,
        anchor : this,
        open : this.state.expanded,
        oncancel : this.#onCancel,
        onsubmit : this.#onSubmit,
      }),
    ]
  }

  #onClick() {
    if(navigator.camera) {
      void this.#getPicture()
    }
    else this.setState({ expanded : true })
  }

  async #getPicture() {
    const base64string = await getPicture({
      destinationType : Camera.DestinationType.DATA_URL,
    })
    const base64url = `data:image/jpeg;base64,${ base64string }`
    const response = await fetch(base64url)
    const blob = await response.blob()
    this.file = new File([blob], 'photo.jpeg')
    this.emit('change')
  }

  #onCancel = () => {
    this.setState({ expanded : false })
  }

  #onSubmit = e => {
    this.setState({ expanded : false })
    this.file = e.target.file
    this.emit('change')
  }
}
