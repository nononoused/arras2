//!function() {

let c = module.exports({})

for(let i in c) {
  window[i] = c[i]
}

const server = 'wss://arras2-io-test.glitch.me'











let editor = location.href.indexOf('?t=1') >= 0

let readData = function(petal, key, value) {
  return readDataRaw(petal.type, petal.rarity, key, value)
}

let readDataRaw = function(type, rarity, key, value) {
  let d = entityData[type]
  if(!d) { return value }
  let data = d.data
  if(!data || !(key in data)) { return value }
  let p = data[key]
  if(Array.isArray(p)) {
    return p[rarity]
  }
  return p
}

let compileOptions = {
  setFillStroke: function() {
    return setFillStroke(...arguments)
  },
  setLineWidth: function(a) {
    ctx.lineWidth = a
  },
  beginPath: function() {
    return ctx.beginPath()
  },
  closePath: function() {
    return ctx.closePath()
  },
  fill: function() {
    return ctx.fill()
  },
  stroke: function() {
    return ctx.stroke()
  },
  ellipse: function() {
    return ctx.ellipse(...arguments)
  },
  moveTo: function() {
    return ctx.moveTo(...arguments)
  },
  lineTo: function() {
    return ctx.lineTo(...arguments)
  }
}
for(let type in entityData) {
  let o = entityData[type]
  if(Array.isArray(o.render)) {
    for(let i=o.render.length-1;i>=0;i--) {
      let t = o.render[i]
      if(t.type === 'eval') {
        t.script = interpreter.compile({
          main: t.script
        }, compileOptions)
        t.run = function() {
          interpreter.run(t.script, t.script.main, false, false, [...arguments])
        }
      }
    }
  }
}







document.body.style.visibility = 'visible'

const circle = document.getElementsByClassName('circle').item(0)

const i4095 = 1 / 4095

const tStyle = document.createElement('style')
document.head.appendChild(tStyle)

const elements = {}, ctxs = {}
for(let i=0;i<50;i++) {
  let e = document.getElementById('i' + i)
  if(e) {
    elements[i] = e
    if(e.getContext) {
      ctxs[i] = e.getContext('2d')
    }
  }
}

elements[1].value = 'guest' + (Math.random().toFixed(3)).slice(2)

window.addEventListener('contextmenu', function(e) {
  e.preventDefault()
})

const removeLoading = function() {
  elements[0].style.opacity = 0
  elements[0].style.pointerEvents = 'none'
  document.activeElement.blur()
  circle.style.fontSize = '0'
  elements[1].focus()
}

let gameSocket = false

let transition = { then:function() {} }

let renderType = 0

let setRenderType = function(t) {
  renderType = t
  elements[8].style.visibility = (renderType === 0 ? 'visible' : 'hidden')
  elements[6].style.visibility = (renderType === 1 ? 'visible' : 'hidden')
}

let chatState = false
let setChatState = function(t) {
  if(chatState && !t) {
    chatState = false
    elements[9].classList.remove('i9active')
    if(elements[9].value) {
      elements[10].hidden = true
      elements[11].hidden = false
    } else {
      elements[10].hidden = false
      elements[11].hidden = true
    }
  } else if(t && !chatState) {
    chatState = true
    elements[9].classList.add('i9active')
    elements[10].hidden = true
    elements[11].hidden = false
  }
}

elements[9].addEventListener('focus', function() {
  setChatState(true)
})

elements[9].addEventListener('blur', function() {
  setChatState(false)
})

const drawPathRaw = function(path, x, y) {
  for(let i=0,l=path.length;i<l;i++) {
    let j = path[i]
    let rx = x + j.rx, ry = y + j.ry
    switch(j.type) {
      case 'moveTo':
        ctx.moveTo(rx, ry)
        break
      case 'lineTo':
        ctx.lineTo(rx, ry)
        break
      case 'ellipse':
        ctx.ellipse(rx, ry, j.rw, j.rh, 0, 0, deg360)
        break
    }
  }
}

const drawPath = function(path, x, y, sx, sy, cos, sin, forceHalfStepX, forceHalfStepY) {
  for(let i=0,l=path.length;i<l;i++) {
    let j = path[i]
    let rsx = sx, rsy = sy
    if(i & 1) {
      if(forceHalfStepX >= 0) {
        rsx = forceHalfStepX
      }
      if(forceHalfStepY >= 0) {
        rsy = forceHalfStepY
      }
    }
    let rx = j.x * rsx, ry = j.y * rsy
    if(sin || cos) {
      let x = rx
      rx = rx * cos - ry * sin
      ry = ry * cos + x * sin
    }
    rx += x
    ry += y
    switch(j.type) {
      case 'moveTo':
        ctx.moveTo(rx, ry)
        break
      case 'lineTo':
        ctx.lineTo(rx, ry)
        break
      case 'ellipse':
        ctx.ellipse(rx, ry, j.width * rsx, j.height * rsy, 0, 0, deg360)
        break
    }
  }
}

const drawObject = function(object, x, y, size, data, radiant, defaultColor, damageFlash, colorOffset, health, shield, globalDamageFlash, darknessM, alphaM) {
  for(let i=0,l=object.length;i<l;i++) {
    let o = object[i], r = radiant
    let alpha = (o.alpha >= 0 ? o.alpha : 1) * (alphaM >= 0 ? alphaM : 1)
    let darkness = 1 - (o.darkness >= 0 ? 1 - o.darkness : 1) * (darknessM >= 0 ? 1 - darknessM : 1)
    if(o.type === 'array-animated') {
      drawObject(o.render, 0, 0, size, data, radiant, defaultColor, damageFlash, colorOffset, health, shield, globalDamageFlash)
      continue
    } else if(o.type === 'transform') {
      drawObject(o.render, 0, 0, size, data, radiant, defaultColor, damageFlash, colorOffset, health, shield, globalDamageFlash, darkness, alpha)
      continue
    } else if(o.type === 'barrel') {
      drawObject(o.render, 0, 0, size, data, radiant, defaultColor, damageFlash, colorOffset, health, shield, globalDamageFlash)
      continue
    } else if(o.type === 'section') {
      drawObject(o.render, 0, 0, size, data, radiant, defaultColor, damageFlash, o.colorOffset, health, shield, globalDamageFlash)
      continue
    }
    if(!(alpha > 0)) {
      return
    }
    let cs = o.color
    if(cs === 'inherit' && defaultColor >= 0) {
      cs = defaultColor
    }
    if(o.overrideRadiant >= 0 || o.overrideRadiant <= 0) {
      r = o.overrideRadiant
    }
    cs = radiantTint(cs, r)
    if(darkness > 0) {
      cs = averageColors(cs, 65793, darkness)
    }
    cs = damageFlashTint(cs, damageFlash, o.damageFlashType, health, shield, globalDamageFlash)
    if(colorOffset > 0) {
      cs = averageColors(cs, 16776960, colorOffset)
    }
    if(o.color) {
      if(o.strokePercent >= 0) {
        ctx.fillStyle = toRgb(cs, alpha)
        ctx.strokeStyle = toRgb(averageColors(cs, o.strokeColor, o.strokePercent), alpha * (o.strokeAlpha >= 0 ? o.strokeAlpha : 1))
      } else {
        setFillStroke(cs, alpha, o.stroke, alpha * (o.strokeAlpha >= 0 ? o.strokeAlpha : 1))
      }
    }
    let stroke = false, fill = true, lineWidthM = o.reverseOrder ? 2 : 1
    if(o.fixedLineWidth) {
      ctx.lineWidth = o.fixedLineWidth * gameScale * lineWidthM
      stroke = true
    } else {
      if(o.lineWidth) {
        ctx.lineWidth = o.lineWidth * size * gameScale * lineWidthM
        stroke = true
      }
    }
    if(o.noFill) {
      fill = false
    }
    switch(o.type) {
      case 'eval': {
        o.run(x, y, size)
        break
      }
      case 'flower': {
        drawFlower(data, x + o.x * size, y + o.y * size, o.size * size, cs)
        break
      }
      case 'path': {
        ctx.beginPath()
        ctx.lineJoin = ctx.lineCap = 'round'
        drawPathRaw(o.joints, x, y)
        if(o.reverseOrder) {
          ctx.stroke()
          if(fill) {
            ctx.fill('nonzero')
          }
        } else {
          if(fill) {
            ctx.fill()
          }
          if(stroke) {
            ctx.stroke()
          }
        }
        ctx.closePath()
        break
      }
      default: {
        break
      }
    }
  }
}

const circleTransition = function(f, g, type) {
  if(!f) {
    f = function() {}
  }
  if(!g) {
    g = function() {}
  }
  let called = false, finished = false, waiting = false, finish = function() {
    if(finished) { return }
    finished = true
    circle.style.fontSize = '0'
    f()
  }, o = {
    then: function() {
      if(transition !== o) { return }
      called = true
      if(waiting) {
        finish()
      }
    },
    type: type
  }
  transition = o
  circle.style.fontSize = 'max(71vw, 71vh)'
  setTimeout(function() {
    if(transition !== o) { return }
    if(called) {
      finish()
    } else {
      waiting = true
    }
    g()
  }, 600)
  return o
}

const connect = function() {
  if(gameSocket) { gameSocket.close() }
  let active = true
  gameSocket = new WebSocket(server)
  gameSocket.binaryType = 'arraybuffer'
  gameSocket.close = new Proxy(gameSocket.close, { apply:function(a, b, c) {
    if(!active) { return }
    active = false
    return Reflect.apply(a, b, c)
  } })
  gameSocket.addEventListener('open', function() {
    console.log('gameSocket OPEN')
  })
  gameSocket.addEventListener('message', function(e) {
    let data = 0, type = 0, uint8 = new Uint8Array(e.data)
    try {
      data = window.msgpack.decode(uint8)
      type = data.splice(0, 1)[0]
    } catch(e) {
      return console.warn(e)
    }
    console.log(type, data)
    switch(type) {
      case packetGameUpdate:
        gameUpdate(data)
        break
      default:
        break
    }
  })
  gameSocket.addEventListener('close', function() {
    console.log('gameSocket CLOSE')
    active = false
  })
}

let gameEntityData = {}
let gamePetalData = {}

let selfId = -1
let firstUpdate = false
let gameStates = []
let waitingForStateUpdate = false

const gameUpdate = function(data) {
  let t = performance.now()
  if(waitingForStateUpdate) {
    gameStateUpdate(0, t)
  }
  waitingForStateUpdate = true
  let stateLength = gameStates.length
  let top = gameStates[stateLength - 1]
  if(top) {
    let n = 50 * sendM
    let m = t - top.t
    if(m > n - 20 && n < n + 20) {
      t = top.t + n
    } else {
      if(m > n) {
        t -= 20
      } else {
        t += 20
      }
    }
  }
  gameStates.push({
    t: t,
    d: data
  })
}

const runGameUpdate = function(data) {
  if(firstUpdate) {
    if(transition.type === 'gameStart') {
      transition.then()
    }
  }
  let oldEntities = { ...gameEntities }
  for(let i=0,l=data.length;i<l;i++) {
    let type = data[i][0], args = data[i].slice(1)
    switch(type) {
      case gameUpdateRemovedEntities: {
        for(let i=0,l=args.length;i<l;i++) {
          let a = args[i], id = a[0]
          let e = gameEntities[id]
          if(e) {
            e.removed = true
            removedEntities.push(e)
          }
          delete gameEntities[id]
          delete oldEntities[id]
        }
        break
      }
      case gameUpdateStart: {
        gameStart(args)
        break
      }
      case gameUpdateNewEntities: {
        for(let i=0,l=args.length;i<l;i++) {
          let a = args[i], type = a[0], id = a[1]
          console.log('new', a[4])
          switch(type) {
            case 0:
              gameEntityData[id] = {
                type: type,
                id: id,
                name: a[2] === false ? '' : a[2],
                radius: a[3],
                subtype: a[4],
                parentId: a[5] === false ? -1 : a[5],
                rarity: a[6],
                showName: a[7] & 1,
                radiant: a[8],
                color: a[9],
                alpha: a[10] * 0.01
              }
              break
            case 1:
              gameEntityData[id] = {
                type: type,
                id: id,
                name: '',
                radius: a[2],
                subtype: a[3],
                parentId: -1,
                rarity: a[4],
                showName: a[5] & 1,
                radiant: a[6],
                color: a[7],
                alpha: a[8] * 0.01
              }
              break
          }
        }
        break
      }
      case gameUpdateEntities: {
        if(args[0]) { selfId = args[0][0] }
        for(let i=0,l=args.length;i<l;i++) {
          let a = args[i], id = a[0]
          let d = gameEntityData[id]
          if(!d) { continue }
          let o = gameEntities[id]
          let h = 1 - (a[4] & 4095) * i4095
          let sh = 1 - ((a[4] >> 12) & 4095) * i4095
          if(a[5]) {
            let b = a[5]
            for(let i=0,l=b.length;i<l;i++) {
              let barrel = o.barrels[b[i]]
              if(barrel) {
                barrel.fireTime = 2
              }
            }
          }
          if(o) {
            switch(o.type) {
              case 0:
                if(o.nhealth <= h) {
                  o.streakTimer ++
                } else {
                  o.streakTimer = 0
                  o.damageFlash = 0.6
                }
                if(o.streakTimer >= 2) {
                  o._streak = h
                } else {
                  o._streak = o.streak
                }
                if(o.nshield > sh) {
                  o.damageFlash = 0.6
                }
                o.attacking = (a[6] & 1) ? true : false
                o.defending = (a[6] & 2) ? true : false
                o.name = d.name
                expUpdate(o, 'health', h)
                expUpdate(o, 'shield', sh)
                break
              case 1:
                break
            }
            o.color = d.color
            expUpdate(o, 'x', a[1])
            expUpdate(o, 'y', a[2])
            expUpdate(o, 'radius', d.radius)
            o.subtype = d.subtype
            o.type = d.type
            expUpdate(o, 'd', a[3] * Math.PI / 512, deg360)
            o.id = d.id
            o.rarity = d.rarity
            o.showName = d.showName
            o.radiant = d.radiant
            expUpdate(o, 'sAlpha', d.alpha)
            delete oldEntities[id]
          } else {
            o = buildEntity(d, a[3] * Math.PI / 512, a[6], a[1], a[2], h, sh)
            gameEntities[id] = o
          }
          updateData(o, o.subtype, o.rarity)
        }
        break
      }
    }
  }
  for(let i in oldEntities) {
    let entity = oldEntities[i]
    entity.streakTimer ++
    if(entity.streakTimer >= 2) {
      entity._streak = entity.nhealth
    } else {
      entity._streak = entity.streak
    }
    expUpdate(entity, 'd', entity.nd)
    expUpdate(entity, 'x', entity.nx)
    expUpdate(entity, 'y', entity.ny)
    expUpdate(entity, 'health', entity.nhealth)
    expUpdate(entity, 'shield', entity.nshield)
  }
  for(let i=removedEntities.length-1;i>=0;i--) {
    let entity = removedEntities[i]
    expUpdate(entity, 'd', entity.d + (entity.nd - entity.od) * 0.9)
    expUpdate(entity, 'x', entity.x + (entity.nx - entity.ox) * 0.9)
    expUpdate(entity, 'y', entity.y + (entity.ny - entity.oy) * 0.9)
    expUpdate(entity, 'health', entity.nhealth)
    expUpdate(entity, 'shield', entity.nshield)
    entity._streak = entity.nhealth
  }
}

