import Vue from 'vue'
import { DateTime as LuxonDateTime } from 'luxon'
import Datetime from '../../dist/vue-datetime'
import '../../dist/vue-datetime.css'
import './app.css'

Vue.use(Datetime)

new Vue({
  el: '#app',

  data () {
    return {
      time: '19:06',
      date: '2018-05-12T00:00:00.000Z',
      datetime: '2018-05-12T17:19:06.151Z',
      datetime12: '2018-05-12T17:19:06.151Z',
      datetime13: '2018-05-12T17:19:06.151Z',
      datetimeEmpty: '',
      minDatetime: LuxonDateTime.local().minus({
        month: 1,
        days: 3
      }).toISO(),
      maxDatetime: LuxonDateTime.local().plus({
        days: 3
      }).toISO(),
      datetimeDisabledChecker: (year, month, day, hour, minute, second) => {
        const invalidDatetimes = [
          [LuxonDateTime.local().minus({
            days: 8
          }), LuxonDateTime.local().minus({
            days: 6
          })],
          [LuxonDateTime.local().minus({
            days: 3
          }), LuxonDateTime.local().minus({
            days: 2,
            hours: 12
          })]
        ]
        const dateToCheck = LuxonDateTime.fromObject({
          year,
          month,
          day,
          hour,
          minute,
          second,
          zone: 'UTC'
        })

        const res = invalidDatetimes.reduce((acc, val) => {
          // if still false check otherwise its already invalid
          if (!acc) {
            const startDateObject = {
              zone: 'UTC'
            }
            const endDateObject = {
              zone: 'UTC'
            }
            let startDate = val[0]
            let endDate = val[1]

            const dateOptions = ['year', 'month']
            if (day != null) {
              dateOptions.push('day')
            }
            if (minute != null) {
              dateOptions.push('minute')
            }
            if (hour != null) {
              dateOptions.push('hour')
            }

            dateOptions.map(option => {
              startDateObject[option] = startDate.c[option]
            })
            dateOptions.map(option => {
              endDateObject[option] = endDate.c[option]
            })
            startDate = LuxonDateTime.fromObject(startDateObject)
            endDate = LuxonDateTime.fromObject(endDateObject)

            acc = (dateToCheck > startDate) && (dateToCheck < endDate)
          }
          return acc
        }, false)
        return res
      },
      datetimeTheming: LuxonDateTime.local().toISO()
    }
  }
})
