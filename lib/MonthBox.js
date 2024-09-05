import { DateTime } from 'luxon'
import { SelectBox } from './SelectBox.js'
import { Option } from './Option.js'
import './MonthBox.css'

const arr = Array(12)

export class MonthBox extends SelectBox
{
  static class = 'MonthBox'

  renderOptions() {
    return Array.from(arr, (_, i) => {
      const month = DateTime.fromObject({ month : i + 1 })
      return new Option({
        value : month.month,
        text : month.toFormat('LLLL'),
      })
    })
  }
}
