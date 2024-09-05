import { HtmlVideo, HtmlCanvas } from 'htmlmodule'
import { Dialog } from './Dialog.js'
import { DialogContent } from './DialogContent.js'
import { Block } from './Block.js'
import { Button } from './Button.js'
import './CameraDialog.css'

const cameras = [
  {
    video : {
      facingMode : 'user',
    },
    audio : false,
  },
  {
    video : {
      facingMode : 'environment',
    },
    audio : false,
  },
]

function isPortrait() {
  return matchMedia('(orientation: portrait)').matches
}

export class CameraDialog extends Dialog
{
  static class = 'CameraDialog'

  state = {
    ...this.state,
    width : '100%',
    height : '100%',
    stream : null,
    captured : false,
    canFlip : true,
    camera : 0,
    error : null,
  }

  file = null

  assign() {
    super.assign()
    const state = this.state
    this.classList = [
      state.captured && 'captured',
      state.canFlip && 'canFlip',
    ]
  }

  render() {
    const state = this.state
    return new DialogContent([
      new Block([
        new CaptureButton({
          onclick : this.#onCaptureClick,
        }),
        state.canFlip && new FlipButton({
          onclick : this.#onFlipClick,
        }),
      ]),
      new AcceptButton({
        onclick : this.#onAcceptClick,
      }),
      new DiscardButton({
        onclick : this.#onDiscardClick,
      }),
      this._video = new HtmlVideo({
        width : state.width,
        height : state.height,
        srcObject : state.stream,
        oncanplay : this.#onCanPlay,
      }),
      this._canvas = new HtmlCanvas(isPortrait() ? {
        width : innerWidth,
        height : innerHeight,
      } : {
        width : state.width,
        height : state.height,
      }),
    ])
  }

  update(prevProps, prevState) {
    super.update(prevProps, prevState)
    if(this.props.open) {
      if(!prevProps.open) {
        void this.#start()
      }
      return
    }
    if(!prevProps.open || !this.state.stream) {
      return
    }
    this.#stop()
    this.setState({ stream : null })
  }

  destroy() {
    super.destroy()
    this.#stop()
  }

  async #start() {
    try {
      const constraints = cameras[this.state.camera]
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoInputs = devices.filter(device => {
        return device.kind === 'videoinput'
      })
      this.setState({
        stream : await navigator.mediaDevices.getUserMedia(constraints),
        canFlip : videoInputs.length > 1,
      })
      void this._video.node.play()
    }
    catch(error) {
      this.setState({ error })
    }
  }

  #stop() {
    const stream = this.state.stream
    if(!stream) {
      return
    }
    const tracks = stream.getTracks()
    tracks.forEach(track => track.stop())
  }

  #onCanPlay = () => {
    if(isPortrait()) {
      return
    }
    const video = this._video.node
    this.setState({
      width : video.videoWidth,
      height : video.videoHeight,
    })
  }

  #onCaptureClick = async () => {
    const video = this._video.node
    const canvas = this._canvas.node
    const context = canvas.getContext('2d')
    if(isPortrait()) {
      const dWidth = video.videoWidth * (innerHeight / video.videoHeight)
      const dx = (innerWidth - dWidth) / 2
      context.drawImage(video, dx, 0, dWidth, innerHeight)
    }
    else context.drawImage(video, 0, 0)
    this.setState({ captured : true })
  }

  #onAcceptClick = async () => {
    const blob = await new Promise(resolve => {
      this._canvas.node.toBlob(resolve)
    })
    this.file = new File([blob], 'capture.png', {
      type : 'image/png',
    })
    this.#stop()
    this.setState({ captured : false })
    this.emit('submit')
  }

  #onDiscardClick = e => {
    if(this.state.captured) {
      this.setState({ captured : false })
      return
    }
    this.#stop()
    this.cancel(e.nativeEvent)
  }

  #onFlipClick = async () => {
    const camera = +!this.state.camera
    const constraints = cameras[camera]
    this.#stop()
    this.setState({
      stream : await navigator.mediaDevices.getUserMedia(constraints),
      camera,
    })
    this._video.node.play()
  }
}

class CameraDialogButton extends Button
{
  static class = 'CameraDialogButton'
}

class CaptureButton extends CameraDialogButton
{
  static class = 'CaptureButton'
}

class DiscardButton extends CameraDialogButton
{
  static class = 'DiscardButton'
}

class AcceptButton extends CameraDialogButton
{
  static class = 'AcceptButton'
}

class FlipButton extends CameraDialogButton
{
  static class = 'FlipButton'
}
