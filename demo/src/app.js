import Vue from 'vue'
import Datetime from '../../dist/vue-datetime'
import '../../dist/vue-datetime.css'
import './app.css'

Vue.use(Datetime)

new Vue({
  el: '#app',

  data () {
    return {
      datetime: '2018-05-12T17:19:06.151+01:00'
    }
  }
})

