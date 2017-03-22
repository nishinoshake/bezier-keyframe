import config from './config'

class State {
  constructor() {
    this.public = {
      scale      : 250,
      duration   : 2000,
      easing     : config.inputs.easing.props[0],
      effect     : config.inputs.effect.props[0],
      isAnimating: false
    }

    this.instances = []
  }

  addInstance(...instance){
    this.instances.push(...instance)
  }

  has(key) {
    return this.public.hasOwnProperty(key) ? true : false
  }

  get(key) {
    return this.has(key) ? this.public[key] : ''
  }

  set(key, val) {
    if (this.isValid(key, val)) {
      this.public[key] = val
    }
    this.callInstanceMethod('onStateChange', this.public)
  }

  trigger() {
    this.callInstanceMethod('onStateChange', this.public)
  }

  isValid(key, val) {
    // key exists
    if (!this.has(key)) return false

    switch(config.inputs[key].type) {
      case 'number':
        return /^\d{1,7}$/.test(val) ? true : false
      case 'select':
        return config.inputs[key].props.indexOf(val) !== -1 ? true : false
      case 'boolean':
        return new Boolean(val)
    }
  }

  callInstanceMethod(methodName, ...args) {
    this.instances.forEach(instance => {
      if (methodName in instance) {
        instance[methodName](...args)
      }
    })
  }
}

export default new State()