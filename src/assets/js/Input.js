import CONSTANT from './constant'
import config from './config'
import state from './State'

export default class Input {
  constructor(action) {
    this.elm = {
      inputs: document.getElementsByClassName('js-input'),
      submit: document.getElementById('button-animate')
    }

    this.action = action

    this.bindEvents()
    this.setDefaultValue()
  }

  bindEvents() {
    for(let i = 0, length = this.elm.inputs.length; i < length; i++) {
      this.elm.inputs[i].addEventListener('change', (e) => {
        this.handleChange(e.target)
      })
    }
    this.elm.submit.addEventListener('click', () => this.handleSubmit())
  }

  onStateChange(props) {
    for (let i = 0, length = this.elm.inputs.length; i < length; i++) {
      this.elm.inputs[i].value = props[this.elm.inputs[i].name]
    }
    if (props.isAnimating) {
      this.elm.submit.classList.add(CONSTANT.CLASSNAME.DISABLED)
    } else {
      this.elm.submit.classList.remove(CONSTANT.CLASSNAME.DISABLED)      
    }
  }

  handleChange(target) {
    state.set(target.name, target.value)
  }

  handleSubmit() {
    this.action.start()
  }

  setDefaultValue() {
    for (let i = 0, length = this.elm.inputs.length; i < length; i++) {
      const name = this.elm.inputs[i].name
      switch(config.inputs[name].type) {
        case 'number':
          switch(name) {
            case 'scale':
              this.elm.inputs[i].value = state.get('scale')
              break
            case 'duration':
              this.elm.inputs[i].value = state.get('duration')
              break
          }
          
          break
        case 'select':
          config.inputs[name].props.forEach((prop) => {
            const option = document.createElement('option')
            option.value = prop
            option.text  = prop
            this.elm.inputs[i].appendChild(option)
          })
          break
      }
    }
  }
}