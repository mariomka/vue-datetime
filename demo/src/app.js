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
      minDatetime: LuxonDateTime.local().minus({ month: 1, days: 3 }).toISO(),
      maxDatetime: LuxonDateTime.local().plus({ days: 3 }).toISO(),
      datetimeTheming: LuxonDateTime.local().toISO()
    }
  }
})

