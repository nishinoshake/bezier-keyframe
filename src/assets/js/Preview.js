import CONSTANT from './constant'
import * as easing from './easing'
import config from './config'
import state from './State'

export default class Preview {
  constructor() {
    const geometory = {
      circle: {type: 'arc', size: 10},
      line  : {type: 'line', size: 5},
      bezier: {type: 'bezier', size: 5}
    }

    const material = {
      black : {r: 68, g: 68, b: 68},
      gray  : {r: 224, g: 224, b: 224},
      brown : {r: 208, g: 168, b: 105},
      indigo: {r: 40, g: 53, b: 147}
    }

    this.shapes = {
      start: {
        default  : {x: 260, y: 260},
        geometory: geometory.circle,
        material : material.indigo,
        draggable: false,
        alpha    : 1
      },
      end: {
        default  : {x: 510, y: 10},
        geometory: geometory.circle,
        material : material.black,
        draggable: true,
        alpha    : 1
      },
      p1: {
        default  : {x: 510, y: 200},
        geometory: geometory.circle,
        material : material.brown,
        draggable: true,
        alpha    : 1
      },
      p2: {
        default  : {x: 260, y: 60},
        geometory: geometory.circle,
        material : material.brown,
        draggable: true,
        alpha    : 1
      },
      l1: {
        from     : 'start',
        to       : 'p1',
        geometory: geometory.line,
        material : material.gray,
        draggable: false,
        alpha    : 1
      },
      l2: {
        from     : 'end',
        to       : 'p2',
        geometory: geometory.line,
        material : material.gray,
        draggable: false,
        alpha    : 1
      },
      bezier: {
        geometory: geometory.bezier,
        material : material.black,
        draggable: false,
        alpha    : 1        
      }
    }

    this.layers = ['l1', 'l2', 'bezier', 'p1', 'p2', 'start', 'end']

    this.canvas = {
      width : 520,
      height: 520,
      edge  : {
        x: {min: 10, max: 510},
        y: {min: 10, max: 510}
      },
      defaultScale: 250
    }

    this.elm = {
      canvas : document.getElementById('box'),
      sass   : document.getElementById('style-sass'),
      css    : document.getElementById('style-css'),
      preview: null,
      scale  : document.getElementById('sync-scale'),
      ball   : document.getElementById('ball')
    }

    this.animeProps = {
      fadeDuration: 200,
      beforeStart : 100,
      afterEnd    : 400
    }

    this.ctx = this.elm.canvas.getContext('2d')

    this.label = {
      hide : 'hide',
      show : 'show',
      anime: 'anime'
    }

    this.frameSecond = 16

    this.digit = {
      percent: 2,
      opacity: 2,
      pixel  : 2
    }

    this.funcsWhenRaf = {}

    this.style = []

    this.appendPreviewStyle()
    this.setDefaultPosition()
    this.bindEvents()
    this.render()
  }

  appendPreviewStyle() {
    this.elm.preview = document.createElement('style')
    document.getElementsByTagName('head')[0].appendChild(this.elm.preview)
  }

  setDefaultPosition() {
    this.layers.forEach((name) => {
      if (this.shapes[name].hasOwnProperty('default')) {
        this.shapes[name].x = this.shapes[name].default.x
        this.shapes[name].y = this.shapes[name].default.y
      }
    })
  }

