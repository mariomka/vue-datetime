import { DateTime, Info, Settings } from 'luxon'
import FlowManager from './FlowManager'

export function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function datetimeFromISO (string) {
  const datetime = DateTime.fromISO(string).toUTC()

  return datetime.isValid ? datetime : null
}

export function monthDays (year, month, weekStart) {
  const monthDate = DateTime.local(year, month, 1)
  let firstDay = monthDate.weekday - weekStart

  if (firstDay < 0) {
    firstDay += 7
  }
  let lastDay = (weekStart - monthDate.weekday - monthDate.daysInMonth) % 7
  if (lastDay < 0) {
    lastDay += 7
  }

  return Array.apply(null, Array(monthDate.daysInMonth + firstDay + lastDay))
    .map((value, index) =>
      (index + 1 <= firstDay || index >= firstDay + monthDate.daysInMonth) ? null : (index + 1 - firstDay)
    )
}

function getDateFromDateTime (dateTime, dateModification) {
  const dateTimeOpts = {
    zone: 'UTC'
  }
  dateModification.map(option => { dateTimeOpts[option] = dateTime.c[option] })
  return DateTime.fromObject(dateTimeOpts)
}

function checkAllowedDateTimeRanges (allowedDateTimeRanges, startCheck, endCheck = startCheck, dateModification = ['year', 'month', 'day']) {
  // if the default doesnt work as expected
  // endCheck = endCheck || startCheck
  return allowedDateTimeRanges && (allowedDateTimeRanges.length > 0) &&
    // is the current date being checked within an allowed date range
    !allowedDateTimeRanges.find(function ([allowedStartDate, allowedEndDate]) {
      // this is done to strip out extra date info
      // i.e when comparing start and end days we dont want hours or minutes
      allowedStartDate = allowedStartDate.c ? getDateFromDateTime(allowedStartDate, dateModification) : allowedStartDate
      allowedEndDate = allowedEndDate.c ? getDateFromDateTime(allowedEndDate, dateModification) : allowedEndDate
      // is the current date being checked within an this date range
      return (allowedStartDate && startCheck >= allowedStartDate) && (allowedEndDate && endCheck <= allowedEndDate)
    })
}

export function monthDayIsDisabled (allowedDateTimeRanges, year, month, day) {
  return checkAllowedDateTimeRanges(allowedDateTimeRanges, DateTime.fromObject({ year, month, day, zone: 'UTC' }))
}

export function monthIsDisabled (allowedDateTimeRanges, year, month) {
  return checkAllowedDateTimeRanges(
    allowedDateTimeRanges,
    DateTime.utc(year, month, DateTime.utc(year, month).daysInMonth),
    DateTime.utc(year, month, 1)
  )
}

export function yearIsDisabled (allowedDateTimeRanges, year) {
  return checkAllowedDateTimeRanges(allowedDateTimeRanges, DateTime.utc(year))
}

export function hourIsDisabled (allowedDateTimeRanges, currentDateTime, hour) {
  const startCheck = DateTime.fromObject({ year: currentDateTime.c.year, month: currentDateTime.c.month, day: currentDateTime.c.day, hour })
  const dateTimeModification = ['year', 'month', 'day', 'hour']
  return checkAllowedDateTimeRanges(allowedDateTimeRanges, startCheck, null, dateTimeModification)
}

export function minuteIsDisabled (allowedDateTimeRanges, currentDateTime, hour, minute) {
  const startCheck = DateTime.fromObject({ year: currentDateTime.c.year, month: currentDateTime.c.month, day: currentDateTime.c.day, hour, minute, zone: 'UTC' })
  const dateTimeModification = ['year', 'month', 'day', 'hour', 'minute']
  return checkAllowedDateTimeRanges(allowedDateTimeRanges, startCheck, null, dateTimeModification)
}

export function selectionIsDisabled (hours, use12Hour, selection) {
  // if not use12hours
  const enabledHours = hours.filter(hour => !hour.disabled)
  let hasSelection = enabledHours.length > 0
  if (use12Hour) {
    hasSelection = !!enabledHours.find(hour => selection === 'am' ? hour.number < 12 : hour.number >= 12)
  }
  return !hasSelection
}

export function weekdays (weekStart) {
  if (--weekStart < 0) {
    weekStart = 6
  }

  let weekDays = Info.weekdays('short').map(weekday => capitalize(weekday))

  weekDays = weekDays.concat(weekDays.splice(0, weekStart))

  return weekDays
}

export function months () {
  return Info.months().map(month => capitalize(month))
}

export function hours (step) {
  return Array.apply(null, Array(Math.ceil(24 / step))).map((item, index) => index * step)
}

export function minutes (step) {
  return Array.apply(null, Array(Math.ceil(60 / step))).map((item, index) => index * step)
}

export function years (current) {
  return Array.apply(null, Array(201)).map((item, index) => current - 100 + index)
}

export function getAllowedDateTimeRanges (allowedDateTimeRanges, min, max) {
  if (!allowedDateTimeRanges.length) {
    const minMaxArray = []
    // this preserves the existing min-max functionality by assuming its just one set of "allowed ranges"
    if (min && max) {
      minMaxArray.push(min)
      minMaxArray.push(max)
    } else if (min) {
      minMaxArray.push(min)
      minMaxArray.push(DateTime.fromFormat('31-12-3000 23:59:59', 'dd-MM-y hh:mm:ss'))
    } else if (max) {
      minMaxArray.push(DateTime.fromFormat('01-01-1972 00:00:00', 'dd-MM-y hh:mm:ss'))
      minMaxArray.push(max)
    }
    minMaxArray.length ? allowedDateTimeRanges.push(minMaxArray) : null
  }
  return allowedDateTimeRanges
}

export function pad (number) {
  return number < 10 ? '0' + number : number
}

export function startOfDay (datetime) {
  return datetime.startOf('day')
}

export function createFlowManager (flow) {
  return new FlowManager(flow, 'end')
}

export function createFlowManagerFromType (type) {
  let flow = []

  switch (type) {
    case 'datetime':
      flow = ['date', 'time']
      break
    case 'time':
      flow = ['time']
      break
    default:
      flow = ['date']
  }

  return new FlowManager(flow, 'end')
}

export function weekStart () {
  let weekstart

  try {
    weekstart = require('weekstart/package.json').version ? require('weekstart') : null
  } catch (e) {
    weekstart = window.weekstart
  }

  const firstDay = weekstart ? weekstart.getWeekStartByLocale(Settings.defaultLocale) : 1

  return firstDay === 0 ? 7 : firstDay
}
