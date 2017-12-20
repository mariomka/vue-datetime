<template>
  <div class="vdatetime-popup">
    <div class="vdatetime-popup__header">
      <div class="vdatetime-popup__year">{{ year }}</div>
      <div class="vdatetime-popup__date">{{ dateFormatted }}</div>
    </div>
    <div class="vdatetime-popup__body">
      <datetime-calendar v-if="step === 'date'" @change="onChangeDate" :year="year" :month="month" :day="day"></datetime-calendar>
      <datetime-time-picker v-if="step === 'time'" @change="onChangeTime" :hour="hour" :minute="minute"></datetime-time-picker>
    </div>
    <div class="vdatetime-popup__actions">
      <div class="vdatetime-popup__actions__button vdatetime-popup__actions__button--cancel" @click="cancel">{{ i18n.cancel }}</div>
      <div class="vdatetime-popup__actions__button vdatetime-popup__actions__button--confirm" @click="confirm">{{ i18n.ok }}</div>
    </div>
  </div>
</template>

<script>
  import { DateTime } from 'luxon'
  import DatetimeCalendar from './DatetimeCalendar'
  import DatetimeTimePicker from './DatetimeTimePicker'

  export default {
    components: {
      DatetimeCalendar,
      DatetimeTimePicker
    },

    props: {
      datetime: {
        type: DateTime,
        required: true
      },
      i18n: {
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
      }
    },

    data () {
      return {
        newDatetime: this.datetime,
        step: 'date'
      }
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
      }
    },

    methods: {
      nextStep () {
        if (this.type === 'datetime' && this.step === 'date') {
          this.step = 'time'

          return
        }

        this.step = 'end'
      },
      confirm () {
        this.nextStep()

        if (this.step === 'end') {
          this.$emit('confirm', this.newDatetime)
        }
      },
      cancel () {
        this.$emit('cancel')
      },
      onChangeDate (year, month, day) {
        this.newDatetime = this.newDatetime.set({ year, month, day })
      },
      onChangeTime (hour, minute) {
        this.newDatetime = this.newDatetime.set({ hour, minute })
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
    background: #fff;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    & * {
      box-sizing: border-box;
    }
  }

  .vdatetime-popup__header {
    padding: 15px 30px;
    background: #3f51b5;
    color: #fff;
    font-size: 32px;
  }

  .vdatetime-popup__year {
    display: block;
    font-weight: 300;
    font-size: 14px;
    opacity: 0.7;
    cursor: pointer;
    transition: opacity .3s;

    &:hover {
      opacity: 1;
    }
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
