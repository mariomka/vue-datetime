# vue-datetime

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Latest Version on NPM](https://img.shields.io/npm/v/vue-datetime.svg?style=flat-square)](https://npmjs.com/package/vue-datetime)
[![npm](https://img.shields.io/npm/dt/vue-datetime.svg?style=flat-square)](https://www.npmjs.com/package/vue-datetime)

> Mobile friendly datetime picker for Vue. Supports date, datetime and time modes, i18n and disabling dates.
 
## Demo

Not ready yet for 1.x version. 


## Installation

### Yarn

```bash
yarn add luxon vue-datetime@1.0.0-alpha.1
```
### npm

```bash
npm install --save luxon vue-datetime@1.0.0-alpha.1
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
<link rel="stylesheet" href="https://unpkg.com/vue-datetime/dist/vue-datetime.css"></link>
<script src="https://unpkg.com/vue-datetime"></script>
```

## Usage

### Minimal

```html
<datetime v-model="date"></datetime>
```

## Configuration

Parameter | Type | Default
--------- | ---- | ------
v-model (*required*) | Date `String` | -

The component is based on [Luxon](https://github.com/moment/luxon).

## Events

Component emits the `input` event to work with `v-model`. [More info](https://vuejs.org/v2/guide/components.html#Form-Input-Components-using-Custom-Events).

Also, input text inherits all component events.

## Theming

Theming is supported by overwriting CSS classes

## Development

### Launch visual tests

```bash
yarn dev
```

### Launch Karma with coverage

```bash
yarn dev:coverage
```

### Build

Bundle the js and css of to the `dist` folder:

```bash
yarn build
```

## License

[The MIT License](http://opensource.org/licenses/MIT)