const buildEntity = function(d, _d, _b, _x, _y, h, sh) {
  let o = {
    fadeTime: 2,
    d: _d,
    subtype: d.subtype,
    type: d.type,
    id: d.id,
    rarity: d.rarity,
    showName: d.showName,
    radiant: d.radiant,
    healthBarFade: 0,
    damageFlash: 0
  }
  if(o.type === 0) {
    o = {
      ...o,
      streak: 0,
      _streak: 0,
      streakTimer: 0,
      mouth: 0,
      _mouth: 0,
      brow: 0,
      _brow: 0,
      attacking: (_b & 1) ? true : false,
      defending: (_b & 2) ? true : false,
      eyeX: 0,
      eyeY: 0,
      name: d.name,
      parentId: d.parentId,
      parent: false,
      color: d.color
    }
    if(gameEntities[d.parentId]) {
      o.parent = gameEntities[d.parentId]
      expUpdate(o, 'x', o.parent.x)
      expUpdate(o, 'y', o.parent.y)
    }
    expUpdate(o, 'health', h)
    expUpdate(o, 'shield', sh)
    o._streak = h
  }
  expUpdate(o, 'd', _d, deg360)
  expUpdate(o, 'x', _x)
  expUpdate(o, 'y', _y)
  expUpdate(o, 'radius', d.radius)
  expUpdate(o, 'sAlpha', d.alpha)
  return o
}

const send = function(packet) {
  if(gameSocket && gameSocket.readyState === gameSocket.OPEN) {
    gameSocket.send(window.msgpack.encode(packet))
  }
}

if(!editor) {
  connect()
}

const canvas = elements[5]
let ctx = ctxs[5]
let defaultTransform = ctx.getTransform(), iDefaultTransform = defaultTransform
let canvasWidth = 0, canvasHeight = 0, iCanvasWidth = 0, iCanvasHeight = 0

let renderQuality = 1, quality = 1, cscale = 1, icscale = 1, iscale = 1, gameScale = 1, iGameScale = 1, gameW = 0, gameH = 0, screenW = 0, screenH = 0
let petalNames = true
let now = performance.now(), dt = 0
let mouse = {
  circum: {
    x: 0,
    y: 0,
  },
  in: {
    x: 0,
    y: 0,
  },
  d: 0,
  ld: 0,
  raw: {
    x: 0,
    y: 0,
    X: 0,
    Y: 0,
    left: false,
    leftX: 0,
    leftY: 0,
    right: false,
    lastLeft: 0,
  }
}

let movement = {
  lastSent: 0,
  lastAngle: false,
  angle: 0,
}

let removePetal = function(petal) {
  petal.animation = 'delete'
}

let setPetalContainer = function(petal, container) {
  let lastContainer = petal.lastContainer
  if(lastContainer) {
    lastContainer.petal = false
    if(container.petal) {
      shiftPetal(container.petal)
      setPetalContainer(container.petal, lastContainer)
    }
  } else if(container.petal) {
    return removePetal(container.petal)
  }
  container.petal = petal
  shiftPetal(petal)
  petal.container = petal.lastContainer = container
}

let shiftPetal = function(petal) {
  let i = petals.indexOf(petal)
  if(i >= 0) {
    petals.splice(i, 1)
    petals.push(petal)
  }
}

let dragPetal = {
  petal: false,
  offsetX: 0,
  offsetY: 0,
  lastContainer: false,
  startContainer: false,
  set: function(petal) {
    dragPetal.petal = petal
    dragPetal.startContainer = dragPetal.lastContainer = petal.container
    petal.dragging = true
    dragPetal.offsetX = petal.x - mouse.in.x
    dragPetal.offsetY = petal.y - mouse.in.y
    shiftPetal(petal)
  },
  release: function(dt) {
    let petal = dragPetal.petal
    if(petal) {
      petal.dragging = false
      if(dt < 200 && hoverContainer === dragPetal.startContainer) {
        menu.swap(hoverContainer.id)
      } else {
        let container = hoverContainer || petal.lastContainer
        setPetalContainer(petal, container)
      }
      dragPetal.petal = false
    }
  }
}

let cs = 1, is = 1, ics = 1 / cs, iis = 1 / is, hw = 0, hh = 0
const resize = function() {
  let scaleX = 1920 / window.innerWidth
  let scaleY = 1080 / window.innerHeight
  if(scaleX < scaleY) {
    cs = scaleX
    is = scaleY
  } else {
    cs = scaleY
    is = cs // scaleX
  }
  ics = 1 / cs
  iis = 1 / is
  tStyle.innerHTML = `
.circumscale {
  width: ${cs * 100}%;
  height: ${cs * 100}%;
  transform: scale(${ics});
}
.inscale {
  width: ${is * 100}%;
  height: ${is * 100}%;
  transform: scale(${iis});
}`
  quality = renderQuality * window.devicePixelRatio
  canvas.width = window.innerWidth * quality
  canvas.height = window.innerHeight * quality
  hw = window.innerWidth * 0.5
  hh = window.innerHeight * 0.5
  gameW = Math.round(hw * quality)
  gameH = Math.round(hh * quality)
  screenW = Math.round(window.innerWidth * quality)
  screenH = Math.round(window.innerHeight * quality)
  ctx.resetTransform()
  ctx.scale(quality, quality)
  ctx.translate(hw, hh)
  ctx.scale(ics, ics)
  defaultTransform = ctx.getTransform()
  ctx.resetTransform()
  ctx.scale(quality, quality)
  ctx.translate(hw, hh)
  ctx.scale(iis, iis)
  iDefaultTransform = ctx.getTransform()
  canvasWidth = window.innerWidth * cs
  canvasHeight = window.innerHeight * cs
  iCanvasWidth = window.innerWidth * is
  iCanvasHeight = window.innerHeight * is
  iscale = iis * quality
  cscale = ics * quality
  icscale = cs / quality
}

const drawPolygon = function(x, y, s, r, d) {
  let m = deg360 / s
  let a = d
  let ix = x + r * Math.sin(a), iy = y + r * Math.cos(a)
  ctx.moveTo(ix, iy)
  for(let i=1;i<s;i++) {
    let a = i * m + d
    ctx.lineTo(x + r * Math.sin(a), y + r * Math.cos(a))
  }
  ctx.lineTo(ix, iy)
}

const drawBackground = function(w, h, ox, oy) {
  return
  ctx.lineWidth = 18
  ctx.lineJoin = ctx.lineCap = 'round'
  let size = 130
  w = w / size + 1
  h = h / size + 1
  let cx = ox / size, cy = oy / size
  ctx.fillStyle = ctx.strokeStyle = 'rgb(28, 158, 91)'
  ctx.beginPath()
  for(let i=-Math.floor(w - cx);i<=w + cx;i++) {
    for(let u=-Math.floor(h - cy);u<=h + cy;u++) {
      let mi = i % (1e7), mu = u % (1e7)
      let z = ~~Math.abs(mi * 239432 + mu * 549234)
      z = Math.abs((z / 10) % 1)
      if(z < 0.4) {
        let x = (i) * size, y = (u) * size
        let k = ~~Math.abs(mi * 193256 + mu * 473298)
        let j = ~~Math.abs(mi * 793428 + mu * 692354)
        let q = ~~Math.abs(mi * 898343 + mu * 357452)
        let e = ~~Math.abs(mi * 204931 + mu * 282352)
        k = (((k ^ j) % 1255) * 243) % 35
        k = 40 * (Math.abs(k / 35) ** 1.5)
        q = Math.abs(q % 30) + 12 + (45 - k) / 5
        e = (e ^ j) % deg360
        drawPolygon(x - ox + q * Math.sin(e), y - oy + q * Math.cos(e), 3, k, (k / 2 + 1) % deg360)
      }
    }
  }
  ctx.fill()
  ctx.stroke()
  ctx.closePath()
  ctx.fillStyle = ctx.strokeStyle = 'rgb(31, 173, 100)'
  ctx.beginPath()
  for(let i=-Math.floor(w - cx);i<=w + cx;i++) {
    for(let u=-Math.floor(h - cy);u<=h + cy;u++) {
      let mi = i % (1e7), mu = u % (1e7)
      let z = ~~Math.abs(mi * 239432 + mu * 549234)
      z = Math.abs((z / 10) % 1)
      if(z >= 0.4) {
        let x = (i) * size, y = (u) * size
        let k = ~~Math.abs(mi * 193256 + mu * 473298)
        let j = ~~Math.abs(mi * 793428 + mu * 692354)
        let q = ~~Math.abs(mi * 898343 + mu * 357452)
        let e = ~~Math.abs(mi * 204931 + mu * 282352)
        k = (((k ^ j) % 1255) * 243) % 35
        k = 15 * (Math.abs(k / 35) ** 1.3)
        q = Math.abs(q % 30) + 25 + (15 - k) / 5
        e = (e ^ j) % deg360
        drawPolygon(x - ox + q * Math.sin(e), y - oy + q * Math.cos(e), 3, k, (k / 2 + 1) % deg360)
      }
    }
  }
  ctx.fill()
  ctx.stroke()
  ctx.closePath()
}

const r = function(color) {
  return (color & 16711680) >> 16
}
const g = function(color) {
  return (color & 65280) >> 8
}
const b = function(color) {
  return color & 255
}

const iC = 1 / 16777215

const toRgb = function(color, a) {
  return `rgba(${r(color)}, ${g(color)}, ${b(color)}, ${a || 1})`
}

const toRgbRGB = function(r, g, b, a) {
  return `rgba(${r}, ${g}, ${b}, ${a || 1})`
}

const darken = function(color, amount) {
  if(!(amount >= 0 || amount <= 0)) { amount = 40 }
  return toInt(r(color) - amount, g(color) - amount, b(color) - amount)
}

const hueF = function(n, h) {
  let k = (n + h / deg30) % deg360, a = k - deg90, b = deg270 - k
  a = a < b ? a : b
  a = 1 - (a > 1 ? 1 : (a < -1 ? -1 : a))
  return 127.5 * a
}

const hue = function(h) {
  return toInt(hueF(0, h), hueF(deg240, h), hueF(deg120, h));
}

const radiantTint = function(color, amount) {
  if(amount > 0) {
    return averageColors(color, radiantColor, amount / (amount + 1))
  }
  if(amount < 0) {
    return averageColors(color, rainbowColor, amount / (amount - 1))
  }
  return color
}

const damageFlashTint = function(color, a, damageFlashType, health, shield, globalDamageFlash) {
  if(damageFlashType === 1) {
    return averageColors(16777215, color, shield)
  }
  if(globalDamageFlash === 1) {
    return color
  }
  if(a > 0) {
    return averageColors(color, 16777215, a)
  }
  return color
}

const averageColors = function(a, c, t) {
  let u = 1 - t
  return toInt(u * r(a) + t * r(c), u * g(a) + t * g(c), u * b(a) + t * b(c))
}

let radiantColor = 0, rainbowColor = 0

const darkenRGB = function(r, g, b, amount) {
  if(!(amount >= 0 || amount <= 0)) { amount = 40 }
  return toInt(r - amount, g - amount, b - amount)
}

const drawText = function(text, x, y, s, a, c, l, m, r, f, w) {
  if(!text) { return }
  x = Math.floor(x)
  y = Math.floor(y)
  if(!(a <= 1)) { a = 1 }
  if(m) {
    ctx.miterLimit = 2
  } else {
    m = 'round'
  }
  ctx.lineJoin = ctx.lineCap = m
  ctx.font = `${w || '900'} ${s}px ${f || 'Ubuntu'}`
  ctx.fillStyle = toRgb(c || 16777215, a)
  if(!(l <= 0)) {
    ctx.strokeStyle = toRgb(r || 0, a)
    ctx.lineWidth = 2 * (l >= 0 ? l : 1)
    ctx.strokeText(text, x, y)
  }
  ctx.fillText(text, x, y)
}

