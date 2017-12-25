export default class FlowManager {
  constructor (flow = [], endStatus = null) {
    this.flow = flow
    this.endStatus = endStatus
    this.diversionNext = null
  }

  step (index) {
    return this.flow.length > index ? this.flow[index] : this.endStatus
  }

  first () {
    return this.step(0)
  }

  next (current) {
    if (this.diversionNext) {
      const next = this.diversionNext
      this.diversionNext = null

      return next
    }

    return this.step(this.flow.indexOf(current) + 1)
  }

  diversion (next) {
    this.diversionNext = next
  }
}
