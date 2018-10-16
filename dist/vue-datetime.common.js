/*!
 * vue-datetime v1.0.0-beta.6
 * (c) 2018 Mario Juárez
 * Released under the MIT License.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var luxon = require('luxon');

var FlowManager = function FlowManager (flow, endStatus) {
  if ( flow === void 0 ) flow = [];
  if ( endStatus === void 0 ) endStatus = null;

  this.flow = flow;
  this.endStatus = endStatus;
  this.diversionNext = null;
};

FlowManager.prototype.step = function step (index) {
  return this.flow.length > index ? this.flow[index] : this.endStatus
};

FlowManager.prototype.first = function first () {
  return this.step(0)
};

FlowManager.prototype.next = function next (current) {
  if (this.diversionNext) {
    var next = this.diversionNext;
    this.diversionNext = null;

    return next
  }

  return this.step(this.flow.indexOf(current) + 1)
};

FlowManager.prototype.diversion = function diversion (next) {
  this.diversionNext = next;
};

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function datetimeFromISO (string) {
  var datetime = luxon.DateTime.fromISO(string).toUTC();

  return datetime.isValid ? datetime : null
}

function monthDays (year, month, weekStart) {
  var monthDate = luxon.DateTime.local(year, month, 1);
  var firstDay = monthDate.weekday - weekStart;

  if (firstDay < 0) {
    firstDay += 7;
  }
  var lastDay = (weekStart - monthDate.weekday - monthDate.daysInMonth) % 7;
  if (lastDay < 0) {
    lastDay += 7;
  }

  return new Array(monthDate.daysInMonth + firstDay + lastDay)
    .fill(null)
    .map(function (value, index) { return (index + 1 <= firstDay || index >= firstDay + monthDate.daysInMonth) ? null : (index + 1 - firstDay); }
    )
}

function monthDayIsDisabled (minDate, maxDate, year, month, day) {
  var date = luxon.DateTime.fromObject({ year: year, month: month, day: day });

  minDate = minDate ? startOfDay(minDate) : null;
  maxDate = maxDate ? startOfDay(maxDate) : null;

  return (minDate && date < minDate) ||
         (maxDate && date > maxDate)
}

function timeComponentIsDisabled (min, max, component) {
  return (min && component < min) ||
         (max && component > max)
}

function weekdays (weekStart) {
  if (--weekStart < 0) {
    weekStart = 6;
  }

  var weekDays = luxon.Info.weekdays('short').map(function (weekday) { return capitalize(weekday); });

  weekDays = weekDays.concat(weekDays.splice(0, weekStart));

  return weekDays
}

function months () {
  return luxon.Info.months().map(function (month) { return capitalize(month); })
}

function hours (step) {
  return new Array(Math.ceil(24 / step)).fill(null).map(function (item, index) { return index * step; })
}

function minutes (step) {
  return new Array(Math.ceil(60 / step)).fill(null).map(function (item, index) { return index * step; })
}

function years (current) {
  return new Array(201).fill(null).map(function (item, index) { return current - 100 + index; })
}

function pad (number) {
  return number < 10 ? '0' + number : number
}

function startOfDay (datetime) {
  return datetime.startOf('day')
}

function createFlowManagerFromType (type) {
  var flow = [];

  switch (type) {
    case 'datetime':
      flow = ['date', 'time'];
      break
    default:
      flow = ['date'];
  }

  return new FlowManager(flow, 'end')
}

function weekStart () {
  var weekstart;

  try {
    weekstart = require('weekstart');
  } catch (e) {
    weekstart = window.weekstart;
  }

  var firstDay = weekstart ? weekstart.getWeekStartByLocale(luxon.Settings.defaultLocale) : 1;

  return firstDay === 0 ? 7 : firstDay
}

var DatetimeCalendar = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vdatetime-calendar"},[_c('div',{staticClass:"vdatetime-calendar__navigation"},[_c('div',{staticClass:"vdatetime-calendar__navigation--previous",on:{"click":_vm.previousMonth}},[_c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 61.3 102.8"}},[_c('path',{attrs:{"fill":"none","stroke":"#444","stroke-width":"14","stroke-miterlimit":"10","d":"M56.3 97.8L9.9 51.4 56.3 5"}})])]),_vm._v(" "),_c('div',{staticClass:"vdatetime-calendar__current--month"},[_vm._v(_vm._s(_vm.monthName)+" "+_vm._s(_vm.newYear))]),_vm._v(" "),_c('div',{staticClass:"vdatetime-calendar__navigation--next",on:{"click":_vm.nextMonth}},[_c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 61.3 102.8"}},[_c('path',{attrs:{"fill":"none","stroke":"#444","stroke-width":"14","stroke-miterlimit":"10","d":"M56.3 97.8L9.9 51.4 56.3 5"}})])])]),_vm._v(" "),_c('div',{staticClass:"vdatetime-calendar__month"},[_vm._l((_vm.weekdays),function(weekday){return _c('div',{staticClass:"vdatetime-calendar__month__weekday"},[_vm._v(_vm._s(weekday))])}),_vm._v(" "),_vm._l((_vm.days),function(day){return _c('div',{staticClass:"vdatetime-calendar__month__day",class:{'vdatetime-calendar__month__day--selected': day.selected, 'vdatetime-calendar__month__day--disabled': day.disabled},on:{"click":function($event){_vm.selectDay(day);}}},[_c('span',[_c('span',[_vm._v(_vm._s(day.number))])])])})],2)])},staticRenderFns: [],
  props: {
    year: {
      type: Number,
      required: true
    },
    month: {
      type: Number,
      required: true
    },
    day: {
      type: Number,
      default: null
    },
    disabled: {
      type: Array
    },
    minDate: {
      type: luxon.DateTime,
      default: null
    },
    maxDate: {
      type: luxon.DateTime,
      default: null
    },
    weekStart: {
      type: Number,
      default: 1
    }
  },

  data: function data () {
    return {
      newDate: luxon.DateTime.fromObject({ year: this.year, month: this.month, timeZone: 'UTC' }),
      weekdays: weekdays(this.weekStart),
      months: months()
    }
  },

  computed: {
    newYear: function newYear () {
      return this.newDate.year
    },
    newMonth: function newMonth () {
      return this.newDate.month
    },
    monthName: function monthName () {
      return this.months[this.newMonth - 1]
    },
    days: function days () {
      var this$1 = this;

      return monthDays(this.newYear, this.newMonth, this.weekStart).map(function (day) { return ({
        number: day,
        selected: day && this$1.year === this$1.newYear && this$1.month === this$1.newMonth && this$1.day === day,
        disabled: !day || monthDayIsDisabled(this$1.minDate, this$1.maxDate, this$1.newYear, this$1.newMonth, day)
      }); })
    }
  },

  methods: {
    selectDay: function selectDay (day) {
      if (day.disabled) {
        return
      }

      this.$emit('change', this.newYear, this.newMonth, day.number);
    },
    previousMonth: function previousMonth () {
      this.newDate = this.newDate.minus({ months: 1 });
    },
    nextMonth: function nextMonth () {
      this.newDate = this.newDate.plus({ months: 1 });
    }
  }
};

var DatetimeTimePicker = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:{'vdatetime-time-picker': true, 'vdatetime-time-picker__with-suffix': _vm.use12Hour}},[_c('div',{ref:"hourList",staticClass:"vdatetime-time-picker__list vdatetime-time-picker__list--hours"},_vm._l((_vm.hours),function(hour){return _c('div',{staticClass:"vdatetime-time-picker__item",class:{'vdatetime-time-picker__item--selected': hour.selected, 'vdatetime-time-picker__item--disabled': hour.disabled},on:{"click":function($event){_vm.selectHour(hour);}}},[_vm._v(_vm._s(_vm.formatHour(hour.number)))])})),_vm._v(" "),_c('div',{ref:"minuteList",staticClass:"vdatetime-time-picker__list vdatetime-time-picker__list--minutes"},_vm._l((_vm.minutes),function(minute){return _c('div',{staticClass:"vdatetime-time-picker__item",class:{'vdatetime-time-picker__item--selected': minute.selected, 'vdatetime-time-picker__item--disabled': minute.disabled},on:{"click":function($event){_vm.selectMinute(minute);}}},[_vm._v(_vm._s(minute.number))])})),_vm._v(" "),(_vm.use12Hour)?_c('div',{ref:"suffixList",staticClass:"vdatetime-time-picker__list vdatetime-time-picker__list--suffix"},[_c('div',{staticClass:"vdatetime-time-picker__item",class:{'vdatetime-time-picker__item--selected': _vm.hour < 12},on:{"click":function($event){_vm.selectSuffix('am');}}},[_vm._v("am")]),_vm._v(" "),_c('div',{staticClass:"vdatetime-time-picker__item",class:{'vdatetime-time-picker__item--selected': _vm.hour >= 12},on:{"click":function($event){_vm.selectSuffix('pm');}}},[_vm._v("pm")])]):_vm._e()])},staticRenderFns: [],
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
    hours: function hours$1 () {
      var this$1 = this;

      return hours(this.hourStep).filter(function (hour) {
        if (!this$1.use12Hour) {
          return true
        } else {
          if (this$1.hour < 12) {
            return hour < 12
          } else {
            return hour >= 12
          }
        }
      }).map(function (hour) { return ({
        number: pad(hour),
        selected: hour === this$1.hour,
        disabled: timeComponentIsDisabled(this$1.minHour, this$1.maxHour, hour)
      }); })
    },
    minutes: function minutes$1 () {
      var this$1 = this;

      return minutes(this.minuteStep).map(function (minute) { return ({
        number: pad(minute),
        selected: minute === this$1.minute,
        disabled: timeComponentIsDisabled(this$1.minMinute, this$1.maxMinute, minute)
      }); })
    },
    minHour: function minHour () {
      return this.minTime ? parseInt(this.minTime.split(':')[0]) : null
    },
    minMinute: function minMinute () {
      return this.minTime && this.minHour === this.hour ? parseInt(this.minTime.split(':')[1]) : null
    },
    maxHour: function maxHour () {
      return this.maxTime ? parseInt(this.maxTime.split(':')[0]) : null
    },
    maxMinute: function maxMinute () {
      return this.maxTime && this.maxHour === this.hour ? parseInt(this.maxTime.split(':')[1]) : null
    }
  },

  methods: {
    selectHour: function selectHour (hour) {
      if (hour.disabled) {
        return
      }

      this.$emit('change', { hour: parseInt(hour.number) });
    },
    selectMinute: function selectMinute (minute) {
      if (minute.disabled) {
        return
      }

      this.$emit('change', { minute: parseInt(minute.number) });
    },
    selectSuffix: function selectSuffix (suffix) {
      if (suffix === 'am') {
        if (this.hour >= 12) {
          this.$emit('change', { hour: parseInt(this.hour - 12), suffixTouched: true });
        }
      }
      if (suffix === 'pm') {
        if (this.hour < 12) {
          this.$emit('change', { hour: parseInt(this.hour + 12), suffixTouched: true });
        }
      }
    },
    formatHour: function formatHour (hour) {
      var numHour = Number(hour);
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

  mounted: function mounted () {
    var selectedHour = this.$refs.hourList.querySelector('.vdatetime-time-picker__item--selected');
    var selectedMinute = this.$refs.minuteList.querySelector('.vdatetime-time-picker__item--selected');
    this.$refs.hourList.scrollTop = selectedHour ? selectedHour.offsetTop - 250 : 0;
    this.$refs.minuteList.scrollTop = selectedMinute ? selectedMinute.offsetTop - 250 : 0;
  }
};

var DatetimeYearPicker = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vdatetime-year-picker"},[_c('div',{ref:"yearList",staticClass:"vdatetime-year-picker__list vdatetime-year-picker__list"},_vm._l((_vm.years),function(year){return _c('div',{staticClass:"vdatetime-year-picker__item",class:{'vdatetime-year-picker__item--selected': year.selected},on:{"click":function($event){_vm.select(year.number);}}},[_vm._v(_vm._s(year.number))])}))])},staticRenderFns: [],
  props: {
    year: {
      type: Number,
      required: true
    }
  },

  computed: {
    years: function years$1 () {
      var this$1 = this;

      return years(this.year).map(function (year) { return ({
        number: year,
        selected: year === this$1.year
      }); })
    }
  },

  methods: {
    select: function select (year) {
      this.$emit('change', parseInt(year));
    },

    scrollToCurrent: function scrollToCurrent () {
      var selectedYear = this.$refs.yearList.querySelector('.vdatetime-year-picker__item--selected');
      this.$refs.yearList.scrollTop = selectedYear ? selectedYear.offsetTop - 250 : 0;
    }
  },

  mounted: function mounted () {
    this.scrollToCurrent();
  },

  updated: function updated () {
    this.scrollToCurrent();
  }
};

var KEY_TAB = 9;
var KEY_ENTER = 13;
var KEY_ESC = 27;

var DatetimePopup = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vdatetime-popup"},[_c('div',{staticClass:"vdatetime-popup__header"},[_c('div',{staticClass:"vdatetime-popup__year",on:{"click":_vm.showYear}},[_vm._v(_vm._s(_vm.year))]),_vm._v(" "),_c('div',{staticClass:"vdatetime-popup__date"},[_vm._v(_vm._s(_vm.dateFormatted))])]),_vm._v(" "),_c('div',{staticClass:"vdatetime-popup__body"},[(_vm.step === 'year')?_c('datetime-year-picker',{attrs:{"year":_vm.year},on:{"change":_vm.onChangeYear}}):_vm._e(),_vm._v(" "),(_vm.step === 'date')?_c('datetime-calendar',{attrs:{"year":_vm.year,"month":_vm.month,"day":_vm.day,"min-date":_vm.minDatetime,"max-date":_vm.maxDatetime,"week-start":_vm.weekStart},on:{"change":_vm.onChangeDate}}):_vm._e(),_vm._v(" "),(_vm.step === 'time')?_c('datetime-time-picker',{attrs:{"hour":_vm.hour,"minute":_vm.minute,"use12-hour":_vm.use12Hour,"hour-step":_vm.hourStep,"minute-step":_vm.minuteStep,"min-time":_vm.minTime,"max-time":_vm.maxTime},on:{"change":_vm.onChangeTime}}):_vm._e()],1),_vm._v(" "),_c('div',{staticClass:"vdatetime-popup__actions"},[_c('div',{staticClass:"vdatetime-popup__actions__button vdatetime-popup__actions__button--clear",on:{"click":_vm.clear}},[_vm._v(_vm._s(_vm.phrases.clear))]),_vm._v(" "),_c('div',{staticClass:"vdatetime-popup__actions__button vdatetime-popup__actions__button--cancel",on:{"click":_vm.cancel}},[_vm._v(_vm._s(_vm.phrases.cancel))]),_vm._v(" "),_c('div',{staticClass:"vdatetime-popup__actions__button vdatetime-popup__actions__button--confirm",on:{"click":_vm.confirm}},[_vm._v(_vm._s(_vm.phrases.ok))])])])},staticRenderFns: [],
  components: {
    DatetimeCalendar: DatetimeCalendar,
    DatetimeTimePicker: DatetimeTimePicker,
    DatetimeYearPicker: DatetimeYearPicker
  },

  props: {
    datetime: {
      type: luxon.DateTime,
      required: true
    },
    phrases: {
      type: Object,
      default: function default$1 () {
        return {
          clear: 'Clear',
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
      type: luxon.DateTime,
      default: null
    },
    maxDatetime: {
      type: luxon.DateTime,
      default: null
    },
    auto: {
      type: Boolean,
      default: false
    },
    weekStart: {
      type: Number,
      default: 1
    }
  },

  data: function data () {
    var flow = createFlowManagerFromType(this.type);

    return {
      newDatetime: this.datetime,
      flow: flow,
      step: flow.first(),
      timePartsTouched: []
    }
  },

  created: function created () {
    document.addEventListener('keydown', this.onKeyDown);
  },

  beforeDestroy: function beforeDestroy () {
    document.removeEventListener('keydown', this.onKeyDown);
  },

  computed: {
    year: function year () {
      return this.newDatetime.year
    },
    month: function month () {
      return this.newDatetime.month
    },
    day: function day () {
      return this.newDatetime.day
    },
    hour: function hour () {
      return this.newDatetime.hour
    },
    minute: function minute () {
      return this.newDatetime.minute
    },
    dateFormatted: function dateFormatted () {
      return this.newDatetime.toLocaleString({
        month: 'long',
        day: 'numeric'
      })
    },
    minTime: function minTime () {
      return (
        this.minDatetime &&
        this.minDatetime.year === this.year &&
        this.minDatetime.month === this.month &&
        this.minDatetime.day === this.day
      ) ? this.minDatetime.toFormat('HH:mm') : null
    },
    maxTime: function maxTime () {
      return (
        this.maxDatetime &&
        this.maxDatetime.year === this.year &&
        this.maxDatetime.month === this.month &&
        this.maxDatetime.day === this.day
      ) ? this.maxDatetime.toFormat('HH:mm') : null
    }
  },

  methods: {
    nextStep: function nextStep () {
      this.step = this.flow.next(this.step);
      this.timePartsTouched = [];

      if (this.step === 'end') {
        this.$emit('confirm', this.newDatetime);
      }
    },
    showYear: function showYear () {
      this.step = 'year';
      this.flow.diversion('date');
    },
    confirm: function confirm () {
      this.nextStep();
    },
    cancel: function cancel () {
      this.$emit('cancel');
    },
    clear: function clear () {
      this.$emit('clear');
    },
    onChangeYear: function onChangeYear (year) {
      this.newDatetime = this.newDatetime.set({ year: year });

      if (this.auto) {
        this.nextStep();
      }
    },
    onChangeDate: function onChangeDate (year, month, day) {
      this.newDatetime = this.newDatetime.set({ year: year, month: month, day: day });

      if (this.auto) {
        this.nextStep();
      }
    },
    onChangeTime: function onChangeTime (ref) {
      var hour = ref.hour;
      var minute = ref.minute;
      var suffixTouched = ref.suffixTouched;

      if (suffixTouched) {
        this.timePartsTouched['suffix'] = true;
      }

      if (Number.isInteger(hour)) {
        this.newDatetime = this.newDatetime.set({ hour: hour });
        this.timePartsTouched['hour'] = true;
      }

      if (Number.isInteger(minute)) {
        this.newDatetime = this.newDatetime.set({ minute: minute });
        this.timePartsTouched['minute'] = true;
      }

      var goNext = this.auto && this.timePartsTouched['hour'] && this.timePartsTouched['minute'] && (
        this.timePartsTouched['suffix'] ||
        !this.use12Hour
      );

      if (goNext) {
        this.nextStep();
      }
    },
    onKeyDown: function onKeyDown (event) {
      switch (event.keyCode) {
        case KEY_ESC:
        case KEY_TAB:
          this.cancel();
          break

        case KEY_ENTER:
          this.nextStep();
          break
      }
    }
  }
};

var Datetime = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vdatetime"},[_c('input',_vm._g(_vm._b({staticClass:"vdatetime-input",class:_vm.inputClass,attrs:{"id":_vm.inputId,"type":"text"},domProps:{"value":_vm.inputValue},on:{"click":_vm.open,"focus":_vm.open}},'input',_vm.$attrs,false),_vm.$listeners)),_vm._v(" "),(_vm.hiddenName)?_c('input',{attrs:{"type":"hidden","name":_vm.hiddenName},domProps:{"value":_vm.value}}):_vm._e(),_vm._v(" "),_c('transition-group',{attrs:{"name":"vdatetime-fade","tag":"div"}},[(_vm.isOpen)?_c('div',{key:"overlay",staticClass:"vdatetime-overlay",on:{"click":function($event){if($event.target !== $event.currentTarget){ return null; }_vm.cancel($event);}}}):_vm._e(),_vm._v(" "),(_vm.isOpen)?_c('datetime-popup',{key:"popup",attrs:{"type":_vm.type,"datetime":_vm.popupDate,"phrases":_vm.phrases,"use12-hour":_vm.use12Hour,"hour-step":_vm.hourStep,"minute-step":_vm.minuteStep,"min-datetime":_vm.popupMinDatetime,"max-datetime":_vm.popupMaxDatetime,"auto":_vm.auto,"week-start":_vm.weekStart},on:{"confirm":_vm.confirm,"cancel":_vm.cancel,"clear":_vm.clear}}):_vm._e()],1)],1)},staticRenderFns: [],
  components: {
    DatetimePopup: DatetimePopup
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
      default: function default$1 () {
        return {
          clear: 'Clear',
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
      default: function default$2 () {
        return weekStart()
      }
    }
  },

  data: function data () {
    return {
      isOpen: false,
      datetime: datetimeFromISO(this.value)
    }
  },

  watch: {
    value: function value (newValue) {
      this.datetime = datetimeFromISO(newValue);
    }
  },

  created: function created () {
    this.emitInput();
  },

  computed: {
    inputValue: function inputValue () {
      var format = this.format || (this.type === 'date' ? luxon.DateTime.DATE_MED : luxon.DateTime.DATETIME_MED);

      if (typeof format === 'string') {
        return this.datetime ? luxon.DateTime.fromISO(this.datetime).setZone(this.zone).toFormat(format) : ''
      } else {
        return this.datetime ? this.datetime.setZone(this.zone).toLocaleString(format) : ''
      }
    },
    popupDate: function popupDate () {
      return this.datetime ? this.datetime.setZone(this.zone) : this.newPopupDatetime()
    },
    popupMinDatetime: function popupMinDatetime () {
      return this.minDatetime ? luxon.DateTime.fromISO(this.minDatetime) : null
    },
    popupMaxDatetime: function popupMaxDatetime () {
      return this.maxDatetime ? luxon.DateTime.fromISO(this.maxDatetime) : null
    }
  },

  methods: {
    emitInput: function emitInput () {
      var datetime = this.datetime ? this.datetime.setZone(this.valueZone) : null;

      if (datetime && this.type === 'date') {
        datetime = startOfDay(datetime);
      }

      this.$emit('input', datetime ? datetime.toISO() : '');
    },
    open: function open (event) {
      event.target.blur();

      this.isOpen = true;
    },
    close: function close () {
      this.isOpen = false;
      this.$emit('close');
    },
    confirm: function confirm (datetime) {
      this.datetime = datetime.toUTC();
      this.emitInput();
      this.close();
    },
    cancel: function cancel () {
      this.close();
    },
    clear: function clear () {
      this.datetime = null;
      this.emitInput();
      this.close();
    },
    newPopupDatetime: function newPopupDatetime () {
      var datetime = luxon.DateTime.utc().setZone(this.zone).set({ seconds: 0, milliseconds: 0 });

      if (this.minuteStep === 1) {
        return datetime
      }

      var roundedMinute = Math.round(datetime.minute / this.minuteStep) * this.minuteStep;

      if (roundedMinute === 60) {
        return datetime.plus({ hours: 1 }).set({ minute: 0 })
      }

      return datetime.set({ minute: roundedMinute })
    }
  }
};

function plugin (Vue) {
  Vue.component('datetime', Datetime);
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

var version = '1.0.0-beta.6';

exports['default'] = plugin;
exports.Datetime = Datetime;
exports.version = version;
