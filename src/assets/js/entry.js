import './polyfill'
import state from './State'
import Input from './Input'
import Preview from './Preview'
import Modal from './Modal'

window.addEventListener('load', () => {
  const modal   = new Modal()
  const preview = new Preview()
  const input   = new Input(preview)

  state.addInstance(preview, input)
  state.trigger()

  document.body.classList.add('is-loaded')
})