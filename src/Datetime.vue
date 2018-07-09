<template>
  <div class="vdatetime">
    <input class="vdatetime-input"
           :class="inputClass"
           :id="inputId"
           type="text"
           :value="inputValue"
           v-bind="$attrs"
           v-on="$listeners"
           @click="open"
           @focus="open">
    <input v-if="hiddenName" type="hidden" :name="hiddenName" :value="value">
    <transition-group name="vdatetime-fade" tag="div">
      <div key="overlay" v-if="isOpen" class="vdatetime-overlay" @click.self="cancel"></div>
      <datetime-popup
          key="popup"
          v-if="isOpen"
          :type="type"
          :datetime="popupDate"
          :phrases="phrases"
          :use12-hour="use12Hour"
          :hour-step="hourStep"
          :minute-step="minuteStep"
          :min-datetime="popupMinDatetime"
          :max-datetime="popupMaxDatetime"
          @confirm="confirm"
          @cancel="cancel"
          :auto="auto"
          :week-start="weekStart"></datetime-popup>
    </transition-group>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import DatetimePopup from './DatetimePopup'
import { datetimeFromISO, startOfDay, weekStart } from './util'

export default {
  components: {
    DatetimePopup
  },

  props: {
    value: {
      type: String
    },
    valueZone: {
      type: String,
      default: 'UTC'
    },
    inputId: {
      type: String,
      default: ''
    },
    inputClass: {
      type: String,
      default: ''
    },
    hiddenName: {
      type: String
    },
    zone: {
      type: String,
      default: 'local'
    },
    format: {
      type: [Object, String],
      default: null
    },
    type: {
      type: String,
      default: 'date'
    },
    phrases: {
      type: Object,
      default () {
        return {
          cancel: 'Cancel',
          ok: 'Ok'
        }
      }
    },
    use12Hour: {
      type: Boolean,
      default: false
    },
    hourStep: {
      type: Number,
      default: 1
    },
    minuteStep: {
      type: Number,
      default: 1
    },
    minDatetime: {
      type: String,
      default: null
    },
    maxDatetime: {
      type: String,
      default: null
    },
    auto: {
      type: Boolean,
      default: false
    },
    weekStart: {
      type: Number,
      default () {
        return weekStart()
      }
    }
  },

  data () {
    return {
      isOpen: false,
      datetime: datetimeFromISO(this.value)
    }
  },

  watch: {
    value (newValue) {
      this.datetime = datetimeFromISO(newValue)
    }
  },

  created () {
    this.emitInput()
  },

  computed: {
    inputValue () {
      const format = this.format || (this.type === 'date' ? DateTime.DATE_MED : DateTime.DATETIME_MED)

      if (typeof format === 'string') {
        return this.datetime ? DateTime.fromISO(this.datetime).setZone(this.zone).toFormat(format) : ''
      } else {
        return this.datetime ? this.datetime.setZone(this.zone).toLocaleString(format) : ''
      }
    },
    popupDate () {
      return this.datetime ? this.datetime.setZone(this.zone) : this.newPopupDatetime()
    },
    popupMinDatetime () {
      return this.minDatetime ? DateTime.fromISO(this.minDatetime) : null
    },
    popupMaxDatetime () {
      return this.maxDatetime ? DateTime.fromISO(this.maxDatetime) : null
    }
  },

  methods: {
    emitInput () {
      let datetime = this.datetime ? this.datetime.setZone(this.valueZone) : null

      if (datetime && this.type === 'date') {
        datetime = startOfDay(datetime)
      }

      this.$emit('input', datetime ? datetime.toISO() : '')
    },
    open (event) {
      event.target.blur()

      this.isOpen = true
    },
    close () {
      this.isOpen = false
      this.$emit('close')
    },
    confirm (datetime) {
      this.datetime = datetime.toUTC()
      this.emitInput()
      this.close()
    },
    cancel () {
      this.close()
    },
    newPopupDatetime () {
      const datetime = DateTime.utc().setZone(this.zone).set({ seconds: 0, milliseconds: 0 })

      if (this.minuteStep === 1) {
        return datetime
      }

      const roundedMinute = Math.round(datetime.minute / this.minuteStep) * this.minuteStep

      if (roundedMinute === 60) {
        return datetime.plus({ hours: 1 }).set({ minute: 0 })
      }

      return datetime.set({ minute: roundedMinute })
    }
  }
}
</script>

<style>
.vdatetime-fade-enter-active,
.vdatetime-fade-leave-active {
  transition: opacity .4s;
}

.vdatetime-fade-enter,
.vdatetime-fade-leave-to {
  opacity: 0;
}

.vdatetime-overlay {
  z-index: 999;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  transition: opacity .5s;
}
</style>