const setFillStroke = function(color, a, d, b) {
  ctx.fillStyle = toRgb(color, a)
  ctx.strokeStyle = toRgb(darken(color, d), b >= 0 ? b : a)
}

const setFillStrokeRGB = function(r, g, b, a, d) {
  ctx.fillStyle = toRgbRGB(r, g, b, a)
  ctx.strokeStyle = toRgb(darkenRGB(r, g, b, d), a)
}

const drawPetalContainer = function(x, y, size, d, color, a) {
  if(a <= 0) { return }
  d = d % deg90
  let s = size * 2
  let r = ctx.lineWidth = size / 6.5, h = r / 2
  setFillStroke(color, a)
  ctx.lineJoin = ctx.lineCap = 'round'
  if(d === 0) {
    ctx.fillRect(x - size + h, y - size + h, s - r, s - r)
    ctx.strokeRect(x - size, y - size, s, s)
  } else {
    let t = ctx.getTransform()
    let sin = Math.sin(d)
    let cos = Math.cos(d)
    let w = h - size
    let d1 = w * cos - w * sin, d2 = w * cos + w * sin
    ctx.beginPath()
    ctx.moveTo(x - d1, y - d2)
    ctx.lineTo(x - d2, y + d1)
    ctx.lineTo(x + d1, y + d2)
    ctx.lineTo(x + d2, y - d1)
    ctx.fill()
    ctx.closePath()
    d1 = size * cos - size * sin
    d2 = size * cos + size * sin
    ctx.beginPath()
    ctx.moveTo(x - d1, y - d2)
    ctx.lineTo(x - d2, y + d1)
    ctx.lineTo(x + d1, y + d2)
    ctx.lineTo(x + d2, y - d1)
    ctx.lineTo(x - d1, y - d2)
    ctx.stroke()
    ctx.closePath()
  }
}

const petal = function(options) {
  return {
    screenX: 0,
    screenY: 0,
    x: 0,
    y: 0,
    d: 0,
    size: 38,
    opacity: 1,
    position: 'absolute',
    spawnTime: 0,
    container: false,
    lastContainer: false,
    shake: 0,
    type: 'basic',
    animation: false,
    dragging: false,
    ...options
  }
}

const container = function(options) {
  return {
    x: 0,
    y: 0,
    ox: 0,
    oy: 0,
    size: 50,
    osize: 50,
    ...options
  }
}

let bars = [], leaderboard = false, labels = [], layers = []

const updateUI = function(ui) {
  if(ui.menuContainers) {
    let menuLength = ui.menuContainers.length >= 0 ? ui.menuContainers.length : 0
    if(menuLength !== menu.length) {
      menu.length = menuLength
      menu.update()
    }
  } else {
    menu.length = 0
    menu.update()
  }
  if(ui.chat) {
    chatEnabled = true
    elements[12].style.visibility = ''
    elements[12].style.top = `calc(${ui.chat.percentY || 0}% + ${ui.chat.y || 0}px)`
    elements[12].style.left = `calc(${ui.chat.percentX || 0}% + ${ui.chat.x || 0}px)`
    elements[12].style.width = ui.chat.width
    let alignX = ui.chat.alignX, alignY = ui.chat.alignY
    elements[12].style.transform = `translate(${alignX === 'right' ? '-100%' : (alignX === 'center' ? '-50%' : '0')}, ${alignY === 'bottom' ? '-100%' : (alignX === 'center' ? '-50%' : '0')})`
  } else {
    chatEnabled = false
    elements[12].style.visibility = 'hidden'
  }
  if(ui.bars) {
    bars = ui.bars
  } else {
    bars = []
  }
  if(ui.leaderboard) {
    leaderboard = ui.leaderboard
  } else {
    leaderboard = false
  }
  if(ui.labels) {
    labels = ui.labels
  } else {
    labels = []
  }
  if(ui.layers) {
    layers = ui.layers
  } else {
    layers = []
  }
}

let chatEnabled = true

setTimeout(function() {
  if(editor) { return }
  updateUI({
    menuContainers: {
      length: 5
    },
    chat: {
      percentX: 0,
      percentY: 100,
      x: 50,
      y: -50,
      alignX: 'left',
      alignY: 'bottom',
      width: '400px'
    },
    bars: []
  })/*
  for(let i=0;i<10;i++) {
    let k = Object.keys(entityData)
    let p = petal({ rarity:Math.floor(Math.pow(Math.random(), 2) * 8), type:k[Math.floor(Math.random() * k.length)] })
    petals.push(p)
    p.container = menu.containers[i]
    p.container.petal = p
  }*/
  // return
  const leftUpgrades = {
    percentX: 0,
    percentY: 100,
    x: 10,
    y: -10,
    width: 520,
    height: 200,
    alignX: 'left',
    alignY: 'top',
    labels: [
      {
        text: 'x50',
        percentX: 0,
        percentY: 0,
        fill: 16777215,
        x: 405,
        y: -54,
        alignX: 'left',
        size: 45,
        lineWidth: 4.2,
        line: 'miter',
      }
    ],
    bars: []
  }, rightUpgrades = {
    percentX: 100,
    percentY: 100,
    x: -10,
    y: -10,
    width: 520,
    height: 200,
    alignX: 'right',
    alignY: 'top',
    labels: [
      {
        text: '50x',
        percentX: 0,
        percentY: 0,
        fill: 16777215,
        x: -405,
        y: -54,
        alignX: 'right',
        size: 45,
        lineWidth: 4.2,
        line: 'miter',
      }
    ],
    bars: []
  }, leftIconList = {
    percentX: 0,
    percentY: -100,
    x: 20,
    y: -178,
    width: 512,
    height: 512,
    alignX: 'left',
    alignY: 'top',
    labels: [],
    bars: [],
    iconList: {
      iconSize: 155,
      padding: 13,
      lineWidth: 7,
      hoverSizeIncrease: 0.06,
      hoverSlide: 6,
      activeSlide: 4,
      alignX: 'left',
      alignY: 'top',
      icons: [
        {
          color: 7769340
        }, {
          color: 7769340
        }, {
          color: 7769340
        }, {
          color: 7769340
        }, {
          color: 7769340
        }, {
          color: 7769340
        }, {
          color: 7769340
        }
      ]
    }
  }, rightIconList = {
    percentX: 100,
    percentY: -100,
    x: -20,
    y: -178,
    width: 512,
    height: 512,
    alignX: 'right',
    alignY: 'top',
    labels: [],
    bars: [],
    iconList: {
      iconSize: 155,
      padding: 13,
      lineWidth: 7,
      hoverSizeIncrease: 0.06,
      hoverSlide: 6,
      activeSlide: 4,
      alignX: 'right',
      alignY: 'top',
      icons: [
        {
          color: 7769340
        }, {
          color: 7769340
        }, {
          color: 7769340
        }, {
          color: 7769340
        }, {
          color: 7769340
        }, {
          color: 7769340
        }, {
          color: 7769340
        }
      ]
    }
  }
  for(let i=0;i<4;i++) {
    leftUpgrades.bars.push({
      percentX: 0,
      percentY: 0,
      x: 0,
      y: -40 * (3 - i),
      alignX: 'left',
      alignY: 'top',
      borderColor: 0,
      radius: 37,
      width: 180,
      inradius: 0.67,
      fillColor: [7769340, 16545398, 3716964, 16770155][i],
      labels: [
        {
          text: ['Reload', 'Bullet Damage', 'Bullet Speed', 'Bullet Penetration'][i],
          percentX: 50,
          percentY: 0,
          fill: 16777215,
          x: -25,
          y: 0,
          alignX: 'center',
          size: 26,
          lineWidth: 4.2,
          line: 'miter',
        }, {
          text: `[${i + 1}]`,
          percentX: 100,
          percentY: 0,
          fill: 16777215,
          x: -32,
          y: 7,
          alignX: 'right',
          size: 16,
          lineWidth: 4.2,
          line: 'miter',
        }
      ],
      rightButton: {
        width: 0.000001,
        padding: 5,
        fillColor: 16777215,
        hoverColor: 13487565,
        activeColor: 11184810,
        disabledColor: 8028292,
        labels: [
          {
            text: '+',
            percentX: 50,
            percentY: 50,
            fill: 65793,
            x: 0,
            y: -27,
            alignX: 'center',
            size: 38,
            lineWidth: 0,
          }
        ]
      }
    })
    rightUpgrades.bars.push({
      percentX: 0,
      percentY: 0,
      x: 0,
      y: -40 * (3 - i),
      alignX: 'right',
      alignY: 'top',
      borderColor: 0,
      radius: 37,
      width: 180,
      inradius: 0.67,
      fillColor: [7769340, 16545398, 3716964, 16770155][i],
      labels: [
        {
          text: ['Max Health', 'Regeneration', 'Body Damage', 'Movement Speed'][i],
          percentX: 50,
          percentY: 0,
          fill: 16777215,
          x: 25,
          y: 0,
          alignX: 'center',
          size: 26,
          lineWidth: 4.2,
          line: 'miter',
        }, {
          text: `[${i + 5}]`,
          percentX: 0,
          percentY: 0,
          fill: 16777215,
          x: 32,
          y: 7,
          alignX: 'left',
          size: 16,
          lineWidth: 4.2,
          line: 'miter',
        }
      ],
      leftButton: {
        width: 0.000001,
        padding: 5,
        fillColor: 16777215,
        hoverColor: 13487565,
        activeColor: 11184810,
        disabledColor: 8028292,
        labels: [
          {
            text: '+',
            percentX: 50,
            percentY: 50,
            fill: 65793,
            x: 0,
            y: -27,
            alignX: 'center',
            size: 38,
            lineWidth: 0,
          }
        ]
      }
    })
  }
  updateUI({
    chat: {
      percentX: 100,
      percentY: 0,
      x: -14,
      y: 330,
      alignX: 'right',
      alignY: 'top',
      width: '310px'
    },
    leaderboard: {
      percentX: 100,
      percentY: 0,
      x: -14,
      y: 14,
      alignX: 'right',
      alignY: 'bottom',
      title: {
        text: 'LEADERBOARD',
        fill: 16777215,
        percentX: -50,
        percentY: 0,
        x: 0,
        y: -6,
        alignX: 'center',
        size: 40.5,
        lineWidth: 5.5,
        line: 'miter'
      },
      width: 310,
      height: 310
    },
    layers: [
      {
        percentX: 50,
        percentY: 100,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        alignX: 'left',
        alignY: 'bottom',
        labels: [
          {
            text: 'Level 1 Node-Base',
            percentX: 0,
            percentY: 0,
            fill: 16777215,
            x: 0,
            y: -158,
            alignX: 'center',
            size: 22,
            lineWidth: 4.2,
            line: 'miter'
          }, {
            text: 'Placeholder',
            percentX: 0,
            percentY: 0,
            fill: 16777215,
            x: 0,
            y: -213,
            alignX: 'center',
            size: 50,
            lineWidth: 7,
            line: 'miter'
          }
        ],
        bars: [
          {
            percentX: 0,
            percentY: 0,
            x: 0,
            y: -10,
            alignX: 'center',
            alignY: 'top',
            borderColor: 0,
            radius: 40,
            width: 250,
            inradius: 0.65,
            fillColor: 45281,
            labels: [
              {
                text: '0 / 100',
                percentX: 50,
                percentY: 0,
                fill: 16777215,
                x: 0,
                y: -1,
                alignX: 'center',
                size: 31,
                lineWidth: 3,
                line: 'miter'
              }
            ]
          }, {
            percentX: 0,
            percentY: 0,
            x: 0,
            y: -54,
            alignX: 'center',
            alignY: 'top',
            borderColor: 0,
            radius: 37,
            width: 220,
            inradius: 0.6,
            fillColor: 45281,
            labels: [
              {
                text: 'Health: 100%',
                percentX: 50,
                percentY: 0,
                fill: 16777215,
                x: 0,
                y: 0,
                alignX: 'center',
                size: 26,
                lineWidth: 3.25,
                line: 'miter'
              }
            ]
          }, {
            percentX: 0,
            percentY: 0,
            x: 0,
            y: -95,
            alignX: 'center',
            alignY: 'top',
            borderColor: 0,
            radius: 34,
            width: 190,
            inradius: 0.55,
            fillColor: 45281,
            labels: [
              {
                text: 'Score: 1b',
                percentX: 50,
                percentY: 0,
                fill: 16777215,
                x: 0,
                y: 1,
                alignX: 'center',
                size: 22,
                lineWidth: 4.2,
                line: 'miter'
              }
            ]
          }
        ]
      },
      leftUpgrades,
      rightUpgrades,
      leftIconList,
      rightIconList
    ]
  })
})

