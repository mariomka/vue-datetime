<template>
  <div class="vdatetime-popup">
    <div class="vdatetime-popup__header">
      <div class="vdatetime-popup__title" v-if="title">{{ title }}</div>
      <div class="vdatetime-popup__year" @click="showYear" v-if="type !== 'time'">{{ year }}</div>
      <div class="vdatetime-popup__date" @click="showMonth" v-if="type !== 'time'">{{ dateFormatted }}</div>
    </div>
    <div class="vdatetime-popup__body">
      <datetime-year-picker
          v-if="step === 'year'"
          @change="onChangeYear"
          :min-date="minDatetimeUTC"
          :max-date="maxDatetimeUTC"
          :year="year"></datetime-year-picker>
      <datetime-month-picker
          v-if="step === 'month'"
          @change="onChangeMonth"
          :min-date="minDatetimeUTC"
          :max-date="maxDatetimeUTC"
          :year="year"
          :month="month"></datetime-month-picker>
      <datetime-calendar
          v-if="step === 'date'"
          @change="onChangeDate"
          :year="year"
          :month="month"
          :day="day"
          :min-date="minDatetimeUTC"
          :max-date="maxDatetimeUTC"
          :week-start="weekStart"
      ></datetime-calendar>
      <datetime-time-picker
          v-if="step === 'time'"
          @change="onChangeTime"
          :hour="hour"
          :minute="minute"
          :use12-hour="use12Hour"
          :hour-step="hourStep"
          :minute-step="minuteStep"
          :min-time="minTime"
          :max-time="maxTime"></datetime-time-picker>
    </div>
    <div class="vdatetime-popup__actions">
      <div class="vdatetime-popup__actions__button vdatetime-popup__actions__button--cancel" @click="cancel">
        <slot name="button-cancel__internal" v-bind:step="step">{{ phrases.cancel }}</slot>
      </div>
      <div class="vdatetime-popup__actions__button vdatetime-popup__actions__button--confirm" @click="confirm">
        <slot name="button-confirm__internal" v-bind:step="step">{{ phrases.ok }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import { createFlowManager, createFlowManagerFromType } from './util'
import DatetimeCalendar from './DatetimeCalendar'
import DatetimeTimePicker from './DatetimeTimePicker'
import DatetimeYearPicker from './DatetimeYearPicker'
import DatetimeMonthPicker from './DatetimeMonthPicker'

const KEY_TAB = 9
const KEY_ENTER = 13
const KEY_ESC = 27

export default {
  components: {
    DatetimeCalendar,
    DatetimeTimePicker,
    DatetimeYearPicker,
    DatetimeMonthPicker
  },

  props: {
    datetime: {
      type: DateTime,
      required: true
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
    type: {
      type: String,
      default: 'date'
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
      type: DateTime,
      default: null
    },
    maxDatetime: {
      type: DateTime,
      default: null
    },
    auto: {
      type: Boolean,
      default: false
    },
    weekStart: {
      type: Number,
      default: 1
    },
    flow: {
      type: Array
    },
    title: {
      type: String
    }
  },

  data () {
    const flowManager = this.flow
      ? createFlowManager(this.flow)
      : createFlowManagerFromType(this.type)

    return {
      newDatetime: this.datetime,
      flowManager,
      step: flowManager.first(),
      timePartsTouched: []
    }
  },

  created () {
    document.addEventListener('keydown', this.onKeyDown)
  },

  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeyDown)
  },

  computed: {
    year () {
      return this.newDatetime.year
    },
    month () {
      return this.newDatetime.month
    },
    day () {
      return this.newDatetime.day
    },
    hour () {
      return this.newDatetime.hour
    },
    minute () {
      return this.newDatetime.minute
    },
    dateFormatted () {
      return this.newDatetime.toLocaleString({
        month: 'long',
        day: 'numeric'
      })
    },
    minDatetimeUTC () {
      return this.minDatetime ? this.minDatetime.toUTC() : null
    },
    maxDatetimeUTC () {
      return this.maxDatetime ? this.maxDatetime.toUTC() : null
    },
    minTime () {
      return (
        this.minDatetime &&
        this.minDatetime.year === this.year &&
        this.minDatetime.month === this.month &&
        this.minDatetime.day === this.day
      ) ? this.minDatetime.toFormat('HH:mm') : null
    },
    maxTime () {
      return (
        this.maxDatetime &&
        this.maxDatetime.year === this.year &&
        this.maxDatetime.month === this.month &&
        this.maxDatetime.day === this.day
      ) ? this.maxDatetime.toFormat('HH:mm') : null
    }
  },

  methods: {
    nextStep () {
      this.step = this.flowManager.next(this.step)
      this.timePartsTouched = []

      if (this.step === 'end') {
        this.$emit('confirm', this.newDatetime)
      }
    },
    showYear () {
      this.step = 'year'
      this.flowManager.diversion('date')
    },
    showMonth () {
      this.step = 'month'
      this.flowManager.diversion('date')
    },
    confirm () {
      this.nextStep()
    },
    cancel () {
      this.$emit('cancel')
    },
    onChangeYear (year) {
      this.newDatetime = this.newDatetime.set({ year })

      if (this.auto) {
        this.nextStep()
      }
    },
    onChangeMonth (month) {
      this.newDatetime = this.newDatetime.set({ month })

      if (this.auto) {
        this.nextStep()
      }
    },
    onChangeDate (year, month, day) {
      this.newDatetime = this.newDatetime.set({ year, month, day })

      if (this.auto) {
        this.nextStep()
      }
    },
    onChangeTime ({ hour, minute, suffixTouched }) {
      if (suffixTouched) {
        this.timePartsTouched['suffix'] = true
      }

      if (Number.isInteger(hour)) {
        this.newDatetime = this.newDatetime.set({ hour })
        this.timePartsTouched['hour'] = true
      }

      if (Number.isInteger(minute)) {
        this.newDatetime = this.newDatetime.set({ minute })
        this.timePartsTouched['minute'] = true
      }

      const goNext = this.auto && this.timePartsTouched['hour'] && this.timePartsTouched['minute'] && (
        this.timePartsTouched['suffix'] ||
        !this.use12Hour
      )

      if (goNext) {
        this.nextStep()
      }
    },
    onKeyDown (event) {
      switch (event.keyCode) {
        case KEY_ESC:
        case KEY_TAB:
          this.cancel()
          break

        case KEY_ENTER:
          this.nextStep()
          break
      }
    }
  }
}
</script>

<style>
.vdatetime-popup {
  box-sizing: border-box;
  z-index: 1000;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 340px;
  max-width: calc(100% - 30px);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
  color: #444;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  line-height: 1.18;
  background: #fff;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  & * {
    box-sizing: border-box;
  }
}

.vdatetime-popup__header {
  padding: 18px 30px;
  background: #3f51b5;
  color: #fff;
  font-size: 32px;
}

.vdatetime-popup__title {
  margin-bottom: 8px;
  font-size: 21px;
  font-weight: 300;
}

.vdatetime-popup__year {
  font-weight: 300;
  font-size: 14px;
  opacity: 0.7;
  cursor: pointer;
  transition: opacity .3s;

  &:hover {
    opacity: 1;
  }
}

.vdatetime-popup__date {
  line-height: 1;
  cursor: pointer;
}

.vdatetime-popup__actions {
  padding: 0 20px 10px 30px;
  text-align: right;
}

.vdatetime-popup__actions__button {
  display: inline-block;
  border: none;
  padding: 10px 20px;
  background: transparent;
  font-size: 16px;
  color: #3f51b5;
  cursor: pointer;
  transition: color .3s;

  &:hover {
    color: #444;
  }
}
</style>
