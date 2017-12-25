<template>
  <div class="vdatetime-time-picker">
    <div class="vdatetime-time-picker__list vdatetime-time-picker__list--hours" ref="hourList">
      <div class="vdatetime-time-picker__item" v-for="hour in hours" @click="selectHour(hour.number)" :class="{'vdatetime-time-picker__item--selected': hour.selected}">{{ hour.number }}</div>
    </div>
    <div class="vdatetime-time-picker__list vdatetime-time-picker__list--minutes" ref="minuteList">
      <div class="vdatetime-time-picker__item" v-for="minute in minutes" @click="selectMinute(minute.number)" :class="{'vdatetime-time-picker__item--selected': minute.selected}">{{ minute.number }}</div>
    </div>
  </div>
</template>

<script>
  import { hours, minutes, pad } from './util'

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
      hourStep: {
        type: Number,
        default: 1
      },
      minuteStep: {
        type: Number,
        default: 1
      }
    },

    computed: {
      hours () {
        return hours(this.hourStep).map(hour => ({
          number: pad(hour),
          selected: hour === this.hour
        }))
      },
      minutes () {
        return minutes(this.minuteStep).map(minute => ({
          number: pad(minute),
          selected: minute === this.minute
        }))
      }
    },

    methods: {
      selectHour (hour) {
        this.$emit('change', parseInt(hour), this.minute)
      },
      selectMinute (minute) {
        this.$emit('change', this.hour, parseInt(minute))
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
</style>
