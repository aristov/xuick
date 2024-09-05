import { Button } from './Button.js'
import { Popup } from './Popup.js'

export class CancelButton extends Button
{
  static class = 'CancelButton'

  init() {
    super.init()
    this.on('click', this.#onClick)
  }

  /**
   * @param {EventType} e
   */
  #onClick(e) {
    const popup = this.closest(Popup)
    if(!popup) {
      return
    }
    popup.cancelEvent = e.nativeEvent
    popup.emit('cancel')
  }
}