const menu = {
  cache: {},
  containers: [],
  length: 0,
  update: function() {
    let top = [], bottom = []
    let tu = function(t) {
      t.y = (renderType === 0 ? 130 : iCanvasHeight * 0.5 - 150)
    }, bu = function(b) {
      b.y = (renderType === 0 ? 220 : iCanvasHeight * 0.5 - 60)
    }
    for(let i=0;i<menu.length;i++) {
      let d = (i - (menu.length - 1) / 2)
      let t = container({ x:90 * d, y:130, size:38, id:i, update:tu }), b = container({ x:79 * d, y:220, size:33, id:i, update:bu })
      top.push(t)
      bottom.push(b)
      t.swap = b
      b.swap = t
    }
    menu.containers = top.concat(bottom)
  },
  swap: function(i) {
    if(i * 2 >= menu.containers.length) { return }
    let container = menu.containers[i]
    if(container) {
      let swap = container.swap, petal = container.petal, petal2 = swap.petal
      container.petal = petal2
      swap.petal = petal
      if(petal2) { petal2.container = container }
      if(petal) { petal.container = swap }
    }
  },
  swapAll: function() {
    for(let i=0,l=menu.containers.length/2;i<l;i++) {
      menu.swap(i)
    }
  }
}


const isInSquare = function(tx, ty, x, y, size) {
  if(tx > x - size && ty > y - size && tx < x + size && ty < y + size) { return true }
}

menu.update()

const drawPetal = function(petal) {
  drawPetalRaw(petal, petal.screenX, petal.screenY, petal.color, petal.type, petal.rarity, petal.opacity, petal.shake, petal.d, petal.size, petal.count)
}

const drawPetalRaw = function(petal, screenX, screenY, color, type, rarity, opacity, shake, d, size, count) {
  d = (shake ? 0.15 * Math.sin(now / 150) * shake : 0) + (d || 0)
  if(!color >= 0) {
    let r = rarities[rarity]
    if(r) { color = r.color }
    else { color = 0 }
  }
  drawPetalContainer(screenX, screenY, size, d, color, opacity)
  let transform = ctx.getTransform()
  ctx.translate(screenX, screenY)
  let data = entityData[type]
  if(!data.rotationLock) {
    ctx.rotate(d)
  }
  if(data) {
    let typeData = data.data || {}
    if(!(count >= 0)) {
      count = 1
    }
    if(count > 0) {
      let raw = readDataRaw(type, rarity, 'size', 1)
      let rsize = size * 0.36 * raw
      let offsetY = petalNames ? -0.2 : 0
      if(count === 1) {
        drawObject(data.render, 0, rsize * offsetY, rsize, petal)
      } else {
        let t = ctx.getTransform()
        offsetY = rsize * offsetY
        let renderStackDistance = typeData.renderStackDistance ? typeData.renderStackDistance[count] : 1
        let d = deg360 / count, l = (0.27 + raw * 0.1) * (renderStackDistance >= 0 ? renderStackDistance : 1)
        let o = 0
        if(count >= 4) {
          o = d / 2
        }
        for(let i=0;i<deg360;i+=d) {
          ctx.translate(rsize * Math.cos(i) * l, offsetY + rsize * Math.sin(i) * l)
          ctx.rotate(i + o)
          drawObject(data.render, 0, 0, rsize, petal)
          ctx.setTransform(t)
        }
      }
    }
  }
  if(petalNames) {
    ctx.textAlign = 'center'
    ctx.resetTransform()
    drawText(data ? data.name : '', 0, petal.size * 0.7, petal.size * 0.45, 1, 16777215, petal.size * 0.03)
  }
  ctx.setTransform(transform)
}

let renderDelta = 0
let expData = {
  f: 1,
  h: 1,
  g: 25,
  b: 1,
  n: 1
}
expData.b = Math.pow(Math.E, -expData.g)

const linear = function(obj, name) {
  obj[name] = obj['o' + name] * (1 - renderDelta) + obj['n' + name] * renderDelta
}

const exp = function(obj, name) {
  let o = obj['o' + name]
  let v = obj['v' + name]
  let n = obj['n' + name]
  obj[name] = o + v * renderDelta + (n - o - v) * expData.f
}

const expUpdate = function(obj, name, value, wrap) {
  let o = obj['o' + name], e = (o >= 0 || o <= 0)
  let n = obj['n' + name]
  let v = obj['v' + name]
  if(e && (v >= 0 || v <= 0)) {
    let c = obj[name]
    obj['v' + name] = v + (n - o - v) * expData.h
    o = obj['o' + name] = c
    if(wrap > 0) {
      value = o + ((value - o) % wrap + wrap * 1.5) % wrap - wrap * 0.5
    }
  } else {
    obj[name] = value
    if(!e) {
      o = obj['o' + name] = value
    }
    v = obj['v' + name] = 0
  }
  obj['n' + name] = value
}

const updateEntity = function(entity, isSelf) {
  exp(entity, 'd')
  exp(entity, 'x')
  exp(entity, 'y')
  exp(entity, 'health')
  exp(entity, 'shield')
  exp(entity, 'radius')
  if(isSelf) {
    cameraTx = entity.x
    cameraTy = entity.y
    cameraX = slide(cameraX, cameraTx, 5)
    cameraY = slide(cameraY, cameraTy, 5)
    mouse.ld = slideAngle(mouse.ld, mouse.d, 4)
    entity.d = mouse.ld
  }
  entity.damageFlash = slide(entity.damageFlash, 0, 5)
  entity.rd = getRotation(0, entity, now)
  entity.renderRadius = entity.radius * entity.data.renderSize
  entity._mouth = (entity.attacking || entity.defending) ? 1 : 0
  entity._brow = entity.attacking ? 0 : 1
  entity.mouth = slide(entity.mouth, entity._mouth, 5)
  entity.brow = slide(entity.brow, entity._brow, 5)
  entity.eyeX = slide(entity.eyeX, Math.cos(entity.nd) * 0.073, 5)
  entity.eyeY = slide(entity.eyeY, Math.sin(entity.nd) * 0.135, 5)
  if(entity.streak > entity._streak) {
    entity.streak -= ticks * 0.08
    if(entity.streak < entity._streak) {
      entity.streak = entity._streak
    }
  } else {
    entity.streak = entity._streak
  }
  if(entity.fadeTime < 1) {
    let u = (1 - entity.fadeTime)
    entity.sizeM = (1 + u * u * 0.5)
    entity.alpha = entity.fadeTime
  } else if(entity.fadeTime > 1) {
    entity.sizeM = 1
    entity.alpha = 2 - entity.fadeTime
  } else {
    entity.sizeM = 1
    entity.alpha = 1
  }
  entity.rsize = entity.radius * entity.sizeM
  entity.rAlpha = entity.alpha * entity.sAlpha
  entity.rRadius = entity.renderRadius * entity.sizeM
  if(entity.fadeTime > 1) {
    entity.fadeTime = 2 - entity.fadeTime
  } else {
    if(entity.fadeTime > 0 && entity.removed) {
      entity.fadeTime -= ticks * 0.07
    } else {
      entity.fadeTime = 1
    }
  }
  if(entity.color >= 0) {
    let c = entity.color
    entity.renderColor = radiantTint(c, entity.radiant)
  } else {
    entity.renderColor = 0
  }
  updatePath(entity, dt, sTicks, now, false, true, cameraX, cameraY, gameW, gameH, gameScale, iGameScale, updateJoints, addParticle, 0, 1, 1, entity.rd)
  let bounds = entity.bounds
  bounds.left = Math.floor(bounds.left)
  bounds.bottom = Math.floor(bounds.bottom)
  bounds.right = Math.ceil(bounds.right)
  bounds.top = Math.ceil(bounds.top)
  if(bounds.right >= 10 && bounds.top >= 10 && bounds.left <= screenW - 10 && bounds.bottom <= screenH - 10) {
    entity.visible = true
  } else {
    entity.visible = false
  }
}

const drawEntityRaw = function(entity, x, y, size, d, radiant, renderColor, visible) {
  if(entity.type === 1) {
    let t = ctx.getTransform()
    ctx.translate(x, y)
    ctx.rotate(d)
    drawPetalRaw(null, 0, 0, null, entity.subtype, entity.rarity, 1, null, d, size, radiant)
    ctx.setTransform(t)
  } else {
    let alpha = entity.rAlpha
    if(false === visible) {
      if(!(alpha < 0.99)) {
        if(entity.context) {
          entity.context = false
        }
      }
      return
    }
    let bounds = entity.bounds
    let damageFlash = 0
    if(!(alpha < 0.99)) {
      if(entity.context) {
        entity.context = false
      }
      drawObject(entity.render, 0, 0, size, entity, radiant, renderColor, entity.damageFlash, entity.colorOffset, entity.health, entity.shield, entity.data.damageFlash)
    } else if(!(alpha < 0.01)) {
      if(!entity.context) {
        entity.context = document.createElement('canvas').getContext('2d')
      }
      ctx = entity.context
      let c = ctx.canvas
      let w = bounds.right - bounds.left, h = bounds.top - bounds.bottom
      let resized = false
      if(c.width !== w) {
        c.width = w
        resized = true
      }
      if(c.height !== h) {
        c.height = h
        resized = true
      }
      if(!resized) {
        ctx.clearRect(0, 0, w, h)
      }
      drawObject(entity.render, -bounds.left, -bounds.bottom, size, entity, radiant, renderColor, entity.damageFlash, entity.colorOffset, entity.health, entity.shield, entity.data.damageFlash)
      ctx = ctxs[5]
      ctx.globalAlpha = alpha
      ctx.drawImage(c, bounds.left, bounds.bottom)
      ctx.globalAlpha = 1
    }
  }
  if(ctx.globalAlpha < 1) { ctx.globalAlpha = 1 }
}

const updateJoints = function(joints, cos, sin, size, bounds, x, y, tx, ty, lineWidth, w, h, fd, recoilData) {
  let m = size * gameScale, left, right, bottom, top
  if(fd > 0) {
    if(recoilData) {
      let d = recoilData
      if(d.x > 0 || d.x < 0) {
        tx += d.x * fd
      }
      if(d.y > 0 || d.y < 0) {
        ty += d.y * fd
      }
      if(d.w > 1 || d.w < 1) {
        w *= 1 + (d.w - 1) * fd
      }
      if(d.h > 1 || d.h < 1) {
        h *= 1 + (d.h - 1) * fd
      }
    } else {
      tx += fd * -0.2
    }
  }
  for(let i=0,l=joints.length;i<l;i++) {
    let p = joints[i]
    if(p.type === 'moveTo' || p.type === 'lineTo') {
      let nx = (p.x + tx) * h
      let ny = (p.y + ty) * w
      p.rx = x + m * (nx * cos - ny * sin)
      p.ry = y + m * (ny * cos + nx * sin)
      left = p.rx - lineWidth
      right = p.rx + lineWidth
      bottom = p.ry - lineWidth
      top = p.ry + lineWidth
    } else if(p.type === 'ellipse') {
      let nx = (p.x + tx) * h
      let ny = (p.y + ty) * w
      p.rx = x + nx * m
      p.ry = y + ny * m
      p.rw = p.width * w * m
      p.rh = p.height * h * m
      left = p.rx - p.rw - lineWidth
      right = p.rx + p.rw + lineWidth
      bottom = p.ry - p.rh - lineWidth
      top = p.ry + p.rh + lineWidth
    }
    if(left < bounds.left) {
      bounds.left = left
    }
    if(right > bounds.right) {
      bounds.right = right
    }
    if(bottom < bounds.bottom) {
      bounds.bottom = bottom
    }
    if(top > bounds.top) {
      bounds.top = top
    }
  }
}

const drawBounds = function(e) {
  let h = 1.5, render = e.render, bounds = e.bounds
  if(render) {
    for(let i=0,l=render.length;i<l;i++) {
      let s = render[i]
      if(s) {
        drawBounds(s)
      }
    }
  }
  if(bounds && e.drawBounds) {
    let d = bounds.left - h, f = bounds.bottom - h
    ctx.beginPath()
    ctx.strokeStyle = `rgba(255, 0, 0, ${e.drawBounds})`
    ctx.rect(d, f, gameScale + bounds.right - bounds.left, gameScale + bounds.top - bounds.bottom)
    ctx.stroke()
    ctx.closePath()
  }
}

const drawEntity = function(entity) {
  let bounds = entity.bounds
  drawEntityRaw(entity, entity.rx, entity.ry, entity.rsize, entity.rd, entity.radiant, entity.color, entity.visible)
  if(0 || editor) {
    ctx.beginPath()
    ctx.lineWidth = 3
    let h = 1.5
    ctx.strokeStyle = 'rgb(255, 0, 0)'
    let s = entity.rsize * gameScale
    ctx.ellipse(entity.rx, entity.ry, s, s, 0, 0, deg360)
    ctx.stroke()
    ctx.closePath()
    drawBounds(entity)
  }
}

