import Promise from 'promise-polyfill'

{
  if (!window.Promise) {
    window.Promise = Promise
  }
}

{
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame
}

{
	window.transitionEnd = (() => {
		const elm = document.createElement('div')
		const transitions = {
			transition      : 'transitionend',
			MozTransition   : 'transitionend',
			WebkitTransition: 'webkitTransitionEnd'
		}
	
		for (let prop in transitions) {
			if (transitions.hasOwnProperty(prop) && elm.style[prop] !== undefined) {
				return transitions[prop]
			}
		}
	})()
}

{
	window.animationEnd = (() => {
		const elm = document.createElement('div')
		const animations = {
			transition      : 'animationend',
			MozTransition   : 'animationnend',
			WebkitTransition: 'webkitAnimationEnd'
		}
	
		for (let prop in animations) {
			if (animations.hasOwnProperty(prop) && elm.style[prop] !== undefined) {
				return animations[prop]
			}
		}
	})()
}
