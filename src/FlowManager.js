export default class FlowManager {
  constructor (flow = [], endStatus = null) {
    this.flow = flow
    this.endStatus = endStatus
  }

  step (index) {
    return this.flow.length > index ? this.flow[index] : this.endStatus
  }

  first () {
    return this.step(0)
  }

  next (current) {
    return this.step(this.flow.indexOf(current) + 1)
  }
}