const drawRadiantAuraRaw = function(alpha, x, y, d, radiant, renderColor, fadeTime, csize, radiantBase) {
  if(radiant > 1) {
    let m = cscale * iCameraS
    let size = csize * m
    let radiantColor = averageColors(renderColor, 16777215, 0.5)
    setFillStroke(radiantColor, alpha * (1 - 2.1 / (2 + radiant)), 30)
    ctx.lineWidth = 4 * m
    ctx.lineCap = ctx.lineJoin = 'round'
    ctx.beginPath()
    let gleamingSize = size * (1.2 + 0.1 * radiant * (1 + Math.sin(now * 0.0003125 * (2 + radiant))))
    // gleaming aura
    if(radiantBase.type === 'path') {
      drawPath(radiantBase.joints, x, y, gleamingSize, gleamingSize, Math.cos(d), Math.sin(d))
    }
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
    if(radiant > 2) {
      setFillStroke(radiantColor, alpha, 30)
      if(radiant > 3) {
        // lustrous spikes
        let angle = (10 * Math.cos(now * 0.00004) * (1 + radiant)) % deg360
        let size3 = size * (1.5 + radiant * 0.2 + 0.06 * (1 + Math.sin(now * 0.000125 * (1 + radiant))) * radiant) * radiantBase.polygonData.size
        ctx.beginPath()
        drawPath(radiantStars[1].joints, x, y, size3, size3, Math.cos(angle), Math.sin(angle), size, size)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
      }
      // luminous spikes (2 sets)
      let spikeSize = (radiant + 2) * 0.1
      let spikeCos = Math.cos(now * 0.002)
      // first size
      let size1 = size * (spikeSize * spikeCos + 1)
      // second size
      let size2 = size * (1 - spikeSize * spikeCos)
      // rotation
      let rotate = ((now * 0.00025) * (1 + radiant)) % deg360;
      let sin = Math.sin(rotate), cos = Math.cos(rotate)
      let star = 1, sides = radiantBase.polygonData.sides
      // star ratio is different for triangle, square, and pentagon
      // separate paths have been prepared
      if(sides >= 3 && sides < 6) {
        star = 1 / (4 - sides * 0.5)
      }
      let joints = radiantStars[0].joints
      ctx.beginPath()
      let _size1 = size1 * star
      drawPath(joints, x, y, size1, size1, cos, sin, _size1, _size1)
      ctx.fill()
      ctx.stroke()
      ctx.closePath()
      ctx.beginPath()
      let _size2 = size2 * star
      drawPath(joints, x, y, size2, size2, cos, -sin, _size2, _size2)
      ctx.fill()
      ctx.stroke()
      ctx.closePath()
    }
  }
}

const getRadiantBoundsRaw = function(size, radiant, radiantBase) {
  let s = 0
  if(radiant > 1) {
    let gleamingSize = size * (1.2 + 0.2 * radiant)
    if(gleamingSize > s) { s = gleamingSize }
    if(radiant > 2) {
      if(radiant > 3) {
        let lustrousSize = size * (1.5 + 0.32 * radiant) * radiantBase.polygonData.size
        if(lustrousSize > s) { s = lustrousSize }
      }
      let luminousSize = size * (radiant * 0.1 + 1.2)
      if(luminousSize > s) { s = luminousSize }
    }
  }
  return s > 0 ? s + 2 : s
}

const getRadiantBounds = function(entity) {
  return getRadiantBoundsRaw(entity.rRadius, entity.radiant, entity.radiantBase)
}

const drawRadiantAura = function(entity) {
  if(entity.radiant <= 1) { return }
  let s = getRadiantBoundsRaw(entity.rRadius, entity.radiant, entity.radiantBase) * cscale * iCameraS
  if(entity.rx + s >= 10 && entity.ry + s >= 10 && entity.rx - s <= screenW - 10 && entity.ry - s <= screenH - 10) {
    drawRadiantAuraRaw(entity.rAlpha, entity.rx, entity.ry, entity.rd, entity.radiant, entity.renderColor, entity.fadeTime, entity.rRadius, entity.radiantBase)
  }
  if(0 && s > 0) {
    ctx.beginPath()
    ctx.lineWidth = 2 * gameScale
    let h = gameScale
    ctx.strokeStyle = 'rgb(255, 0, 0)'
    ctx.rect(entity.rx - s - h, entity.ry - s - h, s * 2 + h * 2, s * 2 + h * 2)
    ctx.stroke()
    ctx.closePath()
  }
}

const drawHealthBarRaw1 = function(sizeM, alpha, x, y, radius, inradius, fadeTime, health, shield, streak, name, rarity, showName, renderColor, healthBarType, healthBarFade) {
  if(!(healthBarType === 0)) {
    return
  }
  ctx.lineCap = 'round'
  if(healthBarType === 0) {
    let rsize = sizeM * (0.1 * radius + 40)
    let ox = x - rsize, oy = y + radius * sizeM + 25, s2 = rsize * 2
    ctx.beginPath()
    ctx.moveTo(ox, oy)
    ctx.lineTo(x + rsize, oy)
    ctx.lineWidth = 8
    ctx.strokeStyle = toRgbRGB(0, 0, 0, alpha)
    ctx.stroke()
    ctx.lineWidth = 6
    if(health < 1) {
      ctx.strokeStyle = toRgbRGB(80, 0, 0, alpha)
      ctx.stroke()
    }
    ctx.closePath()
    if(streak > health) {
      ctx.beginPath()
      ctx.moveTo(ox, oy)
      ctx.lineTo(ox + s2 * streak, oy)
      ctx.strokeStyle = toRgbRGB(200, 0, 0, alpha)
      ctx.stroke()
      ctx.closePath()
    }
    ctx.beginPath()
    ctx.moveTo(ox, oy)
    ctx.lineTo(ox + s2 * health, oy)
    let f = 1
    if(health < 0.1) {
      f = health * 10
    }
    ctx.strokeStyle = toRgbRGB(117 + 83 * (1 - f), 221 * f, 52 * f, alpha)
    ctx.stroke()
    ctx.closePath()
    if(true || showName) {
      let t = ctx.getTransform()
      ctx.resetTransform()
      let type = name || 'undefined'
      let width = ctx.measureText(type).width
      let textX, textY = oy - 8
      if(width > rsize * 2) {
        ctx.textAlign = 'center'
        textX = x
      } else {
        ctx.textAlign = 'left'
        textX = ox - 3
      }
      drawText(type, textX * cscale + gameW, textY * cscale + gameH, 14 * cscale, alpha)
      rarity = rarity || 0
      let rarityText = rarities[rarity].name
      width = ctx.measureText(rarityText).width
      textY = oy + 15
      if(width > rsize * 2) {
        ctx.textAlign = 'center'
        textX = x
      } else {
        ctx.textAlign = 'right'
        textX = x + rsize + 3
      }
      drawText(rarityText, textX * cscale + gameW, textY * cscale + gameH, 14 * cscale, alpha, rarities[rarity].color)
      ctx.setTransform(t)
    }
  }
}
const drawHealthBarRaw2 = function(sizeM, alpha, x, y, radius, inradius, fadeTime, health, shield, streak, name, rarity, showName, renderColor, healthBarType, healthBarFade) {
  if(!(healthBarType === 1 || healthBarType === 2)) {
    return
  }
  if(showName) {
    ctx.lineCap = 'round'
    if(healthBarType === 1) {
      let ty = y - radius * (sizeM + 0.5)
      let t = ctx.getTransform()
      ctx.resetTransform()
      let nc = cscale * iCameraS
      let nr = radius * nc
      ctx.textAlign = 'center'
      drawText('0.00m', x * nc + gameW, ty * nc + gameH, nr * 0.3, alpha, false, nr * 0.03, false, 4737096, false, '700')
      drawText(name, x * nc + gameW, (ty - 0.4 * radius) * nc + gameH, nr * 0.6, alpha, false, nr * 0.06, false, 4737096, false, '700')
      ctx.setTransform(t)
    } else if(healthBarType === 2) {
      let ty = y - radius * sizeM - 12
      let t = ctx.getTransform()
      ctx.resetTransform()
      ctx.textAlign = 'center'
      drawText('lv. 1', x, ty, 18, alpha, false, 4)
      drawText(name, x, ty - 18, 28, alpha, false, 4)
      ctx.setTransform(t)
    }
  }
}
const drawHealthBarRaw3 = function(sizeM, alpha, x, y, radius, inradius, fadeTime, health, shield, streak, name, rarity, showName, renderColor, healthBarType, healthBarFade) {
  if(!(healthBarType === 1 || healthBarType === 2)) {
    return
  }
  ctx.lineCap = 'round'
  if(healthBarType === 1) {
    alpha *= healthBarFade
    if(alpha > 0.01) {
      let rsize = sizeM * inradius
      let ox = x - rsize, oy = y + radius * sizeM + 12, s2 = rsize * 2
      ctx.beginPath()
      ctx.moveTo(ox, oy)
      ctx.lineTo(x + rsize, oy)
      ctx.lineWidth = 8
      ctx.strokeStyle = toRgb(4737096, alpha)
      ctx.stroke()
      ctx.lineWidth = 4
      ctx.closePath()
      if(streak > health) {
        ctx.beginPath()
        ctx.moveTo(ox, oy)
        ctx.lineTo(ox + s2 * streak, oy)
        ctx.strokeStyle = toRgb(12183678, alpha * 0.1)
        ctx.stroke()
        ctx.closePath()
      }
      ctx.beginPath()
      ctx.moveTo(ox, oy)
      ctx.lineTo(ox + s2 * health, oy)
      ctx.strokeStyle = toRgb(12183678, alpha)
      ctx.stroke()
      ctx.closePath()
      let sh = alpha * 0.5
      if(shield < 0.25) {
        sh *= shield * 4
      }
      if(sh > 0.01) {
        ctx.beginPath()
        ctx.moveTo(ox, oy)
        ctx.lineTo(ox + s2 * shield, oy)
        ctx.strokeStyle = toRgb(8181728, sh)
        ctx.stroke()
        ctx.closePath()
      }
    }
  } else if(healthBarType === 2) {
    let rsize = sizeM * radius
    let ox = x - rsize, oy = y + radius * sizeM + 12, s2 = rsize * 2
    ctx.beginPath()
    ctx.moveTo(ox, oy)
    ctx.lineTo(x + rsize, oy)
    ctx.lineWidth = 8
    ctx.strokeStyle = toRgbRGB(0, 0, 0, alpha)
    ctx.stroke()
    ctx.lineWidth = 4
    if(health < 1) {
      ctx.strokeStyle = toRgb(renderColor, alpha * 0.1)
      ctx.stroke()
    }
    ctx.closePath()
    if(streak > health) {
      ctx.beginPath()
      ctx.moveTo(ox, oy)
      ctx.lineTo(ox + s2 * streak, oy)
      ctx.strokeStyle = toRgb(renderColor, alpha * 0.25)
      ctx.stroke()
      ctx.closePath()
    }
    ctx.beginPath()
    ctx.moveTo(ox, oy)
    ctx.lineTo(ox + s2 * health, oy)
    let f = 1
    if(health < 0.1) {
      f = health * 10
    }
    ctx.strokeStyle = toRgb(renderColor, alpha)
    ctx.stroke()
    ctx.closePath()
  }
}
const drawHealthBar1 = function(entity) {
  if(entity.visible === false) { return }
  let t = entity.data.healthBarType
  if(t === 1) {
    entity.healthBarFade = slide(entity.healthBarFade, (entity.nhealth > 0.99 && (entity.nshield > 0.99 || entity.nshield === 0)) ? 0 : 1, 5)
  } else {}
  drawHealthBarRaw1(entity.sizeM, entity.rAlpha, entity.x - cameraX, entity.y - cameraY, entity.renderRadius, entity.radius, entity.fadeTime, entity.health, entity.shield, entity.streak, entity.name, entity.rarity, entity.showName, entity.renderColor, t, entity.healthBarFade)
}
const drawHealthBar2 = function(entity) {
  if(entity.visible === false) { return }
  drawHealthBarRaw2(entity.sizeM, entity.rAlpha, entity.x - cameraX, entity.y - cameraY, entity.renderRadius, entity.radius, entity.fadeTime, entity.health, entity.shield, entity.streak, entity.name, entity.rarity, entity.showName, entity.renderColor, entity.data.healthBarType, entity.healthBarFade)
}
const drawHealthBar3 = function(entity) {
  if(entity.visible === false) { return }
  drawHealthBarRaw3(entity.sizeM, entity.rAlpha, entity.x - cameraX, entity.y - cameraY, entity.renderRadius, entity.radius, entity.fadeTime, entity.health, entity.shield, entity.streak, entity.name, entity.rarity, entity.showName, entity.renderColor, entity.data.healthBarType, entity.healthBarFade)
}

const draw2 = function(e) {
  let x = e.x - cameraX, y = e.y - cameraY, radius = e.radius
  let alpha = 1
  if(e.fadeTime < 1) {
    let u = (1 - e.fadeTime)
    radius *= 1 + u * u * 0.5
    alpha = e.fadeTime
  } else if(e.fadeTime > 1) {
    alpha = 2 - e.fadeTime
  }
  setFillStrokeRGB(255, 0, 0, alpha)
  let fill = ctx.fillStyle
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.ellipse(x, y, radius, radius, 0, 0, deg360)
  ctx.fill()
  ctx.stroke()
  ctx.closePath()
}