  bindEvents() {
    this.elm.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e))
    this.elm.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e))
    this.elm.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e))
  }

  render() {
    let self = this
  
    ;(function update() {
      self.draw()
      Object.keys(self.funcsWhenRaf).forEach((key) => self.funcsWhenRaf[key]())
      requestAnimationFrame(update)
    })()
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.layers.forEach((name) => {
      const geometory = this.shapes[name].geometory
      const material = this.shapes[name].material

      switch(geometory.type) {
        case 'arc':
          this.ctx.fillStyle = `rgba(${material.r}, ${material.g}, ${material.b}, ${this.shapes[name].alpha})`
          this.ctx.beginPath()
          this.ctx.arc(this.shapes[name].x, this.shapes[name].y, geometory.size, 0, Math.PI * 2, false)
          this.ctx.fill()
          break
        case 'line':
          this.ctx.fillStyle   = 'rgba(0, 0, 0, 0)'
          this.ctx.strokeStyle = `rgba(${material.r}, ${material.g}, ${material.b}, ${this.shapes[name].alpha})`
          this.ctx.lineWidth   = geometory.size
          this.ctx.beginPath()
          this.ctx.moveTo(this.shapes[this.shapes[name].from].x, this.shapes[this.shapes[name].from].y)
          this.ctx.lineTo(this.shapes[this.shapes[name].to].x, this.shapes[this.shapes[name].to].y)
          this.ctx.stroke()
          break
        case 'bezier':
          this.ctx.fillStyle   = 'rgba(0, 0, 0, 0)'
          this.ctx.strokeStyle = `rgba(${material.r}, ${material.g}, ${material.b}, ${this.shapes[name].alpha})`
          this.ctx.lineWidth   = geometory.size
          this.ctx.beginPath()
          this.ctx.moveTo(this.shapes.start.x, this.shapes.start.y)
          this.ctx.bezierCurveTo(
            this.shapes.p1.x, this.shapes.p1.y,
            this.shapes.p2.x, this.shapes.p2.y,
            this.shapes.end.x, this.shapes.end.y
          )
          this.ctx.stroke()
          break
      }
    })
  }

  onStateChange(props) {
    const textNode = document.createTextNode(props.scale)

    this.removeChildren(this.elm.scale)
    this.elm.scale.appendChild(textNode)
  }

  handleMouseDown(e) {
    const [mouseX, mouseY] = this.getMouseXY(e)
    let isGrabbed = false

    this.layers.forEach((name) => {
      if (!isGrabbed && this.hit(this.shapes[name], mouseX, mouseY)) {
        isGrabbed = true
        this.shapes[name].active = true
        this.elm.canvas.classList.add(CONSTANT.CLASSNAME.MOVE)
      }
    })
  }

  handleMouseMove(e) {
    const [mouseX, mouseY] = this.getMouseXY(e)
    let isHover = false

    this.layers.forEach((name) => {
      if (this.hit(this.shapes[name], mouseX, mouseY)) {
        isHover = true
      }
      if (this.shapes[name].active) {
        this.shapes[name].x = mouseX
        this.shapes[name].y = mouseY
      }
    })

    if (isHover) {
      this.elm.canvas.classList.add(CONSTANT.CLASSNAME.HOVER)
    } else {
      this.elm.canvas.classList.remove(CONSTANT.CLASSNAME.HOVER)
    }
  }

  handleMouseUp(e) {
    this.layers.forEach((name) => {
      this.shapes[name].active = false
      this.elm.canvas.classList.remove(CONSTANT.CLASSNAME.HOVER, CONSTANT.CLASSNAME.MOVE)
    })
  }

  getMouseXY(e) {
    const rect = this.elm.canvas.getBoundingClientRect()
    const x    = parseInt(Math.floor(e.clientX - rect.left), 10)
    const y    = parseInt(Math.floor(e.clientY - rect.top), 10)

    return [
      Math.min(Math.max(parseInt(x), this.canvas.edge.x.min), this.canvas.edge.x.max),
      Math.min(Math.max(parseInt(y), this.canvas.edge.y.min), this.canvas.edge.y.max)
    ]
  }

  hit(shape, mouseX, mouseY) {
    if(
      shape.draggable &&
      mouseX >= shape.x - shape.geometory.size / 2 &&
      mouseX <= shape.x + shape.geometory.size / 2 &&
      mouseY >= shape.y - shape.geometory.size / 2 &&
      mouseY <= shape.y + shape.geometory.size / 2
    ) {
      return true
    } else {
      return false
    }
  }

  start() {
    if (state.get('isAnimating')) return

    this.writeStyles()

    state.set('isAnimating', true)
    this.hidePreview()
      .then(() => this.animate())
      .then(() => {
        state.set('isAnimating', false)
        return this.showPreview()
      })
  }

  hidePreview() {
    return new Promise((resolve) => {
      this.elm.ball.classList.add(CONSTANT.CLASSNAME.VISIBLE)

      this.funcsWhenRaf[this.label.hide] = () => {
        this.layers.forEach((name) => {
          this.fadeOut(this.shapes[name])
        })

        const invisible = this.layers.filter((layer) => this.shapes[layer].alpha === 0)
        if (invisible.length === this.layers.length) {
          this.removeFromRaf(this.label.hide)
          setTimeout(() => resolve(), this.animeProps.beforeStart)
        }
      }
    })
  }

  showPreview() {
    return new Promise((resolve) => {
      this.shapes.end.alpha   = 1
      this.shapes.start.alpha = 0
      this.shapes.start.x = this.shapes.start.default.x
      this.shapes.start.y = this.shapes.start.default.y

      this.funcsWhenRaf[this.label.show] = () => {
        this.layers.forEach((name) => {
          this.fadeIn(this.shapes[name])
        })

        const visible = this.layers.filter((layer) => this.shapes[layer].alpha === 1)

        if (visible.length === this.layers.length) {
          this.removeFromRaf(this.label.show)
          resolve()
        }
      }
    })
  }

  animate() {
    return new Promise((resolve) => {
      const handleAnimationEnd = () => {
        setTimeout(() => {
          this.elm.ball.removeEventListener(animationEnd, handleAnimationEnd)
          this.elm.ball.classList.remove(CONSTANT.CLASSNAME.ANIME)
          resolve()
        }, this.animeProps.afterEnd)
      }
      this.elm.ball.addEventListener(animationEnd, handleAnimationEnd)
      this.elm.ball.classList.add(CONSTANT.CLASSNAME.ANIME)
    })
  }

  removeFromRaf(label) {
    delete this.funcsWhenRaf[label]
  }

  fade(type, shape) {
    if (!shape.fadeStartTime) {
      shape.fadeStartTime = Date.now()
    }

    const now = Date.now()

    switch(type) {
      case 'in':
        if (shape.alpha >= 1) {
          shape.alpha = 1
          shape.fadeStartTime = null
        } else {
          shape.alpha = (now - shape.fadeStartTime) / this.animeProps.fadeDuration
        }
        break
      case 'out':
        if (shape.alpha <= 0) {
          shape.alpha = 0
          shape.fadeStartTime = null
        } else {
          shape.alpha = 1 - ((now - shape.fadeStartTime) / this.animeProps.fadeDuration)
        }
        break
    }
  }

  fadeIn(shape) {
    this.fade('in', shape)
  }

  fadeOut(shape) {
    this.fade('out', shape)
  }

  writeStyles() {
    this.writeSass('sass')
    this.writeCss('css')
    this.writeCss('preview')
  }

  writeSass(name) {
    this.clearStyle(name)
    this.addRow(name, '.anime')
    this.addRow(name, `  animation: ${state.get('duration')}ms linear anime-bezier`)
    this.addRow(name, '')
    this.addRow(name, '@keyframes anime-bezier')
    this.addKeyframes(name)
    this.appendStyle(name)
  }

  writeCss(name) {
    var forceDefaultScale = name === 'preview' ? true : false

    this.clearStyle(name)
    this.addRow(name, '.anime {')
    this.addRow(name, `  animation: ${state.get('duration')}ms linear anime-bezier;`)
    this.addRow(name, '}')
    this.addRow(name, '')
    this.addRow(name, '@keyframes anime-bezier {')
    this.addKeyframes(name, forceDefaultScale)
    this.addRow(name, '}')
    this.appendStyle(name)
  }

  calcBezierPosition(t) {
    const x = Math.pow(1 - t, 3) * this.shapes.start.default.x + 3 * Math.pow(1 - t, 2) * t * this.shapes.p1.x + 3 * (1 - t) * Math.pow(t, 2) * this.shapes.p2.x + Math.pow(t, 3) * this.shapes.end.x
    const y = Math.pow(1 - t, 3) * this.shapes.start.default.y + 3 * Math.pow(1 - t, 2) * t * this.shapes.p1.y + 3 * (1 - t) * Math.pow(t, 2) * this.shapes.p2.y + Math.pow(t, 3) * this.shapes.end.y
    return [x, y]
  }

  clearStyle(target) {
    this.style[target] = []
    this.removeChildren(this.elm[target])
  }

  addRow(target, contents) {
    this.style[target].push(contents)
  }

  addKeyframes(target, forceDefault) {
    const frame = Math.floor(state.get('duration') / this.frameSecond)
    const scale = forceDefault ? 1 : state.get('scale') / this.canvas.defaultScale

    for (let i = 0; i < frame; i++) {
      let percent    = this.floorDigit(100 * (i / frame), this.digit.percent)
      let translateX = null
      let translateY = null
      let opacity    = null
      const t        = easing[state.get('easing')](percent, 0, 1, 100)
      const [x, y]   = this.calcBezierPosition(t)

      if (i === frame - 1) {
        percent    = 100
        translateX = this.floorDigit((this.shapes.end.x - this.shapes.start.default.x) * scale, this.digit.pixel)
        translateY = this.floorDigit((this.shapes.end.y - this.shapes.start.default.y) * scale, this.digit.pixel)

        switch(state.get('effect')) {
          case 'fadein':
            opacity = 1
            break
          case 'fadeout':
            opacity = 0
            break
        }
      } else {
        translateX = this.floorDigit((x - this.shapes.start.default.x) * scale, this.digit.pixel)
        translateY = this.floorDigit((y - this.shapes.start.default.y) * scale, this.digit.pixel)

        switch(state.get('effect')) {
          case 'fadein':
            opacity = this.floorDigit(t, this.digit.opacity)
            break
          case 'fadeout':
            opacity = this.floorDigit(1 - t, this.digit.opacity)
            break
        }
      }
      
      switch(target) {
        case 'sass':
          this.addRow(target, `  ${percent}%`)
          this.addRow(target, `    transform: translate3d(${translateX}px, ${translateY}px, 0px)`)
          opacity !== null ? this.addRow(target, `    opacity: ${opacity}`) : void(0)
          break
        case 'css':
        case 'preview':
          this.addRow(target, `  ${percent}%  {`)
          this.addRow(target, `    transform: translate3d(${translateX}px, ${translateY}px, 0px);`)
          opacity !== null ? this.addRow(target, `    opacity: ${opacity};`) : void(0)
          this.addRow(target, '  }')
          break
      }
    }
  }

  appendStyle(target) {
    const text     = this.style[target].join('\r\n')
    const textNode = document.createTextNode(text)

    this.elm[target].appendChild(textNode)
  }

  floorDigit(num, digit) {
    return Math.floor(num * Math.pow(10, digit)) / Math.pow(10, digit)
  }

  removeChildren(elm) {
    while (elm.firstChild) {
      elm.removeChild(elm.firstChild);
    }
  }
}