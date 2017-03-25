
export default class Modal {
  constructor() {
    this.elm = {
      modal   : document.getElementById('modal'),
      box     : document.getElementsByClassName('modal-style-box'),
      triggers: document.getElementsByClassName('modal-trigger')
    }

    this.className = {
      enter: 'is-enter',
      leave: 'is-leave'
    }

    this.isOpen = false
    this.activeModalElm = null

    this.bindEvents()
  }

  setEventElements(elements, eventName, func) {
    for (let i = 0, length = elements.length; i < length; i++) {
      elements[i].addEventListener(eventName, (e) => func(e))
    }
  }

  bindEvents() {
    this.elm.modal.addEventListener('click', (e) => this.close())
    this.setEventElements(this.elm.triggers, 'click', (e) => {
      this.open(e.target.getAttribute('data-target'))
    })
    this.setEventElements(this.elm.box, 'click', (e) =>  e.stopPropagation())
  }

  open(id) {
    if (this.isOpen || !id) return false

    this.isOpen = true

    this.activeModalElm = document.getElementById(id)
    this.elm.modal.classList.add(this.className.enter)
    this.activeModalElm.classList.add(this.className.enter)
  }

  close() {
    const onComplete = () => {
      this.isOpen = false
      this.elm.modal.removeEventListener(animationEnd, onComplete)
      this.elm.modal.classList.remove(this.className.enter, this.className.leave)
      this.activeModalElm.classList.remove(this.className.enter, this.className.leave)
    }
    
    this.elm.modal.addEventListener(animationEnd, onComplete)
    this.elm.modal.classList.add(this.className.leave)
  }
}