const drawFlower = function(flower, x, y, radius, color) {
  let alpha = 1
  if(flower) {
    if(flower.fadeTime < 1) {
      let u = (1 - flower.fadeTime)
      radius *= 1 + u * u * 0.5
      alpha = flower.fadeTime
    } else if(flower.fadeTime > 1) {
      alpha = 2 - flower.fadeTime
    }
  }
  setFillStroke(color, alpha)
  let fill = ctx.fillStyle
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.ellipse(x, y, radius, radius, 0, 0, deg360)
  ctx.fill()
  ctx.stroke()
  ctx.closePath()

  ctx.fillStyle = ctx.strokeStyle = toRgbRGB(13, 13, 10, alpha)
  ctx.beginPath()
  let sideOffset = radius * 0.29, eyeHeight = y - radius * 0.21, width = radius * 0.15, height = radius * 0.27
  ctx.ellipse(x - sideOffset, eyeHeight, width, height, 0, 0, deg360)
  ctx.ellipse(x + sideOffset, eyeHeight, width, height, 0, 0, deg360)
  ctx.fill()
  ctx.closePath()

  ctx.lineWidth = radius * 0.0667
  ctx.lineCap = 'round'

  ctx.beginPath()
  let t = y + radius * 0.4, o = 0.04 * radius
  ctx.moveTo(x + height, t)
  ctx.quadraticCurveTo(x, y + o * (15 - 9 * (flower ? flower.mouth || 0 : 0)), x - height, t);
  ctx.stroke();

  ctx.save()
  ctx.beginPath();
  width *= 0.6
  height *= 0.7
  ctx.ellipse(x - sideOffset, eyeHeight, width, height, 0, 0, deg360)
  ctx.ellipse(x + sideOffset, eyeHeight, width, height, 0, 0, deg360)
  ctx.clip();
  ctx.closePath();

  let eyeX = (flower ? flower.eyeX || 0 : 0) * radius
  eyeHeight += (flower ? flower.eyeY || 0 : 0) * radius
  let eyeRadius = radius * 0.125
  ctx.fillStyle = toRgbRGB(240, 240, 240, alpha)
  ctx.beginPath();
  ctx.ellipse(x + sideOffset + eyeX, eyeHeight, eyeRadius, eyeRadius, 0, 0, deg360);
  ctx.ellipse(x - sideOffset + eyeX, eyeHeight, eyeRadius, eyeRadius, 0, 0, deg360);
  ctx.fill();
  ctx.closePath();
  ctx.restore()

  ctx.fillStyle = fill
  let offset = (flower ? flower.brow || 0 : 0) * radius * 0.2
  ctx.beginPath();
  let dx = radius * 0.57, sy = y - radius * 0.55
  ctx.moveTo(x - dx, sy - offset);
  ctx.lineTo(x + dx, sy - offset);
  ctx.lineTo(x, y - radius * 0.21 - offset);
  ctx.fill();
  ctx.closePath();
}

const gameStart = function(data) {
  initGame()
}

const initGame = function() {
  cameraX = 0
  cameraY = 0
  cameraTx = 0
  cameraTy = 0
  gameEntities = {}
  gameParticlesUnder = []
  gameParticlesOver = []
  menu.cache = {}
  firstUpdate = true
}

const joinGame = function() {
  send([packetJoinGame, elements[1].value || ''])
}

let petals = []

const gameContainers = []/*
for(let x=-2;x<3;x++) {
  for(let y=-2;y<3;y++) {
    let ix = x, iy = y, c
    gameContainers.push(c = container({ x:0, y:0, size:20, layer:1, update:function(t) {
      let r = is * ics * iCameraS
      t.x = -(cameraX + ix * 50) * r
      t.y = -(cameraY + iy * 50) * r
      t.size = 20 * r
    } }))
    let k = Object.keys(entityData)
    let p = petal({ rarity:Math.floor(Math.pow(Math.random(), 2) * 8), type:k[Math.floor(Math.random() * k.length)] })
    petals.push(p)
    c.petal = p
    p.container = c
  }
}*/

const slide = function(a, b, c) {
  c = Math.pow(c, 1 / sTicks)
  return (b + a * (c - 1)) / c
}

const angleDir = function(a, b) {
  let c = ((b - a) % deg360 + deg360) % deg360, e = c - deg360
  return c < -e ? c : e
}

const slideAngle = function(a, b, c) {
  c = Math.pow(c, 1 / sTicks)
  return a + angleDir(a, b) / c
}

let hoverContainer = false
let hoverPetal = false

let cameraX = 0, cameraY = 0, cameraTx = 0, cameraTy = 0, cameraS = 0.1, _cameraS = 1, iCameraS, cameraZ = 1, cameraSlide = 15

let lastDraw = performance.now(), ticks = 1, sTicks = 1

const updateContainers = function(containers) {
  for(let i=0,l=containers.length;i<l;i++) {
    let container = containers[i], petal = container.petal
    if(container.update) { container.update(container) }
    if(petal) {
      petal.x += container.x - container.ox
      petal.y += container.y - container.oy
      petal.size *= container.size / container.osize
    }
    container.ox = container.x
    container.oy = container.y
    container.osize = container.size
    if(isInSquare(mouse.in.x, mouse.in.y, container.x, container.y, container.size)) {
      if(hoverContainer) {
        if((container.layer || 0) < (hoverContainer.layer || 0)) {
          hoverContainer = container
        }
      } else {
        hoverContainer = container
      }
    }
    let layer = container.layer || 0
    if(layer < 0) { layer = 0 }
    if(layer > 3) { layer = 3 }
    if(containerLayers[layer]) {
      containerLayers[layer].push(container)
    } else {
      let l = containerLayers[layer] = []
      l.push(container)
    }
  }
}

const drawContainers = function(containers) {
  if(containers) {
    for(let i=0,l=containers.length;i<l;i++) {
      let container = containers[i], petal = container.petal
      drawPetalContainer(container.x, container.y, container.size, 0, toInt(212, 212, 212), 0.7)
      if(petal && !petal.dragging) {
        drawGamePetal(petal)
      }
    }
  }
}

const drawGamePetal = function(petal) {
  if(petal.update) {
    petal.update(petal)
  }
  if(petal.position === 'absolute') {
    petal.screenX = petal.x
    petal.screenY = petal.y
  }
  drawPetal(petal)
  if(isInSquare(mouse.in.x, mouse.in.y, petal.screenX, petal.screenY, petal.size)) { hoverPetal = petal }
}

