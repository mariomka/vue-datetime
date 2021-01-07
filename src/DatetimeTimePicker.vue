<template>
  <div :class="{'vdatetime-time-picker': true, 'vdatetime-time-picker__with-suffix': use12Hour}">
    <div class="vdatetime-time-picker__list vdatetime-time-picker__list--hours" ref="hourList">
      <div class="vdatetime-time-picker__item" v-for="hour in displayedHours" @click="selectHour(hour)" :class="{'vdatetime-time-picker__item--selected': hour.selected, 'vdatetime-time-picker__item--disabled': hour.disabled}">{{ formatHour(hour.number) }}</div>
    </div>
    <div class="vdatetime-time-picker__list vdatetime-time-picker__list--minutes" ref="minuteList">
      <div class="vdatetime-time-picker__item" v-for="minute in minutes" @click="selectMinute(minute)" :class="{'vdatetime-time-picker__item--selected': minute.selected, 'vdatetime-time-picker__item--disabled': minute.disabled}">{{ minute.number }}</div>
    </div>
    <div
      class="vdatetime-time-picker__list vdatetime-time-picker__list--suffix"
      ref="suffixList"
      v-if="use12Hour"
    >
      <div
        class="vdatetime-time-picker__item"
        v-for="timeSelection in timeSelections"
        :key="`selection-${timeSelection.id}`"
        @click="selectSuffix(timeSelection)"
        :class="{'vdatetime-time-picker__item--selected': timeSelection.comparison(hour) , 'vdatetime-time-picker__item--disabled': timeSelection.disabled }"
      >{{ timeSelection.id }}</div>
    </div>
  </div>
</template>

<script>
import { hours, minutes, pad, timeComponentIsDisabled, selectionIsDisabled } from './util'
import { DateTime } from 'luxon'

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
    datetimeDisabledChecker: {
      type: Function,
      default: (year, month, day, hour, minute, second) => false
    },
    currentDateTime: {
      type: DateTime,
      default: () => DateTime.utc()
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
    timeSelections () {
      return this.use12Hour
        ? [
          {
            id: 'am',
            comparison: (hour) => hour < 12,
            disabled: selectionIsDisabled(this.hours, this.use12Hour, 'am')
          },
          {
            id: 'pm',
            comparison: (hour) => hour >= 12,
            disabled: selectionIsDisabled(this.hours, this.use12Hour, 'pm')
          }
        ]
        : []
    },
    displayedHours () {
      return this.hours.filter(hour => hour.display)
    },
    hours () {
      const year = this.currentDateTime.c.year
      const month = this.currentDateTime.c.month
      const day = this.currentDateTime.c.day
      return hours(this.hourStep).map(hour => {
        let isVisible = true
        if (this.use12Hour) {
          if (this.hour < 12) {
            isVisible = hour < 12
          } else {
            isVisible = hour >= 12
          }
        }
        return {
          number: pad(hour),
          display: isVisible,
          selected: hour === this.hour,
          disabled: timeComponentIsDisabled(this.minHour, this.maxHour, hour) || this.datetimeDisabledChecker(year, month, day, hour)
        }
      })
    },
    minutes () {
      const year = this.currentDateTime.c.year
      const month = this.currentDateTime.c.month
      const day = this.currentDateTime.c.day
      return minutes(this.minuteStep).map(minute => ({
        number: pad(minute),
        selected: minute === this.minute,
        disabled: timeComponentIsDisabled(this.minMinute, this.maxMinute, minute) || this.datetimeDisabledChecker(year, month, day, this.hour, minute)
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
      if (suffix.disabled) {
        return
      }
      if (suffix.id === 'am') {
        if (this.hour >= 12) {
          this.$emit('change', { hour: parseInt(this.hour - 12), suffixTouched: true })
        }
      }
      if (suffix.id === 'pm') {
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
  -webkit-overflow-scrolling: touch;

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
