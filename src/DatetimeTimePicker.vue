<template>
  <div :class="{'vdatetime-time-picker': true, 'vdatetime-time-picker__with-suffix': use12Hour}">
    <div class="vdatetime-time-picker__list vdatetime-time-picker__list--hours" ref="hourList">
      <div class="vdatetime-time-picker__item" v-for="hour in hours" @click="selectHour(hour)" :class="{'vdatetime-time-picker__item--selected': hour.selected, 'vdatetime-time-picker__item--disabled': hour.disabled}">{{ formatHour(hour.number) }}</div>
    </div>
    <div class="vdatetime-time-picker__list vdatetime-time-picker__list--minutes" ref="minuteList">
      <div class="vdatetime-time-picker__item" v-for="minute in minutes" @click="selectMinute(minute)" :class="{'vdatetime-time-picker__item--selected': minute.selected, 'vdatetime-time-picker__item--disabled': minute.disabled}">{{ minute.number }}</div>
    </div>
    <div class="vdatetime-time-picker__list vdatetime-time-picker__list--suffix" ref="suffixList" v-if="use12Hour">
      <div class="vdatetime-time-picker__item" @click="selectSuffix('am')" :class="{'vdatetime-time-picker__item--selected': hour < 12}">am</div>
      <div class="vdatetime-time-picker__item" @click="selectSuffix('pm')" :class="{'vdatetime-time-picker__item--selected': hour >= 12}">pm</div>
    </div>
  </div>
</template>

<script>
import { hours, minutes, pad, timeComponentIsDisabled } from './util'

export default {
  props: {
    hour: {
      type: Number,
      required: true
    },
    minute: {
      type: Number,
      required: true
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
    minTime: {
      type: String,
      default: null
    },
    maxTime: {
      type: String,
      default: null
    }
  },

  computed: {
    hours () {
      return hours(this.hourStep).filter(hour => {
        if (!this.use12Hour) {
          return true
        } else {
          if (this.hour < 12) {
            return hour < 12
          } else {
            return hour >= 12
          }
        }
      }).map(hour => ({
        number: pad(hour),
        selected: hour === this.hour,
        disabled: timeComponentIsDisabled(this.minHour, this.maxHour, hour)
      }))
    },
    minutes () {
      return minutes(this.minuteStep).map(minute => ({
        number: pad(minute),
        selected: minute === this.minute,
        disabled: timeComponentIsDisabled(this.minMinute, this.maxMinute, minute)
      }))
    },
    minHour () {
      return this.minTime ? parseInt(this.minTime.split(':')[0]) : null
    },
    minMinute () {
      return this.minTime && this.minHour === this.hour ? parseInt(this.minTime.split(':')[1]) : null
    },
    maxHour () {
      return this.maxTime ? parseInt(this.maxTime.split(':')[0]) : null
    },
    maxMinute () {
      return this.maxTime && this.maxHour === this.hour ? parseInt(this.maxTime.split(':')[1]) : null
    }
  },

  methods: {
    selectHour (hour) {
      if (hour.disabled) {
        return
      }

      this.$emit('change', { hour: parseInt(hour.number) })
    },
    selectMinute (minute) {
      if (minute.disabled) {
        return
      }

      this.$emit('change', { minute: parseInt(minute.number) })
    },
    selectSuffix (suffix) {
      if (suffix === 'am') {
        if (this.hour >= 12) {
          this.$emit('change', { hour: parseInt(this.hour - 12), suffixTouched: true })
        }
      }
      if (suffix === 'pm') {
        if (this.hour < 12) {
          this.$emit('change', { hour: parseInt(this.hour + 12), suffixTouched: true })
        }
      }
    },
    formatHour (hour) {
      const numHour = Number(hour)
      if (this.use12Hour) {
        if (numHour === 0) {
          return 12
        }
        if (numHour > 12) {
          return numHour - 12
        }
        return numHour
      }
      return hour
    }
  },

  mounted () {
    const selectedHour = this.$refs.hourList.querySelector('.vdatetime-time-picker__item--selected')
    const selectedMinute = this.$refs.minuteList.querySelector('.vdatetime-time-picker__item--selected')
    this.$refs.hourList.scrollTop = selectedHour ? selectedHour.offsetTop - 250 : 0
    this.$refs.minuteList.scrollTop = selectedMinute ? selectedMinute.offsetTop - 250 : 0
  }
}
</script>

<style>
.vdatetime-time-picker {
  box-sizing: border-box;

  &::after {
    content: '';
    display: table;
    clear: both;
  }

  & * {
    box-sizing: border-box;
  }
}

.vdatetime-time-picker__list {
  float: left;
  width: 50%;
  height: 305px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: #efefef;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
  }
}

.vdatetime-time-picker__with-suffix .vdatetime-time-picker__list {
  width: 33.3%;
}

.vdatetime-time-picker__item {
  padding: 10px 0;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  transition: font-size .3s;
}

.vdatetime-time-picker__item:hover {
  font-size: 32px;
}

.vdatetime-time-picker__item--selected {
  color: #3f51b5;
  font-size: 32px;
}

.vdatetime-time-picker__item--disabled {
  opacity: 0.4;
  cursor: default;
  font-size: 20px !important;
}
</style>