let gameEntities = {}, removedEntities = []
let gameParticlesUnder = [], gameParticlesOver = []
let attacking = false, defending = false
let keyboardMovement = true, containerLayers = []
let lastPacket = false
let resolvePosition = function(percent, v, f) {
  return percent * f * 0.01 + v
}
let resolveInPosition = function(percent, v, f) {
  return f * (percent * 0.02 - 1) + v
}
let resolveX = function(align, size) {
  return align === 'right' ? -size : (align === 'center' ? -size * 0.5 : 0)
}
let resolveY = function(align, size) {
  return align === 'top' ? -size : (align === 'center' ? -size * 0.5 : 0)
}
let isInCircle = function(x, y, cx, cy, r) {
  x -= cx
  y -= cy
  if(x > r || y > r || x < -r || y < -r) {
    return false
  }
  if(x * x + y * y > r * r) {
    return false
  }
  return true
}
const drawBars = function(bars, iw, ih, dx, dy) {
  for(let i=0,l=bars.length;i<l;i++) {
    let bar = bars[i], h = bar.radius, ow = 2 * bar.width, w = ow + h, hh = h * 0.5
    let x = dx + resolvePosition(bar.percentX, bar.x, iw) + resolveX(bar.alignX, w)
    let y = dy + resolvePosition(bar.percentY, bar.y, ih) + resolveY(bar.alignY, h)
    let ix = x + hh, iy = y + hh, mx = ix + ow, ir = bar.radius * bar.inradius
    let lx = ix, rx = mx
    ctx.beginPath()
    ctx.moveTo(ix, iy)
    ctx.lineTo(mx, iy)
    ctx.strokeStyle = toRgb(bar.borderColor)
    ctx.lineWidth = bar.radius
    ctx.stroke()
    ctx.closePath()
    if(bar.leftButton) {
      ctx.beginPath()
      ctx.lineWidth = ir
      let l = ix + bar.leftButton.width
      ctx.moveTo(l, iy)
      ctx.lineTo(ix, iy)
      let hr = ir * 0.5
      let state = checkButton(bar.leftButton, isInCircle(mouse.in.x, mouse.in.y, ix, iy, hr))
      ctx.strokeStyle = toRgb(state === 0 ? bar.leftButton.fillColor : (state === 1 ? bar.leftButton.hoverColor : bar.leftButton.activeColor))
      ctx.stroke()
      ctx.closePath()
      lx += ir + bar.leftButton.width + bar.leftButton.padding
      drawLayer(bar.leftButton, bar.leftButton.width + ir, ir, l - hr, iy - hr)
    }
    if(bar.rightButton) {
      ctx.beginPath()
      ctx.lineWidth = ir
      let l = mx - bar.rightButton.width
      ctx.moveTo(l, iy)
      ctx.lineTo(mx, iy)
      let hr = ir * 0.5
      let state = checkButton(bar.rightButton, isInCircle(mouse.in.x, mouse.in.y, mx, iy, hr))
      ctx.strokeStyle = toRgb(state === 0 ? bar.rightButton.fillColor : (state === 1 ? bar.rightButton.hoverColor : bar.rightButton.activeColor))
      ctx.stroke()
      ctx.closePath()
      rx -= ir + bar.rightButton.width + bar.rightButton.padding
      drawLayer(bar.rightButton, bar.rightButton.width + ir, ir, l - hr, iy - hr)
    }
    ctx.beginPath()
    ctx.moveTo(lx, iy)
    ctx.lineTo(rx, iy)
    ctx.strokeStyle = toRgb(bar.fillColor)
    ctx.lineWidth  = ir
    ctx.stroke()
    ctx.closePath()
    if(bar.labels) {
      drawLabels(bar.labels, ow, h, ix, y)
    }
  }
}
const drawLabels = function(labels, iw, ih, dx, dy) {
  for(let i=0,l=labels.length;i<l;i++) {
    let label = labels[i]
    let x = dx + resolvePosition(label.percentX, label.x, iw)
    let y = dy + resolvePosition(label.percentY, label.y, ih) + label.size
    ctx.textAlign = label.alignX
    let t = ctx.getTransform()
    ctx.resetTransform()
    drawText(label.text, x * iscale + gameW, y * iscale + gameH, label.size * iscale, 1, label.fill, label.lineWidth * iscale, label.line)
    ctx.setTransform(t)
  }
}
const hsqrt2 = Math.sqrt(2) * 0.125
const drawIconList = function(iconList, iw, ih, dx, dy) {
  let iconSize = iconList.iconSize, icons = iconList.icons, length = icons.length, padding = iconList.padding, lineWidth = iconList.lineWidth, hlw = lineWidth * 0.5
  let iconData = iconList.iconData
  if(!iconData) {
    iconData = iconList.iconData = {}
  }
  let columns = Math.floor((iw + padding) / (iconSize + padding))
  if(columns < 1) {
    columns = 1
  }
  let icm = 1 / columns, icsx = iconSize + padding + lineWidth, icsy = icsx, hs = iconSize * 0.5
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  let sx = dx + hs, sy = dy - hs
  if(iconList.alignX === 'left') {
    sx += hlw
  } else {
    sx = dx + iw - hs - hlw
    icsx = -icsx
  }
  if(iconList.alignY === 'bottom') {
    sy += iconSize + hlw
  } else {
    icsy = -icsy
    sy += ih - hlw
  }
  for(let i=0;i<length;i++) {
    let x = i % columns, y = Math.floor(i * icm)
    let icon = icons[i]
    let data = iconData[i]
    if(!data) {
      iconData[i] = data = {
        size: 1,
        light: 0,
      }
    }
    let tx = sx + x * icsx, ty = sy + y * icsy
    let is = iconSize * data.size, hs = is * 0.5
    let bhs = hs + lineWidth * hsqrt2
    let size = 1, light = 0
    let state = checkButton(icon, isInSquare(mouse.in.x, mouse.in.y, tx, ty, bhs, bhs))
    let hoverSlide = iconList.hoverSlide
    if(state === 1) {
      size = 1 + iconList.hoverSizeIncrease
      light = 30
    } else if(state === 2) {
      light = 30
      hoverSlide = iconList.activeSlide
    }
    let c = darken(icon.color, -data.light)
    let c2 = darken(c, 30)
    data.size = slide(data.size, size, hoverSlide)
    data.light = slide(data.light, light, hoverSlide)
    // 30 down
    ctx.fillStyle = toRgb(c)
    ctx.fillRect(tx - hs, ty - hs, is, hs)
    ctx.fillStyle = toRgb(c2)
    ctx.fillRect(tx - hs, ty, is, hs)
    ctx.beginPath()
    ctx.roundRect(tx - hs, ty - hs, is, is, 8)
    ctx.strokeStyle = 'rgb(0, 0, 0)'
    ctx.lineWidth = lineWidth
    ctx.stroke()
    ctx.closePath()
  }
}
const drawLayer = function(layer, iw, ih, dx, dy) {
  let x = dx + (layer.percentX >= 0 || layer.percentY <= 0 ? resolvePosition(layer.percentX, layer.x, iw) : 0)
  let y = dy + (layer.percentY >= 0 || layer.percentY <= 0 ? resolvePosition(layer.percentY, layer.y, ih) : 0)
  let rx = x + (layer.alignX ? resolveX(layer.alignX, layer.width) : 0)
  let ry = y + (layer.alignY ? resolveY(layer.alignY, layer.height) : 0)
  let width = iw, height = ih
  if(layer.alignX && layer.alignY) {
    if(layer.width >= 0) {
      width = layer.width
    } if(layer.height >= 0) {
      height = layer.height
    }
  }
  if(layer.bars) {
    drawBars(layer.bars, width, height, x, y)
  }
  if(layer.labels) {
    drawLabels(layer.labels, width, height, x, y)
  }
  if(layer.iconList) {
    drawIconList(layer.iconList, width, height, rx, ry)
  }
  if(layer.layers) {
    drawLayers(layer.layers, width, height, rx, ry)
  }
  //ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  //ctx.fillRect(rx, ry, width, height)
}
const drawLayers = function(layers, iw, ih, dx, dy) {
  for(let i=0,l=layers.length;i<l;i++) {
    drawLayer(layers[i], iw, ih, dx, dy)
  }
}
let lastButton = false
const onButtonClick = function(button) {
  console.log(button)
}
const checkButton = function(obj, hover) {
  if(!hover && lastButton === obj) {
    lastButton = false
  }
  if(hover) {
    pointer = true
  }
  if(mouse.raw.left) {
    if(hover) {
      if(lastButton === obj || mouse.raw.leftDown) {
        lastButton = obj
        return 2
      }
      return 1
    }
  } else if(hover) {
    if(lastButton === obj) {
      lastButton = false
      onButtonClick(obj)
    }
    return 1
  }
  return 0
}
let pointer = false
let prevDelta = 1
const gameStateUpdate = function(dt, now) {
  waitingForStateUpdate = false
  let stateTime = now
  let stateLength = gameStates.length
  if(stateLength > 0) {
    let top = gameStates[0], next = gameStates[1]
    if(top.t <= stateTime) {
      if(lastPacket !== top) {
        lastPacket = top
        renderDelta = 0
        runGameUpdate(top.d)
      }
      if(next) {
        if(next.t <= stateTime) {
          gameStates.splice(0, 1)
          top = next
          next = gameStates[1]
        }
      }
    }
    if(next) {
      prevDelta = next.t - top.t
      renderDelta += dt / prevDelta
    } else {
      renderDelta += dt * 0.02 / sendM
    }
  }
  if(renderDelta > 1) {
    renderDelta = 1
  }
}
const drawParticleRaw = function(rx, ry, size, sides, cs, darkness, strokePercent, strokeColor, strokeAlpha, rstroke, reverseOrder, fixedLineWidth, lineWidth, noFill, time, timeSpeed, radiant, anchor) {
  if(anchor) {
    rx = anchor.rx + (rx + cameraX) * gameScale
    ry = anchor.ry + (ry + cameraY) * gameScale
  } else {
    rx = rx * gameScale + gameW
    ry = ry * gameScale + gameH
  }
  let rsize = size * gameScale
  if(sides < -20) { sides = -20 }
  else if(sides > 20) { sides = 20 }
  let j = particles[sides]
  if(j) {
    let alpha = 1, length = timeSpeed * 20
    if(time < 0.5) {
      if(time < length) {
        alpha = time / length
      }
    } else if(1 - time < length) {
      alpha = (1 - time) / length
    }
    cs = radiantTint(cs, radiant)
    if(darkness > 0) {
      cs = averageColors(cs, 65793, darkness)
    }
    if(strokePercent >= 0) {
      ctx.fillStyle = toRgb(cs, alpha)
      ctx.strokeStyle = toRgb(averageColors(cs, strokeColor, strokePercent), alpha * (strokeAlpha >= 0 ? strokeAlpha : 1))
    } else {
      setFillStroke(cs, alpha, rstroke, alpha * (strokeAlpha >= 0 ? strokeAlpha : 1))
    }
    let stroke = false, fill = true, lineWidthM = reverseOrder ? 2 : 1
    if(fixedLineWidth) {
      ctx.lineWidth = fixedLineWidth * gameScale * lineWidthM
      stroke = true
    } else {
      if(lineWidth) {
        ctx.lineWidth = lineWidth * size * gameScale * lineWidthM
        stroke = true
      }
    }
    if(noFill) {
      fill = false
    }
    ctx.beginPath()
    drawPath(j.joints, rx, ry, rsize, rsize)
    if(reverseOrder) {
      ctx.stroke()
      if(fill) {
        ctx.fill('nonzero')
      }
    } else {
      if(fill) {
        ctx.fill()
      }
      if(stroke) {
        ctx.stroke()
      }
    }
    ctx.closePath()
  }
}
const drawParticle = function(particle) {
  drawParticleRaw(particle.x - cameraX, particle.y - cameraY, particle.size, particle.sides, particle.color, particle.darkness, particle.strokePercent, particle.strokeColor, particle.strokeAlpha, particle.stroke, particle.reverseOrder, particle.fixedLineWidth, particle.lineWidth, particle.noFill, particle.time, particle.timeSpeed, particle.radiant, particle.anchor)
}
const updateParticle = function(particle, array, index) {
  particle.time -= sTicks * particle.timeSpeed
  if(particle.time < 0) {
    array.splice(index, 1)
    return
  }
  particle.x += particle.xv * sTicks
  particle.y += particle.yv * sTicks
  if(particle.startSize >= 0 && particle.endSize >= 0) {
    particle.size = particle.startSize * (1 - particle.time) + particle.endSize * particle.time
  }
  if(particle.friction < 1 || particle.friction > 1) {
    let f = Math.pow(particle.friction, sTicks)
    particle.xv *= f
    particle.yv *= f
  }
}
const addParticle = function(type, x, y, xv, yv, size, d, sides, color, time, alpha, radiant, friction, endSize, anchor) {
  const o = {
    x: x,
    y: y,
    xv: xv,
    yv: yv,
    d: d,
    sides: sides,
    color: color,
    time: 1,
    timeSpeed: 1 / time,
    alpha: alpha,
    radiant: radiant,
    friction: friction,
    size: size,
    darkness: 0,
    fixedLineWidth: 4,
    stroke: 30
  }
  if(endSize >= 0) {
    o.startSize = size
    o.endSize = endSize * size
  }
  if(anchor) {
    o.anchor = anchor
  }
  if(type === 'under') {
    gameParticlesUnder.push(o)
  } else if(type === 'over') {
    gameParticlesOver.push(o)
  }
}
const draw = function() {
  pointer = false
  if(cameraZ < 0) {
    cameraZ = 0
  } else if(cameraZ > 1) {
    cameraZ = 1
  }
  now = performance.now()
  let radiantR = now * 0.002, rainbowR = now * 0.0008
  radiantColor = toInt(127.5 * (1 + Math.sin(radiantR)), 127.5 * (1 + Math.sin(radiantR + deg60)), 127.5 * (1 + Math.sin(radiantR + deg120)))
  rainbowColor = hue(rainbowR)
  containerLayers = []
  let tx = mouse.in.x, ty = mouse.in.y
  let overrideInputs = false
  if(dragPetal.petal) {
    overrideInputs = true
  }
  if(overrideInputs) {
    attacking = keys[' '] ? true : false
    defending = keys['Shift'] ? true : false
  } else {
    attacking = keys[' '] || mouse.raw.left ? true : false
    defending = keys['Shift'] || mouse.raw.right ? true : false
  }
  if(now - movement.lastSent > 20) {
    let s = 0
    if(keyboardMovement) {
      let x = (keys['d'] ? 1 : 0) - (keys['a'] ? 1 : 0)
      let y = (keys['s'] ? 1 : 0) - (keys['w'] ? 1 : 0)
      if(x || y) {
        movement.angle = Math.round(Math.atan2(y, x) / deg360 * 100 + 100) % 100
      } else {
        s = 100
      }
    } else {
      let r = Math.sqrt(mouse.in.x * mouse.in.x + mouse.in.y * mouse.in.y)
      if(overrideInputs) {
        r = 0
      }
      if(r < 300) {
        s = Math.round(100 - r / 3)
      }
      movement.angle = Math.round(mouse.d / deg360 * 100 + 100) % 100
    }
    movement.lastSent = now
    let b = (attacking ? 1 : 0) | (defending ? 2 : 0)
    let gameX = Math.round(mouse.circum.x), gameY = Math.round(mouse.circum.y)
    send([packetInput, movement.angle, s, b, gameX, gameY])
  }
  let petalSwaps = [packetSwap], needSwap = false
  for(let i=0;i<menu.length;i++) {
    let petal = menu.containers[i].petal
    let cache = menu.cache[i]
    if(!cache || cache !== petal) {
      menu.cache[i] = petal
      petalSwaps.push(petal ? [i, petal.type, petal.rarity] : [i])
      needSwap = true
    }
  }
  if(needSwap) {
    send(petalSwaps)
  }
  dt = now - lastDraw
  gameStateUpdate(dt, now)
  expData.n = Math.pow(expData.b, renderDelta) - 1
  expData.f = (expData.g * renderDelta + expData.n) / (expData.g + expData.n)
  expData.h = -(expData.g * expData.n) / (expData.g + expData.n)
  ticks = dt / 1000 * 60
  if(ticks < 0.1) { ticks = 0.1 } else if(ticks > 3) { ticks = 3 }
  sTicks = (sTicks * 99 + ticks) / 100
  elements[7].setAttribute('stroke', `${Math.ceil(60 / sTicks)}fps`)
  lastDraw = now
  ctx.setTransform(defaultTransform)
  let w = canvasWidth * 0.5, h = canvasHeight * 0.5
  ctx.clearRect(-w, -h, canvasWidth, canvasHeight)
  ctx.fillStyle = toRgb(2008929)
  ctx.fillStyle = toRgb(13487565)
  ctx.fillStyle = toRgb(14408667)
  ctx.fillRect(-w, -h, canvasWidth, canvasHeight)
  let cameraSZ = _cameraS * cameraZ
  if(renderType === 0) {
    cameraTx += dt * 0.1
    cameraTy = Math.sin(now / 5000) * 500
    cameraSZ = _cameraS = 1
    cameraZ = 1
  } else {
    if(cameraSZ < 0.2) {
      cameraSZ = 0.2
      cameraZ = 0.2 / _cameraS
    }
  }
  cameraS = slide(cameraS, cameraSZ, cameraSlide)
  iCameraS = 1 / cameraS
  gameScale = cscale * iCameraS
  iGameScale = icscale * cameraS
  let self = false
  if(gameEntities[selfId]) {
    self = gameEntities[selfId]
    updateEntity(self, true)
  } else {
    cameraX = slide(cameraX, cameraTx, 5)
    cameraY = slide(cameraY, cameraTy, 5)
  }
  for(let i in gameEntities) {
    let entity = gameEntities[i]
    if(entity === self) { continue }
    updateEntity(entity)
  }
  let removedEntitiesLength = removedEntities.length
  for(let i=removedEntitiesLength-1;i>=0;i--) {
    let entity = removedEntities[i]
    if(entity.fadeTime <= 0) {
      removedEntities.splice(i, 1)
      removedEntitiesLength --
    } else {
      updateEntity(entity)
    }
  }
  hoverContainer = false
  hoverPetal = false
  updateContainers(menu.containers)
  updateContainers(gameContainers)
  if(dragPetal.petal) {
    let targetX = tx, targetY = ty
    let petal = dragPetal.petal
    let x = dragPetal.offsetX, y = dragPetal.offsetY
    if(x < -petal.size) { dragPetal.offsetX = x = -petal.size } else if(x > petal.size) { dragPetal.offsetX = x = petal.size }
    if(y < -petal.size) { dragPetal.offsetY = y = -petal.size } else if(y > petal.size) { dragPetal.offsetY = y = petal.size }
    let fit = true
    if(hoverContainer) {
      if(hoverContainer === dragPetal.lastContainer) {
        fit = false
      } else {
        x = 0
        y = 0
        targetX = hoverContainer.x
        targetY = hoverContainer.y
        dragPetal.lastContainer = false
      }
    } else {
      dragPetal.lastContainer = false
    }
    petal.x = x + slide(petal.x - x, targetX, 5)
    petal.y = y + slide(petal.y - y, targetY, 5)
    petal.size = slide(petal.size, hoverContainer && fit ? hoverContainer.size : 50, 5)
    petal.shake = slide(petal.shake, 3.6, 10)
  }
  let sw = w * cameraS, sh = h * cameraS
  let is = iCameraS
  ctx.scale(is, is)
  let gameTransform = ctx.getTransform()
  
  ctx.strokeStyle = toRgb(13158600)
  let dist = 50
  ctx.lineWidth = 1
  ctx.beginPath()
  for(let i=-sw-(dist+(cameraX-sw)%dist)%dist;i<=sw;i+=dist) {
    ctx.moveTo(i, -sh)
    ctx.lineTo(i, sh)
  }
  for(let i=-sh-(dist+(cameraY-sh)%dist)%dist;i<=sh;i+=dist) {
    ctx.moveTo(-sw, i)
    ctx.lineTo(sw, i)
  }
  ctx.stroke()
  ctx.closePath()
  
  // drawBackground(sw, sh, cameraX, cameraY)
  ctx.setTransform(iDefaultTransform)
  drawContainers(containerLayers[1])
  ctx.setTransform(gameTransform)
  ctx.resetTransform()
  for(let i=gameParticlesUnder.length-1;i>=0;i--) {
    let particle = gameParticlesUnder[i]
    updateParticle(particle, gameParticlesUnder, i)
    drawParticle(particle)
  }
  ctx.setTransform(gameTransform)
  for(let i=removedEntitiesLength-1;i>=0;i--) {
    drawHealthBar1(removedEntities[i])
  }
  for(let i in gameEntities) {
    drawHealthBar1(gameEntities[i])
  }
  ctx.resetTransform()
  for(let i in gameEntities) {
    drawRadiantAura(gameEntities[i])
  }
  for(let i=removedEntitiesLength-1;i>=0;i--) {
    drawRadiantAura(removedEntities[i])
  }
  for(let i in gameEntities) {
    drawEntity(gameEntities[i])
  }
  for(let i=removedEntitiesLength-1;i>=0;i--) {
    drawEntity(removedEntities[i])
  }
  ctx.setTransform(gameTransform)
  for(let i=removedEntitiesLength-1;i>=0;i--) {
    drawHealthBar2(removedEntities[i])
  }
  for(let i in gameEntities) {
    drawHealthBar2(gameEntities[i])
  }
  for(let i=removedEntitiesLength-1;i>=0;i--) {
    drawHealthBar3(removedEntities[i])
  }
  for(let i in gameEntities) {
    drawHealthBar3(gameEntities[i])
  }
  ctx.setTransform(iDefaultTransform)
  let iw = iCanvasWidth * 0.5, ih = iCanvasHeight * 0.5
  drawContainers(containerLayers[0])
  drawBars(bars, iw, ih, 0, 0)
  drawLabels(labels, iw * 2, ih * 2, -iw, -ih)
  drawLayers(layers, iw * 2, ih * 2, -iw, -ih)
  if(leaderboard) {
    let x = resolveInPosition(leaderboard.percentX, leaderboard.x, iw)
    let y = resolveInPosition(leaderboard.percentY, leaderboard.y, ih)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    let leftX = x + resolveX(leaderboard.alignX, leaderboard.width)
    let topY = y + resolveY(leaderboard.alignY, leaderboard.height)
    ctx.fillRect(leftX, topY, leaderboard.width, leaderboard.height)
    let title = leaderboard.title
    let titleX = x + resolvePosition(title.percentX, title.x, leaderboard.width)
    let titleY = y + resolvePosition(title.percentY, title.y, leaderboard.height) + title.size
    ctx.textAlign = title.alignX
    let t = ctx.getTransform()
    ctx.resetTransform()
    drawText(title.text, titleX * iscale + gameW, titleY * iscale + gameH, title.size * iscale, 1, title.fill, title.lineWidth * iscale, title.line)
    ctx.setTransform(t)
  }
  for(let i=0,l=petals.length;i<l;i++) {
    let petal = petals[i]
    if(petal.dragging || !petal.container) {
      drawGamePetal(petal)
    }
  }
  if(hoverPetal && hoverPetal.container) {
    pointer = true
  }
  for(let i=0,l=petals.length;i<l;i++) {
    let petal = petals[i]
    if(petal.animation === 'delete') {
      petal.size -= 4
      if(petal.size <= 0) {
        petals.splice(i, 1)
        l --
      }
      petal.d = (petal.d + 0.5) % deg360
      petal.x = slide(petal.x, 0, 5)
      petal.y = slide(petal.y, 0, 5)
    }
    if(petal.container) {
      let container = petal.container
      petal.lastContainer = container
      if(!petal.dragging) {
        petal.x = slide(petal.x, container.x, 5)
        petal.y = slide(petal.y, container.y, 5)
        petal.size = slide(petal.size, container.size, 10)
      }
    }
    if(petal.shake > 0.01) {
      petal.shake = slide(petal.shake, 0, 5)
    } else { petal.shake = 0 }
  }
  let cursor = document.body.style.cursor
  if(pointer) {
    if(cursor !== 'pointer') {
      document.body.style.cursor = 'pointer'
    }
  } else {
    if(cursor) {
      document.body.style.cursor = ''
    }
  }
  mouse.raw.leftDown = mouse.raw.rightDown = false
  if(editor) {
    editorData.f()
  }
  requestAnimationFrame(draw)
}

