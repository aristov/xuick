import { Img } from './Img.js'
import './CountryFlag.css'

export class CountryFlag extends Img
{
  static class = 'CountryFlag'

  static tagName = 'span'

  static getUrl(code) {
    return `https://flagcdn.com/${ code.toLowerCase() }.svg`
  }

  constructor(props) {
    if(typeof props === 'string') {
      super({
        src : CountryFlag.getUrl(props),
      })
      return
    }
    if(props?.constructor !== Object || props.src || !props.code) {
      super(props)
      return
    }
    const { code, ...rest } = props
    super({
      src : CountryFlag.getUrl(code),
      ...rest,
    })
  }
}
