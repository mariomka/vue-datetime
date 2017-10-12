import DateTypeFlow from './DateTypeFlow'
import DatetimeTypeFlow from './DatetimeTypeFlow'
import TimeTypeFlow from './TimeTypeFlow'

export default function (type, component, date) {
  let typeFlow

  switch (type) {
    case 'datetime':
      typeFlow = new DatetimeTypeFlow(component, date)
      break
    case 'time':
      typeFlow = new TimeTypeFlow(component, date)
      break
    case 'date':
    default:
      typeFlow = new DateTypeFlow(component, date)
      break
  }

  return typeFlow
}
