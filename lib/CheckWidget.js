import { Widget } from './Widget.js'

export class CheckWidget extends Widget
{
  init() {
    super.init()
    this.on('click', this.#onClick)
    this.on('keydown', this.#onKeyDown)
    this.on('keyup', this.#onKeyUp)
  }

  assign() {
    super.assign()
    this.value = this.props.checked
  }

  #onClick() {
    this.value = !this.value
    this.emit('change')
  }

  #onKeyDown(e) {
    if(e.code === 'Enter') {
      this.form?.emit('submit', { submitter : this.node })
    }
  }

  #onKeyUp(e) {
    if(e.code === 'Space') {
      this.click()
    }
  }
}
