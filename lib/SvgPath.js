import { AttrType } from 'htmlmodule'
import { SvgType } from './SvgType.js'

export class SvgPath extends SvgType
{
  static tagName = 'path'

  static props = {
    d : AttrType.define('d'),
    stroke : AttrType.define('stroke'),
    strokeWidth : AttrType.define('stroke-width'),
    transform : AttrType.define('transform'),
    fill : AttrType.define('fill'),
  }
}