resize()

window.addEventListener('resize', function() {
  resize()
})

document.addEventListener('mousemove', function(e) {
  let x = e.clientX - hw
  let y = e.clientY - hh
  mouse.d = Math.atan2(y, x)
  mouse.raw.X = e.clientX
  mouse.raw.Y = e.clientY
  mouse.raw.x = x
  mouse.raw.y = y
  mouse.circum.x = x * cs
  mouse.circum.y = y * cs
  mouse.in.x = x * is
  mouse.in.y = y * is
  if(mouse.raw.left && editor) {
    let m = cs * cameraS
    cameraTx = mouse.raw.leftTx - (e.clientX - mouse.raw.leftX) * m
    cameraTy = mouse.raw.leftTy - (e.clientY - mouse.raw.leftY) * m
    mouse.raw.leftTx = cameraTx
    mouse.raw.leftTy = cameraTy
    mouse.raw.leftX = e.clientX
    mouse.raw.leftY = e.clientY
  }
})

let keys = {}

document.addEventListener('keyup', function(e) {
  delete keys[e.key.toLowerCase()]
})

document.addEventListener('mousedown', function(e) {
  if(e.button === 0) {
    mouse.raw.left = true
    mouse.raw.lastLeft = performance.now()
    mouse.raw.leftDown = true
    mouse.raw.leftX = e.clientX
    mouse.raw.leftY = e.clientY
    mouse.raw.leftTx = cameraTx
    mouse.raw.leftTy = cameraTy
    if(!dragPetal.petal && hoverPetal) { dragPetal.set(hoverPetal) }
  } else if(e.button === 2) {
    mouse.raw.right = true
    mouse.raw.rightDown = true
  }
})

document.addEventListener('mouseup', function(e) {
  if(e.button === 0) {
    mouse.raw.left = false
    let now = performance.now()
    dragPetal.release(now - mouse.raw.lastLeft)
  } else if(e.button === 2) {
    mouse.raw.right = false
  }
})

setTimeout(function() {
  const loadingInterval = setInterval(function() {
    if(document.fonts.check('100px Ubuntu')) {
      clearInterval(loadingInterval)
      removeLoading()
      draw()
    }
  })
  }, 500)

document.addEventListener('keydown', function(e) {
  let code = e.keyCode
  if(code === 13 && renderType === 0 && document.activeElement === elements[1]) {
    if(gameSocket && gameSocket.readyState === gameSocket.OPEN) {
      circleTransition(function() {
        setRenderType(1)
      }, function() {
        joinGame()
      }, 'gameStart')
    } else {
      elements[3].setAttribute('stroke', 'Socket error! Maybe reload the page...')
      elements[3].style.color = 'red'
    }
    return
  }
  if(code === 13 && renderType === 1 && chatEnabled) {
    if(chatState) {
      let v = elements[9].value
      if(v) {
        v = v.slice(0, 250)
        send([packetChat, v])
      }
      elements[9].value = ''
      setChatState(false)
      elements[9].blur()
    } else {
      document.activeElement.blur()
      elements[9].focus()
      setChatState(true)
    }
    return
  }
  let tag = document.activeElement.tagName.toLowerCase()
  if(tag === 'input' || tag === 'textarea') { return }
  keys[e.key.toLowerCase()] = true
  if(code >= 49 && code <= 57) {
    return menu.swap(code - 49)
  }
  if(code === 48) {
    return menu.swap(9)
  }
  if(code === 82) {
    return menu.swapAll()
  }
})
document.addEventListener('wheel', function(e) {
  cameraZ += e.deltaY * 0.003
})

let style = function(e, p) {
  for(let i in p) {
    e.style[i] = p[i]
  }
}


let editorData = {
  active: editor,
  mode: 'View',
  f: function() {}
}
if(editor) {
  setRenderType(1)
  cameraSlide = 5
  let setBounds = function(x, y) {
    checkBounds(o, function(e) {
      e.drawBounds = false
    })
  }
  editorData.f = function() {
    let x = mouse.circum.x * cscale + gameW, y = mouse.circum.y * cscale + gameH
    setBounds(x, y)
  }
  let setMode = function(mode) {
    if(mode === 'View') {
      selectPanel(false)
    }
    if(mode === 'Section Editor') {
      setBounds = function(x, y) {
        let a = false, r = false
        checkBounds(o, function(e) {
          if(!e.section) {
            e.drawBounds = 0
            return
          }
          let bounds = e.bounds
          if(bounds && x > bounds.left && x < bounds.right && y > bounds.bottom && y < bounds.top) {
            let t = (bounds.right - bounds.left) * (bounds.top - bounds.bottom)
            if(r === false || t < r) {
              a = e
              r = t
            }
          }
          e.drawBounds = 0.2
          e.colorOffset = 0
        })
        if(a) {
          a.drawBounds = 1
          a.colorOffset = 0.5
        }
      }
      let panel = findPanel(function(p) {
        return (p.type === 'Section Editor')
      })
      if(!panel) {
        panel = createFullPanel()
        panel.type = 'Section Editor'
        panel.icon.textContent = 'Section'
      }
      selectPanel(panel)
    } else {
      setBounds = function(x, y) {
        checkBounds(o, function(e) {
          if(e.drawBounds) {
            delete e.drawBounds
          }
          if(e.colorOffset) {
            delete e.colorOffset
          }
        })
      }
    }
  }
  const checkBounds = function(e, f) {
    let h = 1, render = e.render, bounds = e.bounds
    if(render) {
      for(let i=0,l=render.length;i<l;i++) {
        let s = render[i]
        if(s) {
          checkBounds(s, f)
        }
      }
    }
    f(e)
  }
  let d = {
    subtype: 'mono',
    type: 0,
    id: 0,
    rarity: 0,
    showName: true,
    radiant: 0,
    radius: 35,
    alpha: 1,
    color: 3974347,
    name: 'test'
  }
  let o = buildEntity(d, 0, 0, 0, 0, 2 / 3, 1 / 3)
  gameEntities[d.id] = o
  updateData(o, o.subtype, o.rarity)
  let editorMain = document.createElement('div')
  style(editorMain, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none'
  })
  elements[5].parentNode.appendChild(editorMain)
  let topBar = document.createElement('div')
  style(topBar, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '150px',
    pointerEvents: 'all',
    background: 'rgba(0, 0, 0, 0.65)',
    borderBottom: '6px solid rgba(0, 0, 0, 0.25)'
  })
  editorMain.appendChild(topBar)
  let panelSelectOuter = document.createElement('div')
  style(panelSelectOuter, {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    color: 'rgb(150, 150, 150)',
    background: 'rgba(0, 0, 0, 0.15)',
    border: '6px solid rgba(0, 0, 0, 0.25)',
    borderRadius: '6px',
    width: 'calc(100% - 32px)',
    height: '60px',
    overflowX: 'scroll',
    overflowY: 'hidden'
  })
  topBar.appendChild(panelSelectOuter)
  let modeSelect = document.createElement('select')
  modeSelect.className = 'selectable'
  style(modeSelect, {
    position: 'absolute',
    top: '10px',
    left: '10px',
    color: 'rgb(150, 150, 150)',
    border: '6px solid rgba(0, 0, 0, 0.25)',
    borderRadius: '6px',
    width: '250px',
    height: '50px',
    fontSize: '24px',
    paddingLeft: '8px'
  })
  let panels = []
  let currentPanel = false
  let selectPanel = function(p) {
    if(p === currentPanel) {
      return
    }
    if(currentPanel) {
      currentPanel.right.style.right = '-510px'
      currentPanel.left.style.left = '-510px'
    }
    if(p) {
      currentPanel = p
      setTimeout(function() {
        p.right.style.right = p.left.style.left = '0'
      }, 100)
    } else {
      currentPanel = false
    }
  }
  let removePanel = function(p) {
    let i = panels.indexOf(p)
    if(i >= 0) {
      panels.splice(i, 1)
    }
    p.right.style.right = '-510px'
    p.left.style.left = '-510px'
    setTimeout(function() {
      p.right.remove()
      p.left.remove()
    }, 500)
    p.icon.remove()
    if(p === currentPanel) {
      currentPanel = false
    }
  }
  let leftPanel = false, rightPanel = false
  let modes = ['View', 'Model Editor', 'Section Editor', 'Part Editor', 'Path Editor', 'Barrel Editor']
  for(let i=0,l=modes.length;i<l;i++) {
    let option = document.createElement('option')
    option.setAttribute('value', modes[i])
    option.textContent = modes[i]
    modeSelect.appendChild(option)
  }
  topBar.appendChild(modeSelect)
  modeSelect.value = editorData.mode
  modeSelect.addEventListener('change', function() {
    let v = modeSelect.value
    if(v !== editorData.mode) {
      editorData.mode = v
      setMode(v)
    }
  })
  let content = document.createElement('div')
  style(content, {
    position: 'absolute',
    top: '156px',
    left: '0',
    width: '100%',
    height: 'calc(100% - 156px)',
  })
  editorMain.appendChild(content)
  let findPanel = function(f) {
    for(let i=0,l=panels.length;i<l;i++) {
      let p = panels[i]
      if(f(p)) {
        return p
      }
    }
  }
  let createFullPanel = function() {
    let p = {
      right: createPanel(true),
      left: createPanel(false),
      icon: createIcon()
    }
    p.icon.addEventListener('click', function() {
      p.icon.className = 'selected-golden'
      for(let i=0,l=panels.length;i<l;i++) {
        let panel = panels[i]
        if(panel !== p) {
          panel.icon.className = 'selectable-golden'
        }
      }
    })
    panels.push(p)
    selectPanel(p)
    return p
  }
  let createIcon = function() {
    let icon = document.createElement('div')
    icon.className = 'selectable-golden'
    style(icon, {
      color: 'rgb(150, 150, 150)',
      border: '6px solid rgba(0, 0, 0, 0.25)',
      borderRadius: '6px',
      marginLeft: '3px',
      marginTop: '3px',
      paddingLeft: '4px',
      paddingRight: '4px',
      display: 'inline-block',
      height: '22px',
      fontSize: '17px'
    })
    panelSelectOuter.appendChild(icon)
    return icon
  }
  let createPanel = function(right) {
    let panel = document.createElement('div')
    style(panel, {
      position: 'absolute',
      top: '0',
      width: right ? '500px' : '506px',
      height: '100%',
      pointerEvents: 'all',
      background: 'rgba(0, 0, 0, 0.65)',
      overflowY: 'scroll',
      overflowX: 'hidden',
      transition: 'left ease 0.2s, right ease 0.2s'
    })
    if(right) {
      panel.style.right = '-510px'
      panel.style.borderLeft = '6px solid rgba(0, 0, 0, 0.25)'
    } else {
      panel.style.left = '-510px'
    }
    content.appendChild(panel)
    return panel
  }
}
  
  
//}()
