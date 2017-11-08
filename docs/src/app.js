// Vue
import Vue from 'vue'
import moment from 'moment'
import Datetime from '../../src'

Vue.use(Datetime)

new Vue({
  el: '#app',

  data () {
    return {
      date: '2017-09-25',
      time: '20:40',

      datetime: '2017-09-25T16:30:00Z',

      dateEmpty: '',
      disabledDates: ['2017-09-07', ['2017-09-25', '2017-10-05']],
      maxDate: moment().add(2, 'month').toISOString(),
      minDate: moment().subtract(2, 'month').toISOString(),

      dateStyle: new Date().toISOString()
    }
  }
})

// App
require('./app.scss')
