// Vue
import Vue from 'vue'
import Datetime from '../../src'

Vue.use(Datetime)

new Vue({
  el: '#app',

  data () {
    return {
      date: '2017-09-25',
      dateRange: ['2017-09-25', '2017-10-01'],
      time: '20:40',
      datetime: '2017-09-25T16:30:00Z',
      dateEmpty: ''
    }
  }
})

// App
require('./app.scss')
