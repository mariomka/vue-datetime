// Vue
import Vue from 'vue'
import DatetimePicker from '../../src'

Vue.use(DatetimePicker)

new Vue({
  el: '#app',

  data () {
    return {
      date: '2017-09-25',
      datetime: '2017-09-25T16:30:00Z',
      dateEmpty: ''
    }
  }
})

// App
require('./app.scss')
