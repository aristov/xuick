import { RoleImg } from 'htmlmodule'
import './Img.css'

export class Img extends RoleImg
{
  static class = 'Img'

  assign() {
    const src = this.props.src
    if(!src) {
      return
    }
    this.style = {
      ...this.props.style, // fixme
      backgroundImage : `url(${ src })`,
    }
  }
}
