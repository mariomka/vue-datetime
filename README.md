# vue-datetime

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Latest Version on NPM](https://img.shields.io/npm/v/vue-datetime.svg?style=flat-square)](https://npmjs.com/package/vue-datetime)
[![npm](https://img.shields.io/npm/dt/vue-datetime.svg?style=flat-square)](https://www.npmjs.com/package/vue-datetime)

> Mobile friendly datetime picker for Vue. Supports date, datetime and time modes, i18n and disabling dates.


**NOTICE:** This README is related to next version (1.x) of vue-datetime. For the old release 0.x, [see here](https://github.com/mariomka/vue-datetime/tree/v0.x).
 
## Demo

[![demo](https://raw.githubusercontent.com/mariomka/vue-datetime/v1.x/demo/demo.gif)](http://mariomka.github.io/vue-datetime)

Not ready yet for 1.x version. 

## TODO

Not all functionality of v0.x is implemented yet in v1.0.

- First day of week
- Disabled dates
- Time picker (Not sure if it will be implemented)

## Installation

### Yarn

```bash
yarn add luxon vue-datetime
```
### npm

```bash
npm install --save luxon vue-datetime
```

### Bundler (Webpack, Rollup)

```js
import Vue from 'vue'
import Datetime from 'vue-datetime'
// You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css'

Vue.use(Datetime)
```

#### Register manually

##### Global

```js
import { Datetime } from 'vue-datetime';

Vue.component('datetime', Datetime);
```

##### Local

```js
import { Datetime } from 'vue-datetime';

Vue.extend({
  template: '...',
  components: {
    datetime: Datetime
  }
});
```

### Browser

```html
<!-- Include after Vue -->
<!-- Local files -->
<link rel="stylesheet" href="vue-datetime/dist/vue-datetime.css"></link>
<script src="vue-datetime/dist/vue-datetime.js"></script>

<!-- From CDN -->
<!-- NOT ready yet. It will be ready for first stable version. -->
<link rel="stylesheet" href="https://unpkg.com/vue-datetime/dist/vue-datetime.css"></link>
<script src="https://unpkg.com/vue-datetime"></script>
```

## Usage

### Minimal

```html
<datetime v-model="date"></datetime>
```

## Setup

### Parameters

Parameter | Type | Default | Description
--------- | ---- | ------- | -----------
v-model (*required*) | ISO 8601 `String` | - | Datetime.
type | `String` | `date` | Picker type. date or datetime.
input-class | `String` | `''` | Class for the input.
value-zone | `String` | `UTC` | Time zone for the value.
zone | `String` | `local` | Time zone for the picker.
format | `String` | `DateTime.DATE_MED` or `DateTime.DATETIME_MED` | Input date format.
phrases | `Object` | `{ok: 'Ok', cancel: 'Cancel'}` | Phrases.
hour-step | `Number` | `1` | Hour step.
minute-step | `Number` | `1` | Minute step.
min-datetime | ISO 8601 `String` | `null` | Minimum datetime.
max-datetime | ISO 8601 `String` | `null` | Maximum datetime.
auto | `Boolean` | `false` | Auto continue/close on select.

Input inherits all props not defined above but `style` and `class` will be inherited by root element.

The component is based on [Luxon](https://github.com/moment/luxon), check out [documentation](https://moment.github.io/luxon/docs/index.html) to set [time zones](https://moment.github.io/luxon/docs/manual/zones.html) and [format](https://moment.github.io/luxon/docs/manual/formatting.html). 

### Internationalization

Date internationalization depends on luxon. [Set the default locale](https://moment.github.io/luxon/docs/manual/intl.html#setting-the-default).

```js
import { Settings } from 'luxon'

Settings.defaultLocale = 'es'
```

### Events

Component emits the `input` event to work with `v-model`. [More info](https://vuejs.org/v2/guide/components.html#Form-Input-Components-using-Custom-Events).

Also, input text inherits all component events.

## Theming

Theming is supported by overwriting CSS classes.

## Development

### Launch tests

```bash
yarn test
```

### Launch visual tests

```bash
yarn dev
```

### Launch Karma with coverage

```bash
yarn dev:coverage
```

### Build

Bundle the js and css to the `dist` folder:

```bash
yarn build
```

## License

[The MIT License](http://opensource.org/licenses/MIT)
