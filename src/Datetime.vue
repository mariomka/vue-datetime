<template>
  <div class="vdatetime">
    <input class="vdatetime-input"
           type="text"
           :value="inputValue"
           v-bind="$attrs"
           v-on="$listeners"
           @click="open"
           @focus="open">
    <transition-group name="vdatetime-fade" tag="div">
        <div key="overlay" v-if="isOpen" class="vdatetime-overlay" @click.self="cancel"></div>
        <datetime-popup key="popup" v-if="isOpen":type="type" :datetime="popupDate" @confirm="confirm" @cancel="cancel"></datetime-popup>
    </transition-group>
  </div>
</template>

<script>
  import { DateTime } from 'luxon'
  import DatetimePopup from './DatetimePopup'

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
      zone: {
        type: String,
        default: 'local'
      },
      format: {
        type: Object
      },
      type: {
        type: String,
        default: 'date'
      }
    },

    data () {
      const date = DateTime.fromISO(this.value).toUTC()

      return {
        isOpen: false,
        date: date.isValid ? date : null
      }
    },

    created () {
      this.emitInput()
    },

    computed: {
      inputValue () {
        const format = this.format || (this.type === 'date' ? DateTime.DATE_MED : DateTime.DATETIME_MED)

        return this.date ? this.date.setZone(this.zone).toLocaleString(format) : ''
      },
      popupDate () {
        return this.date ? this.date : DateTime.local()
      }
    },

    methods: {
      emitInput () {
        this.$emit('input', this.date ? this.date.setZone(this.valueZone).toISO() : null)
      },
      open () {
        this.isOpen = true
      },
      close () {
        this.isOpen = false
      },
      confirm (datetime) {
        this.date = datetime
        this.emitInput()
        this.close()
      },
      cancel () {
        this.close()
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
