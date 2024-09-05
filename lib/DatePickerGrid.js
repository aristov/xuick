import { Grid } from './Grid.js'
import { RowGroup } from './RowGroup.js'
import { Row } from './Row.js'
import { ColumnHeader } from './ColumnHeader.js'
import { GridCell } from './GridCell.js'
import './DatePickerGrid.css'

export class DatePickerGrid extends Grid
{
  static class = 'DatePickerGrid'

  render() {
    const props = this.props
    const start = props.start
    const end = props.interval?.end
    const weeks = []
    let day = props.month.startOf('month').startOf('week')
    let i, j, week
    for(i = 0; i < 6; i++) {
      weeks.push(week = [])
      for(j = 0; j < 7; j++) {
        week.push(day)
        day = day.plus({ days : 1 })
      }
    }
    return [
      new RowGroup(
        new Row(weeks[0].map(day => (
          new ColumnHeader(day.weekdayShort)
        ))),
      ),
      new RowGroup(weeks.map(week => new Row({
        key : week[0].toISODate(),
        children : week.map(day => {
          const value = day.toISODate()
          return new GridCell({
            key : value,
            value,
            selected : props.interval ?
              start <= day && day <= end :
              !!start?.hasSame(day, 'day'),
            current : day.hasSame(props.now, 'day') && 'date',
            classList : [
              start?.hasSame(day, 'day') && 'start',
              end?.hasSame(day, 'day') && 'end',
              !day.hasSame(props.month, 'month') && 'dim',
            ],
            children : day.day,
          })
        }),
      }))),
    ]
  }
}
