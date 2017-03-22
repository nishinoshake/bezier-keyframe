const config = {
  inputs: {
    scale: {
      type: 'number'
    },
    duration: {
      type: 'number'
    },
    easing: {
      type : 'select',
      props: [
        'easeInQuart',
        'easeOutQuart',
        'easeInOutQuart',
        'easeInCubic',
        'easeOutCubic',
        'easeInOutCubic',
        'easeInQuad',
        'easeOutQuad',
        'easeInOutQuad',
        'easeInQuint',
        'easeOutQuint',
        'easeInOutQuint',
        'easeInSine',
        'easeOutSine',
        'easeInOutSine',
        'easeInExpo',
        'easeOutExpo',
        'easeInOutExpo',
        'easeInCirc',
        'easeOutCirc',
        'easeInOutCirc'
      ]
    },
    effect: {
      type : 'select',
      props: [
        'none',
        'fadein',
        'fadeout'
      ]
    },
    isAnimating: {
      type: 'boolean'
    }
  }
}

export default config