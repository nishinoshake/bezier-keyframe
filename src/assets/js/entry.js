import './polyfill'
import state from './State'
import Input from './Input'
import Preview from './Preview'
import Modal from './Modal'
import Clipboard from 'clipboard'

window.addEventListener('load', () => {
  const modal   = new Modal()
  const preview = new Preview()
  const input   = new Input(preview)

  state.addInstance(preview, input)
  state.trigger()

  const clip = new Clipboard('.modal-style-copy')
    
  document.body.classList.add('is-loaded')
})