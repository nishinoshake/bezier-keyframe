
export default class Modal {
  constructor() {
    this.elm = {
      modals  : document.getElementsByClassName('modal'),
      contents: document.getElementsByClassName('modal-contents'),
      triggers: document.getElementsByClassName('modal-trigger'),
      closes  : document.getElementsByClassName('modal-close')
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
    this.setEventElements(this.elm.triggers, 'click', (e) => {
      this.open(e.target.getAttribute('data-target'))
    })
    this.setEventElements(this.elm.contents, 'click', (e) =>  e.stopPropagation())
    this.setEventElements(this.elm.modals, 'click', (e) => this.close())
    this.setEventElements(this.elm.closes, 'click', (e) => this.close())
  }

  open(id) {
    if (this.isOpen || !id) return false

    this.isOpen = true

    this.activeModalElm = document.getElementById(id)
    this.activeModalElm.classList.add(this.className.enter)
  }

  close() {
    const onComplete = () => {
      this.isOpen = false
      this.activeModalElm.removeEventListener(animationEnd, onComplete)
      this.activeModalElm.classList.remove(this.className.enter, this.className.leave)
    }
    
    this.activeModalElm.addEventListener(animationEnd, onComplete)
    this.activeModalElm.classList.add(this.className.leave)
  }
}