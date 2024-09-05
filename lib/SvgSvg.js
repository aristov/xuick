import { AttrType } from 'htmlmodule'
import { SvgType } from './SvgType.js'

export class SvgSvg extends SvgType
{
  static tagName = 'svg'

  static props = {
    viewBox : AttrType.define('viewBox'),
  }
}
