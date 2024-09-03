const constants = function(obj) {
  obj.sendM = 2
  obj.deg360 = Math.PI * 2
  obj.deg270 = Math.PI * 1.5
  obj.deg240 = Math.PI * 4 / 3
  obj.deg120 = Math.PI * 2 / 3
  obj.deg90 = Math.PI * 0.5
  obj.deg60 = Math.PI / 3
  obj.deg30 = Math.PI / 6

  obj.packetJoinGame = 0
  obj.packetInput = 1
  obj.packetSwap = 2
  obj.packetChat = 3

  obj.packetGameUpdate = 0

  obj.gameUpdateNewEntities = 0
  obj.gameUpdateEntities = 1
  obj.gameUpdateStart = 2
  obj.gameUpdateRemovedEntities = 3
  
  obj.toInt = function(r, g, b) {
    if(r < 0) { r = 0 } else if(r > 255) { r = 255 }
    if(g < 0) { g = 0 } else if(g > 255) { g = 255 }
    if(b < 0) { b = 0 } else if(b > 255) { b = 255 }
    return ((~~r) << 16) | ((~~g) << 8) | (~~b)
  }

  obj.rarities = [
    { name:'Common', color:8318822 },
    { name:'Unusual', color:16770645 },
    { name:'Rare', color:5067502 },
    { name:'Epic', color:8789981 },
    { name:'Legendary', color:14556945 },
    { name:'Mythic', color:2087901 },
    { name:'Ultra', color:16722807 },
    { name:'Super', color:2883498 }
  ]
  
  obj.arrasTiers = ['', 'Beta', 'Alpha', 'Omega']

  let polynomial = function(x, coeff) {
    let s = 0, p = 1
    for(let i=coeff.length-1;i>=0;i--) {
      s += p * coeff[i]
      p *= x
    }
    return s
  }
  
  obj.scenexePolygons = ['Triangle', 'Square', 'Pentagon', 'Hexagon', 'Heptagon', 'Octagon', 'Nonagon', 'Decagon', 'Hendecagon', 'Dodecagon', 'Tridecagon']
  
  let scenexeEntityData = (function() {
    let scenexeEntityData = {}
    scenexeEntityData.scenexeWormholeA = {
      name: 'Wormhole',
      render: [
        {
          type: 'array-animated',
          repeat: 2,
          speed: -1,
          animateSize: [
            [0, 4],
            [1, 1]
          ],
          animateAlpha: [
            [0, 0],
            [0.5, 0.2],
            [1, 0.2]
          ],
          render: [
            {
              color: 'inherit',
              stroke: 30,
              fixedLineWidth: 4,
              type: 'polygon',
              polygonData: {
                sides: 0,
                size: 1
              }
            }
          ]
        }, {
          color: 65793,
          stroke: 30,
          fixedLineWidth: 4,
          type: 'polygon',
          polygonData: {
            sides: 0,
            size: 1
          },
          damageFlashType: 1,
          particles: {
            type: 'radial-out',
            layer: 'under',
            rsize: 1,
            amount: 1,
            speed: 0.06,
            absoluteSpeed: 0,
            minSize: 0.3333333333333333,
            maxSize: 0.5333333333333333,
            time: 50,
          }
        }
      ],
      data: {
        damageFlash: 1,
        healthBarType: 2,
      },
    }
    scenexeEntityData.scenexeWormholeB = {
      name: 'Wormhole',
      render: [
        {
          type: 'array-animated',
          repeat: 2,
          speed: 2,
          animateSize: [
            [0, 6],
            [1, 1]
          ],
          animateAlpha: [
            [0, 0],
            [0.5, 0.2],
            [1, 0.2]
          ],
          render: [
            {
              color: 'inherit',
              stroke: 30,
              fixedLineWidth: 4,
              type: 'polygon',
              polygonData: {
                sides: 0,
                size: 1
              }
            }
          ]
        }, {
          type: 'polygon',
          color: 16777215,
          stroke: 30,
          fixedLineWidth: 4,
          rotationLock: true,
          rotationOscillate: {
            angularSpeed: 0.04,
            angularOffset: 1.5707963267948966,
            speed: 20,
            offset: 0
          },
          polygonData: {
            sides: -3,
            size: 4,
            inner: 0.1
          }
        }, {
          type: 'polygon',
          color: 16777215,
          stroke: 30,
          fixedLineWidth: 4,
          rotationLock: true,
          rotationSpeed: -1.6,
          sizeOscillate: {
            angularSpeed: 4,
            angularOffset: 3.141592653589793,
            speed: 0.5,
            offset: 2
          },
          polygonData: {
            sides: -6,
            size: 1,
            inner: 0.5
          }
        }, {
          type: 'polygon',
          color: 0,
          stroke: 30,
          fixedLineWidth: 4,
          rotationLock: true,
          rotationSpeed: 1.6,
          sizeOscillate: {
            angularSpeed: 4,
            angularOffset: 0,
            speed: 0.5,
            offset: 2
          },
          polygonData: {
            sides: -6,
            size: 1,
            inner: 0.5
          }
        }, {
          type: 'polygon',
          color: 65793,
          stroke: 30,
          fixedLineWidth: 4,
          rotationLock: true,
          rotationSpeed: -0.4,
          polygonData: {
            sides: -6,
            size: 1.3,
            inner: 0.30769230769
          },
          damageFlashType: 1,
        }, {
          type: 'polygon',
          color: 65793,
          stroke: 30,
          fixedLineWidth: 4,
          rotationLock: true,
          rotationSpeed: 0.4,
          polygonData: {
            sides: -8,
            size: 1.6,
            inner: 0.25
          },
          damageFlashType: 1,
        }, {
          color: 65793,
          stroke: 30,
          fixedLineWidth: 4,
          type: 'polygon',
          polygonData: {
            sides: 0,
            size: 1
          },
          damageFlashType: 1,
          particles: {
            type: 'radial-in',
            layer: 'under',
            rsize: 1,
            amount: 0.4,
            speed: 0.08,
            absoluteSpeed: 0,
            minSize: 0.3333333333333333,
            maxSize: 0.5333333333333333,
            time: 50,
          }
        }, {
          type: 'polygon',
          color: 65793,
          rotationLock: true,
          rotationSpeed: -0.4,
          polygonData: {
            sides: -6,
            size: 1.3,
            inner: 0.30769230769
          },
          fixedSizeIncrease: -8,
          damageFlashType: 1,
        }, {
          type: 'polygon',
          color: 65793,
          rotationLock: true,
          rotationSpeed: 0.4,
          polygonData: {
            sides: -8,
            size: 1.6,
            inner: 0.25
          },
          fixedSizeIncrease: -10,
          damageFlashType: 1,
        }
      ],
      data: {
        healthBarType: 2,
        damageFlash: 1,
      },
    }
    scenexeEntityData.scenexeWormholeC = {
      name: 'Wormhole',
      render: [
        {
          color: 'inherit',
          stroke: 30,
          fixedLineWidth: 4,
          rotationLock: true,
          rotationSpeed: 1,
          sizeOscillate: {
            angularSpeed: 1,
            angularOffset: 1.5707963267948966,
            speed: 0.5,
            offset: 2
          },
          alpha: 0.5,
          type: 'polygon',
          polygonData: {
            sides: 4,
            size: 1
          },
          particles: {
            type: 'radial-out',
            layer: 'under',
            rsize: 1,
            amount: 0.8,
            speed: 0.01,
            absoluteSpeed: 0,
            minSize: 0.16666666666666666,
            maxSize: 0.26666666666666666,
            time: 60,
            offset: 0.9
          }
        }, {
          color: 'inherit',
          stroke: 30,
          fixedLineWidth: 4,
          rotationLock: true,
          rotationSpeed: 1,
          type: 'polygon',
          polygonData: {
            sides: 4,
            size: 1
          },
        }
      ],
      data: {
        damageFlash: 1,
        healthBarType: 3,
      },
    }
    scenexeEntityData.scenexeWormholeD = {
      name: 'Wormhole',
      render: [
        {
          type: 'array-animated',
          repeat: 2,
          speed: -0.57142857142,
          animateSize: [
            [0, 2],
            [1, 1]
          ],
          animateAlpha: [
            [0, 0],
            [0.5, 0.2],
            [1, 0.2]
          ],
          render: [
            {
              color: 'inherit',
              stroke: 30,
              fixedLineWidth: 4,
              type: 'polygon',
              polygonData: {
                sides: 0,
                size: 1
              }
            }
          ]
        }, {
          color: 'inherit',
          stroke: 30,
          fixedLineWidth: 4,
          rotationLock: true,
          rotationOscillate: {
            angularSpeed: 0.00028571428,
            angularOffset: 0,
            speed: 1000,
            offset: 0
          },
          type: 'polygon',
          polygonData: {
            sides: -12,
            size: 1.1,
            inner: 0.90909090909
          },
        }, {
          color: 65793,
          stroke: 30,
          fixedLineWidth: 4,
          rotationLock: true,
          type: 'polygon',
          overrideRadiant: 0,
          polygonData: {
            sides: 0,
            size: 1
          },
        }, {
          type: 'array-animated',
          repeat: 4,
          speed: 0.85714285714,
          animateSize: [
            [0, 1],
            [1, 0]
          ],
          animateDarkness: [
            [0, 1],
            [1, 0]
          ],
          render: [
            {
              color: 'inherit',
              stroke: 30,
              fixedLineWidth: 4,
              type: 'polygon',
              polygonData: {
                sides: 0,
                size: 1
              },
              particles: {
                type: 'radial-out',
                layer: 'under',
                rsize: 1,
                amount: 0.8,
                speed: 0.01,
                absoluteSpeed: 0,
                minSize: 0.16666666666666666,
                maxSize: 0.26666666666666666,
                time: 60,
                offset: 0.9
              }
            }
          ]
        }
      ],
      data: {
        damageFlash: 1,
        healthBarType: 3,
      },
    }
    for(let i=0,l=obj.scenexePolygons.length;i<l;i++) {
      let name = obj.scenexePolygons[i]
      scenexeEntityData[`scenexe${name}`] = {
        name: name,
        render: [
          {
            color: 'inherit',
            stroke: 30,
            fixedLineWidth: 4,
            type: 'polygon',
            polygonData: {
              sides: i + 3,
              size: 1
            }
          }
        ],
        data: {
          reload: 1,
          mobScore: 0,
          mobSize: 12 * Math.pow(1.5, i),
          mobHealth: 3 * Math.pow(3.6, i),
          healthBarType: 2,
        },
        radiantBase: {
          sides: i + 3
        }
      }
    }
    return scenexeEntityData
  })()

  let arrasEntityData = (function() {
    let arrasEntityData = {}
    arrasEntityData.arrasWormhole = {
      name: 'Wormhole',
      render: [
        {
          color: 15264759,
          strokePercent: 0.6,
          strokeColor: 4737096,
          fixedLineWidth: 4,
          reverseOrder: true,
          type: 'polygon',
          polygonData: {
            sides: -5,
            size: 3.5,
            inner: 0.15
          },
          rotationLock: true,
          rotationSpeed: 0.8
        }, {
          color: 15264759,
          strokePercent: 0.6,
          strokeColor: 4737096,
          fixedLineWidth: 4,
          reverseOrder: true,
          type: 'polygon',
          polygonData: {
            sides: 20,
            size: 1.15,
            heights: [1.4, 1, 1, 1]
          },
          rotationLock: true,
          rotationSpeed: 1.3
        }, {
          color: 3026478,
          strokePercent: 0.6,
          strokeColor: 6842472,
          fixedLineWidth: 4,
          reverseOrder: true,
          type: 'polygon',
          polygonData: {
            sides: 0,
            size: 1,
          }
        }, {
          color: 4737096,
          strokePercent: 0.6,
          strokeColor: 6842472,
          fixedLineWidth: 4,
          reverseOrder: true,
          type: 'polygon',
          polygonData: {
            sides: 0,
            size: 0.85,
          }
        }
      ],
      data: {
        reload: 1,
        healthBarType: 1,
      },
    }
    !function() {
      let trapezoid = function(x, y, w1, w2, h, a) {
        let joints = [
          {
            type: 'moveTo',
            x: x - w1,
            y: y - h
          }, {
            type: 'lineTo',
            x: x + w1,
            y: y - h
          }, {
            type: 'lineTo',
            x: x + w2,
            y: y + h
          }, {
            type: 'lineTo',
            x: x - w2,
            y: y + h
          }
        ]
        if(a) {
          let cos = Math.cos(a), sin = Math.sin(a)
          for(let i=0;i<4;i++) {
            let joint = joints[i]
            let x = joint.x
            joint.x = x * sin + joint.y * cos
            joint.y = joint.y * sin - x * cos
          }
        }
        let lastLine = { ...joints[0] }
        lastLine.type = 'lineTo'
        joints.push(lastLine)
        return joints
      }
      let outline = function(sides, x, y, w1, w2, h, angle) {
        let joints = []
        let r = obj.deg360 / sides
        for(let i=0;i<sides;i++) {
          let a = r * i + angle
          joints.push(...trapezoid(x, y, w1, w2, h, a))
        }
        return joints
      }
      let polygons = [
        {
          name: 'Square',
          sides: 4,
          size: 48,
          health: 1,
          score: 350000,
          x1: 0.57,
          y1: 0.97,
          y2: 1.05,
          w1: 0.22,
          w2: 0.52,
          w3: 0.06,
          w4: 0.32,
          h1: 0.13,
          h2: 0.13,
        }, {
          name: 'Triangle',
          sides: 3,
          size: 33,
          health: 1.73205080757,
          score: 1050000,
          x1: 0.8,
          y1: 1.07,
          y2: 1.15,
          w1: 0.3,
          w2: 0.85,
          w3: 0.12,
          w4: 0.44,
          h1: 0.15,
          h2: 0.15,
        }, {
          name: 'Pentagon',
          sides: 5,
          size: 69,
          health: 3,
          score: 3150000,
          x1: 0.35,
          y1: 0.92,
          y2: 0.99,
          w1: 0.1,
          w2: 0.3,
          w3: 0.15,
          w4: 0.04,
          h1: 0.13,
          h2: 0.06,
        }, {
          name: 'Hexagon',
          sides: 6,
          size: 96,
          health: 5.19615242271,
          score: 9450000,
          x1: 0.28,
          y1: 0.92,
          y2: 0.99,
          w1: 0.09,
          w2: 0.23,
          w3: 0.16,
          w4: 0.04,
          h1: 0.13,
          h2: 0.06,
        }
      ]
      for(let i=0,l=polygons.length;i<l;i++) {
        let data = polygons[i], name = data.name, sides = data.sides, angle = Math.PI / sides, r = Math.cos(angle), ir = 1 / r
        let paths = []
        paths.push({
          color: 'inherit',
          strokePercent: 0.6,
          strokeColor: 4737096,
          fixedLineWidth: 4,
          reverseOrder: true,
          type: 'path',
          joints: [
            {
              type: 'polygon',
              polygonData: {
                sides: sides,
                size: ir,
              }
            }, {
              type: 'polygon',
              polygonData: {
                sides: sides,
                size: ir * 0.7,
                reverseJoints: true,
              }
            }, {
              type: 'polygon',
              polygonData: {
                sides: sides,
                size: ir * 0.2,
                reverseJoints: true,
                d: angle
              }
            }
          ]
        })
        paths.push({
          color: 10987439,
          strokePercent: 0.6,
          strokeColor: 4737096,
          fixedLineWidth: 4,
          reverseOrder: true,
          type: 'path',
          overrideRadiant: 0,
          joints: outline(sides, -data.x1, data.y1, data.w1, data.w2, data.h1, angle)
        })
        paths.push({
          color: 10987439,
          strokePercent: 0.6,
          strokeColor: 4737096,
          fixedLineWidth: 4,
          reverseOrder: true,
          type: 'path',
          overrideRadiant: 0,
          joints: outline(sides, data.x1, data.y1, data.w1, data.w2, data.h1, angle)
        })
        paths.push({
          color: 'inherit',
          strokePercent: 0.6,
          strokeColor: 4737096,
          fixedLineWidth: 4,
          reverseOrder: true,
          type: 'path',
          joints: outline(sides, data.x1, data.y2, data.w3, data.w4, data.h2, angle).concat(outline(sides, -data.x1, data.y2, data.w3, data.w4, data.h2, angle))
        })
        let iPolygonSize = 1 / data.size
        if(iPolygonSize > 0.1) { iPolygonSize = 0.1 }
        let acceleration = 40 * Math.pow(iPolygonSize, 0.8)
        arrasEntityData[`arras${data.name}Relic`] = {
          name: `${data.name} Relic`,
          render: paths,
          data: {
            reload: 1,
            mobScore: data.score,
            mobSize: data.size,
            mobHealth: data.health,
            renderSize: ir,
            healthBarType: 1,
            polygonRotationSpeed: 10 * iPolygonSize,
            polygonAcceleration: acceleration
          },
          radiantBase: {
            sides: sides
          }
        }
      }
    }()
    !function() {
      let tiers = obj.arrasTiers, polygons = [
        {
          name: 'Egg',
          sides: 0,
          size: 4,
          health: 1,
          score: 5
        }, {
          name: 'Square',
          sides: 4,
          size: 16,
          health: 5,
          score: 20,
        }, {
          name: 'Triangle',
          sides: 3,
          size: 11,
          health: 50,
          score: 100,
        }, {
          name: 'Pentagon',
          sides: 5,
          size: 23,
          health: 375,
          score: 500,
        }, {
          name: 'Hexagon',
          sides: 6,
          size: 32,
          health: 1000,
          score: 2500,
        }
      ]
      for(let i=0,l=polygons.length;i<l;i++) {
        let polygon = polygons[i]
        let baseScore = polygon.score, baseHealth = polygon.health, polygonSize = polygon.size, base = [], name = polygon.name, sides = polygon.sides, angle = Math.PI / sides, r = Math.cos(angle), ir = 1 / r, sir = ir, size = 1, offset = true
        if(sides === 0) {
          angle = 0
          r = 0.5
          sir = ir = 2
        } else if(sides === 3) {
          sir = 1.414213562373095
        }
        for(let i=0;i<4;i++) {
          let tier = tiers[i]
          let s = 1
          if(i === 0) {
            s = ir
          } else if(i > 1) {
            size *= r
            s = size
          }
          offset = offset ? false : true
          base.push({
            color: 'inherit',
            strokePercent: 0.6,
            strokeColor: 4737096,
            fixedLineWidth: 4,
            reverseOrder: true,
            type: 'polygon',
            polygonData: {
              sides: sides,
              size: s,
              d: offset ? angle : 0
            }
          })
          let iPolygonSize = 1 / polygonSize
          if(iPolygonSize > 0.1) { iPolygonSize = 0.1 }
          let acceleration = 40 * Math.pow(iPolygonSize, 0.8)
          arrasEntityData[`arras${tier}${name}`] = {
            name: tier ? `${tier} ${name}` : name,
            render: base.slice(),
            data: {
              reload: 1,
              mobScore: baseScore * Math.pow(5, i),
              mobSize: polygonSize,
              mobHealth: baseHealth * Math.pow(5, i),
              renderSize: ir,
              healthBarType: 1,
              polygonRotationSpeed: 10 * iPolygonSize,
              polygonAcceleration: acceleration
            },
            radiantBase: {
              sides: sides
            }
          }
          polygonSize *= sir
        }
      }
    }()
    return arrasEntityData
  })()

  obj.entityData = {
    ...scenexeEntityData,
    ...arrasEntityData,
    bullet: {
      name: 'Bullet',
      render: [
        {
          color: 'inherit',
          type: 'path',
          fixedLineWidth: 4,
          strokePercent: 0.6,
          strokeColor: 4737096,
          reverseOrder: true,
          joints: [
            {
              type: 'ellipse',
              x: 0,
              y: 0,
              width: 1,
              height: 1
            }
          ]
        }
      ],
      data: {
        reload: 1,
        healthBarType: 4,
      }
    },
    mono: {
      name: 'Mono',
      render: [
        {
          type: 'barrel',
          btype: 0,
          x: 0,
          y: 0,
          w: 0.4,
          h: 0.9,
          d: 0,
          reverseOrder: true,
        }, {
          color: 'inherit',
          type: 'path',
          fixedLineWidth: 4,
          strokePercent: 0.6,
          strokeColor: 4737096,
          reverseOrder: true,
          joints: [
            {
              type: 'ellipse',
              x: 0,
              y: 0,
              width: 1,
              height: 1
            }
          ]
        }, {
          type: 'section',
          x: 0,
          y: 2,
          size: 0.5,
          dynamicRotation: true,
          rotationData: {
            type: 'cursor'
          },
          d: Math.PI / 2,
          render: [
            {
              type: 'barrel',
              btype: 0,
              x: 0,
              y: 0,
              w: 0.4,
              h: 0.9,
              d: 0,
              reverseOrder: true,
            }, {
              color: 'inherit',
              type: 'path',
              fixedLineWidth: 4,
              strokePercent: 0.6,
              strokeColor: 4737096,
              reverseOrder: true,
              joints: [
                {
                  type: 'ellipse',
                  x: 0,
                  y: 0,
                  width: 1,
                  height: 1
                }
              ]
            }, {
              type: 'section',
              x: 0,
              y: 2,
              size: 0.5,
              rotate: 'inherit',
              render: [
                {
                  type: 'barrel',
                  btype: 0,
                  x: 0,
                  y: 0,
                  w: 0.4,
                  h: 0.9,
                  d: 0,
                  reverseOrder: true,
                }, {
                  color: 'inherit',
                  type: 'path',
                  fixedLineWidth: 4,
                  strokePercent: 0.6,
                  strokeColor: 4737096,
                  reverseOrder: true,
                  joints: [
                    {
                      type: 'ellipse',
                      x: 0,
                      y: 0,
                      width: 1,
                      height: 1
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      data: {
        reload: 1,
        healthBarType: 1,
      }
    },
    flower: {
      name: 'Flower',
      render: [
        {
          color: 16770915,
          type: 'flower',
          x: 0,
          y: 0,
          size: 1
        }
      ],
      data: {
        reload: 1,
      },
      rotationLock: true
    },
    basic: {
      name: 'Basic',
      render: [
        {
          color: 16777215,
          stroke: 50,
          lineWidth: 0.28,
          type: 'path',
          joints: [
            {
              type: 'ellipse',
              x: 0,
              y: 0,
              width: 1,
              height: 1
            }
          ]
        }
      ],
      data: {
        reload: 1,
      }
    },
    egg: {
      name: 'Egg',
      render: [
        {
          color: 16773304,
          stroke: 50,
          lineWidth: 0.28,
          type: 'path',
          joints: [
            {
              type: 'ellipse',
              x: 0,
              y: 0,
              width: 0.833,
              height: 1.17
            }
          ]
        }
      ],
      data: {
        reload: 1,
        size: 1.2
      }
    },
    rose: {
      name: 'Rose',
      render: [
        {
          color: 16749769,
          stroke: 50,
          lineWidth: 0.28,
          type: 'path',
          joints: [
            {
              type: 'ellipse',
              x: 0,
              y: 0,
              width: 1,
              height: 1
            }
          ]
        }
      ],
      data: {
        reload: 1,
      }
    },
    light: {
      name: 'Light',
      render: [
        {
          color: 16777215,
          stroke: 50,
          lineWidth: 0.45,
          type: 'path',
          joints: [
            {
              type: 'ellipse',
              x: 0,
              y: 0,
              width: 1,
              height: 1
            }
          ]
        }
      ],
      data: {
        reload: 1,
        renderStackDistance: [1, 1, 1, 1, 1.1, 1],
        size: 0.5,
      }
    },
    pollen: {
      name: 'Pollen',
      render: [
        {
          color: 16770915,
          stroke: 50,
          lineWidth: 0.4,
          type: 'path',
          joints: [
            {
              type: 'ellipse',
              x: 0,
              y: 0,
              width: 1,
              height: 1
            }
          ]
        }
      ],
      data: {
        reload: 1,
        size: 0.65,
      }
    },
    faster: {
      name: 'Faster',
      render: [
        {
          color: 16711625,
          stroke: 50,
          lineWidth: 0.4,
          type: 'path',
          joints: [
            {
              type: 'ellipse',
              x: 0,
              y: 0,
              width: 1,
              height: 1
            }
          ]
        }
      ],
      data: {
        reload: 1,
        size: 0.65,
        rotationSpeedIncrease: [0, 1, 2, 3, 4, 5, 6, 7].map(x => polynomial(x, [0.001, 0.005, 0.1, 0.5])),
        shake: 100,
      },
    },
    iris: {
      name: 'Iris',
      render: [
        {
          color: 13530843,
          stroke: 50,
          lineWidth: 0.4,
          type: 'path',
          joints: [
            {
              type: 'ellipse',
              x: 0,
              y: 0,
              width: 1,
              height: 1
            }
          ]
        }
      ],
      data: {
        reload: 1,
        size: 0.65
      }
    },
    air: {
      name: 'Air',
      render: [],
      data: {}
    },
    stinger: {
      name: 'Stinger',
      render: [
        {
          color: 2302755,
          stroke: 50,
          lineWidth: 0.4,
          type: 'path',
          joints: [
            {
              type: 'moveTo',
              x: 1,
              y: 0
            }, {
              type: 'lineTo',
              x: -0.5,
              y: 0.8660254037844386
            }, {
              type: 'lineTo',
              x: -0.5,
              y: -0.8660254037844386
            }, {
              type: 'lineTo',
              x: 1,
              y: 0
            }
          ]
        }
      ],
      data: {
        reload: 1,
        size: 0.65,
      }
    }
  }
  
  let resolveAnimation = function(a, s) {
    let l = a.length
    if(l <= 0) {
      return 0
    }
    if(l <= 1) {
      return a[0][1]
    }
    if(s <= 0) {
      return a[0][1]
    }
    if(s >= 1) {
      return a[l - 1][1]
    }
    for(let i=1;i<l;i++) {
      let t = a[i]
      if(s <= t[0]) {
        let y = a[i - 1]
        let o = (s - y[0]) / (t[0] - y[0])
        return o * t[1] + (1 - o) * y[1]
      }
    }
    return a[l - 1][1]
  }
  
  let flatten = function(render) {
    if(render.type === 'array-animated') {
      let r = render.render
      render.render = []
      let max = render.repeat > 0 ? render.repeat : 1
      render.rmax = max
      render.imax = 1 / max
      for(let i=0;i<max;i++) {
        render.render.push({
          type: 'transform',
          x: 0,
          y: 0,
          size: 1,
          render: r
        })
      }
    } else if(render.type === 'polygon') {
      let data = render.polygonData
      render.size = data.size
      let sides = data.sides
      if(sides === 0) {
        render.type = 'path'
        render.joints = [
          {
            type: 'ellipse',
            x: data.x || 0,
            y: data.y || 0,
            width: data.size,
            height: data.size
          }
        ]
      } else if(sides > 0) {
        render.type = 'path'
        render.joints = []
        let r = 1 / sides, d = data.d || 0, x = data.x || 0, y = data.y || 0, k = r * obj.deg360, hl = 0
        if(data.heights) {
          hl = data.heights.length
        }
        for(let i=0;i<sides;i++) {
          let p = i * k + d, s = data.size
          if(hl > 0) {
            s *= data.heights[i % hl]
          }
          render.joints.push({
            type: 'lineTo',
            x: x + s * Math.cos(p),
            y: y + s * Math.sin(p)
          })
        }
        render.joints.push({ ...render.joints[0] })
        if(data.reverseJoints) {
          render.joints.reverse()
        }
        render.joints[0].type = 'moveTo'
      } else if(sides < 0) {
        render.type = 'path'
        render.joints = []
        let r = 1 / -sides, hr = r * Math.PI, d = data.d || 0, x = data.x || 0, y = data.y || 0, k = r * obj.deg360
        for(let i=0;i<-sides;i++) {
          let p = i * k + d
          render.joints.push({
            type: 'lineTo',
            x: x + data.size * Math.cos(p),
            y: y + data.size * Math.sin(p)
          })
          let u = p + hr, j = data.size * data.inner
          render.joints.push({
            type: 'lineTo',
            x: x + j * Math.cos(u),
            y: y + j * Math.sin(u)
          })
        }
        render.joints.push({ ...render.joints[0] })
        if(data.reverseJoints) {
          render.joints.reverse()
        }
        render.joints[0].type = 'moveTo'
      }
    } else if(render.type === 'path') {
      let newJoints = [], modified = false
      for(let i=0,l=render.joints.length;i<l;i++) {
        let joint = render.joints[i]
        flatten(joint)
        if(joint.joints) {
          modified = true
          newJoints.push(...joint.joints)
        } else {
          newJoints.push(joint)
        }
      }
      if(modified) {
        render.joints = newJoints
      }
    }
    if(render.render) {
      for(let u=0,l=render.render.length;u<l;u++) {
        let e = render.render[u]
        flatten(e)
      }
    }
    return render
  }
  
  let defaultBarrels = {
    0: [
      {
        color: 10066329,
        fixedLineWidth: 4,
        reverseOrder: true,
        strokePercent: 0.6,
        strokeColor: 4737096,
        type: 'path',
        recoilData: {
          x: -0.2
        },
        joints: [
          {
            type: 'moveTo',
            x: 0,
            y: 1
          }, {
            type: 'lineTo',
            x: 2,
            y: 1
          }, {
            type: 'lineTo',
            x: 2,
            y: -1
          }, {
            type: 'lineTo',
            x: 0,
            y: -1
          }, {
            type: 'lineTo',
            x: 0,
            y: 1
          }
        ]
      }, {
        color: 'inherit',
        fixedLineWidth: 4,
        type: 'path',
        recoilData: {
          x: 1
        },
        joints: [
          {
            type: 'moveTo',
            x: 0.4,
            y: 1
          }, {
            type: 'lineTo',
            x: 0.8,
            y: 1
          }, {
            type: 'lineTo',
            x: 0.8,
            y: -1
          }, {
            type: 'lineTo',
            x: 0.4,
            y: -1
          }, {
            type: 'lineTo',
            x: 0.4,
            y: 1
          }
        ]
      }
    ]
  }
  
  obj.radiantStars = []
  obj.particles = {}
  obj.radiantStars.push(flatten({
    type: 'polygon',
    polygonData: {
      sides: -6,
      size: 1,
      inner: 0.5
    }
  }))
  obj.radiantStars.push(flatten({
    type: 'polygon',
    polygonData: {
      sides: -3,
      size: 1,
      inner: 0.4
    }
  }))
  for(let i=-20;i<=20;i++) {
    obj.particles[i] = flatten({
      type: 'polygon',
      polygonData: {
        sides: i,
        size: 1,
        inner: 0.5
      }
    })
  }
  
  for(let i in obj.entityData) {
    let d = obj.entityData[i], r = d.render
    for(let u=0,l=r.length;u<l;u++) {
      let e = r[u]
      flatten(e)
    }
    if(d.radiantBase) {
      d.radiantBase = flatten({
        type: 'polygon',
        polygonData: {
          sides: d.radiantBase.sides,
          size: d.radiantBase.size >= 0 ? d.radiantBase.size : 1,
        }
      })
    } else {
      d.radiantBase = flatten({
        type: 'polygon',
        polygonData: {
          sides: 0,
          size: 1,
        }
      })
    }
  }

  let multiplyKeys = {
    size: true,
  }, addKeys = {
    rotationSpeedIncrease: true,
  }, minKeys = {
    reload: true,
  }, maxKeys = {
    shake: true,
    mobScore: true,
    mobSize: true,
    mobHealth: true,
    renderSize: true,
    healthBarType: true,
    damageFlash: true,
  }, maxAbsKeys = {
    polygonRotationSpeed: true,
    polygonAcceleration: true,
  }, exists = function(a) {
    return a !== null && typeof a !== 'undefined'
  }

  obj.readRaw = function(data, key, rarity) {
    if(data) {
      data = data[key]
    } else {
      return
    }
    if(Array.isArray(data)) {
      return data[rarity]
    }
    return data
  }

  obj.updateDataRaw = function(obj, data, rarity) {
    if(data) {
      if(data.render) { obj.render.push(...data.render) }
      for(let k in multiplyKeys) {
        let v = readRaw(data.data, k, rarity)
        if(exists(v)) {
          obj.data[k] *= v
        }
      }
      for(let k in addKeys) {
        let v = readRaw(data.data, k, rarity)
        if(exists(v)) {
          obj.data[k] += v
        }
      }
      for(let k in minKeys) {
        let v = readRaw(data.data, k, rarity)
        if(v < obj.data[k]) {
          obj.data[k] = v
        }
      }
      for(let k in maxKeys) {
        let v = readRaw(data.data, k, rarity)
        if(v > obj.data[k]) {
          obj.data[k] = v
        }
      }
      for(let k in maxAbsKeys) {
        let v = readRaw(data.data, k, rarity)
        if(Math.abs(v) > Math.abs(obj.data[k])) {
          obj.data[k] = v
        }
      }
    }
  }
  
  const sameSubtype = obj.sameSubtype = function(a, b) {
    if(a === b) {
      return true
    } else if(Array.isArray(a) && Array.isArray(b)) {
      let la = a.length, lb = b.length
      if(la === lb) {
        for(let i=0;i<la;i++) {
          if(a[i] !== b[i]) {
            return false
          }
        }
        return  true
      }
      return false
    }
    return false
  }

  obj.updateData = function(obj, subtype, rarity) {
    if(sameSubtype(obj.lastSubtype, subtype)) {
      return
    }
    console.log('updateData', subtype, rarity)
    obj.firedBarrels = {}
    obj.subtype = subtype
    obj.lastSubtype = subtype
    obj.render = []
    obj.radiantBase = {}
    obj.data = {
      size: 1,
      reload: Infinity,
      shake: 0,
      rotationSpeedIncrease: 0,
      mobScore: 0,
      mobSize: 0,
      mobHealth: 0,
      renderSize: false,
      healthBarType: 0,
      damageFlash: 0,
      polygonRotationSpeed: 0,
      polygonAcceleration: 0,
    }
    if(typeof subtype === 'string') {
      if(subtype) {
        let data = entityData[subtype]
        obj.radiantBase = data.radiantBase
        updateDataRaw(obj, data, rarity)
      }
    } else if(Array.isArray(subtype)) {
      for(let i=0,l=subtype.length;i<l;i++) {
        let s = subtype[i]
        if(s) {
          let data = entityData[s]
          obj.radiantBase = data.radiantBase
          updateDataRaw(obj, data, rarity)
        }
      }
    }
    if(obj.data.renderSize === false) {
      obj.data.renderSize = 1
    }
    obj.barrels = []
    obj.section = true
    obj.sections = []
    obj.renderSections = [obj]
    updateRender(obj, obj.barrels, obj.sections, obj.renderSections)
  }
  
  let updateRender = function(obj, barrels, sections, renderSections, slice) {
    let render = slice ? obj.render.slice() : obj.render
    for(let i=0,l=render.length;i<l;i++) {
      let r = render[i] = { ...render[i] }
      if(r.type === 'barrel') {
        r.lastFire = 0
        r.barrel = true
        r.node = obj
        r.fireTime = 0
        if(!r.render) {
          let t = defaultBarrels[r.btype]
          if(t) {
            r.render = t
          }
        }
        r.barrelId = barrels.length
        barrels.push(r)
      } else if(r.type === 'section') {
        r.section = true
        renderSections.push(r)
        if(r.dynamicRotate || r.dynamicSlide) {
          r.sectionId = sections.length
          sections.push(r)
        }
      }
      if(r.joints) {
        r.joints = copyJoints(r.joints)
      }
      if(r.render) {
        r.render = updateRender(r, barrels, sections, renderSections, true)
      }
    }
    return render
  }

  let copyJoints = function(j) {
    let joints = j.slice()
    for(let i=0,l=joints.length;i<l;i++) {
      joints[i] = { ...joints[i] }
    }
    return joints
  }
  
  obj.resolveOscillator = function(o, defaultValue, now) {
    return o ? Math.sin(now * 0.001 * o.angularSpeed + (o.angularOffset || 0)) * o.speed + (o.offset || 0) : defaultValue
  }
  
  obj.getRotation = function(d, o, now) {
    return (o.d ? o.d : 0) + (o.rotationLock ? 0 : (d || 0)) + (o.rotationSpeed ? o.rotationSpeed * now * 0.001 : 0) + obj.resolveOscillator(o.rotationOscillate, 0, now)
  }

  obj.updatePath = function(entity, dt, sTicks, now, partial, client, cameraX, cameraY, gameW, gameH, gameScale, iGameScale, updateJoints, addParticle, fd, wm, hm, topd) {
    if(!partial) {
      entity.rx = (entity.x - cameraX) * gameScale + gameW
      entity.ry = (entity.y - cameraY) * gameScale + gameH
    }
    if(!(wm >= 0)) { wm = 1 }
    if(!(hm >= 0)) { hm = 1 }
    let bounds = entity.bounds
    if(bounds) {
      bounds.left = bounds.right = entity.rx
      bounds.top = bounds.bottom = entity.ry
    } else {
      bounds = entity.bounds = {
        left: entity.rx,
        right: entity.rx,
        top: entity.ry,
        bottom: entity.ry
      }
    }
    let render = entity.render, d = entity.rd, cos = Math.cos(d), sin = Math.sin(d), size = entity.rsize >= 0 ? entity.rsize : entity.radius
    for(let i=0,l=render.length;i<l;i++) {
      let o = render[i], l = 0
      if(o.fixedLineWidth) {
        l = o.fixedLineWidth * gameScale
      } else {
        if(o.lineWidth) {
          l = o.lineWidth * size * gameScale
        }
      }
      if(!o.reverseOrder) {
        l *= 0.5
      }
      if(o.type === 'path') {
        let nd = o.rd = obj.getRotation(d, o, now)
        if(client) {
          let joints = o.joints
          let w = wm * ((o.w >= 0 || o.w <= 0) ? o.w : 1)
          let h = hm * ((o.h >= 0 || o.h <= 0) ? o.h : 1)
          let s, c
          if(nd === d) {
            s = sin
            c = cos
          } else {
            s = Math.sin(nd)
            c = Math.cos(nd)
          }
          let tx = o.x || 0, ty = o.y || 0
          let nsize = size * obj.resolveOscillator(o.sizeOscillate, 1, now)
          if(o.fixedSizeIncrease > 0 || o.fixedSizeIncrease < 0) {
            nsize += o.fixedSizeIncrease
          }
          updateJoints(joints, c, s, nsize, bounds, entity.rx, entity.ry, tx, ty, l, w, h, fd, o.recoilData)
        }
      } else if(o.type === 'section') {
        let m = client ? entity.radius * gameScale : entity.radius
        o.rx = entity.rx + m * (o.x * cos - o.y * sin)
        o.ry = entity.ry + m * (o.y * cos + o.x * sin)
        o.radius = o.size * entity.radius
        o.rsize = o.radius
        o.rd = obj.getRotation((o.rotate === 'relative' ? d : (o.rotate === 'inherit' ? topd : 0)), o, now)
        obj.updatePath(o, dt, sTicks, now, true, client, cameraX, cameraY, gameW, gameH, gameScale, iGameScale, updateJoints, addParticle, fd, wm, hm, topd)
        let b = o.bounds
        if(b.left < bounds.left) {
          bounds.left = b.left
        }
        if(b.right > bounds.right) {
          bounds.right = b.right
        }
        if(b.bottom < bounds.bottom) {
          bounds.bottom = b.bottom
        }
        if(b.top > bounds.top) {
          bounds.top = b.top
        }
      } else if(o.type === 'barrel') {
        let m = client ? entity.radius * gameScale : entity.radius
        o.rx = entity.rx + m * (o.x * cos - o.y * sin)
        o.ry = entity.ry + m * (o.y * cos + o.x * sin)
        o.radius = entity.radius
        o.rsize = o.radius
        o.rd = obj.getRotation(d, o, now)
        let fd = 0
        if(o.barrel && o.fireTime >= 0) {
          if(o.fireTime > 1) {
            fd = 2 - o.fireTime
            o.fireTime -= dt * 0.01
            if(o.fireTime < 1) {
              o.fireTime = 1
            }
          } else if(o.fireTime > 0) {
            fd = o.fireTime
            o.fireTime -= dt * 0.01
            if(o.fireTime < 0) {
              o.fireTime = 0
            }
          } else {
            o.fireTime = 0
          }
        }
        let w = wm * ((o.w >= 0 || o.w <= 0) ? o.w : 1)
        let h = hm * ((o.h >= 0 || o.h <= 0) ? o.h : 1)
        obj.updatePath(o, dt, sTicks, now, true, client, cameraX, cameraY, gameW, gameH, gameScale, iGameScale, updateJoints, addParticle, fd, w, h, topd)
        let b = o.bounds
        if(b.left < bounds.left) {
          bounds.left = b.left
        }
        if(b.right > bounds.right) {
          bounds.right = b.right
        }
        if(b.bottom < bounds.bottom) {
          bounds.bottom = b.bottom
        }
        if(b.top > bounds.top) {
          bounds.top = b.top
        }
      } else if(o.type === 'array-animated') {
        let m = client ? entity.radius * gameScale : entity.radius
        let d = (o.speed > 0 || o.speed < 0 ) ? ( 1 + (now * 0.001 * o.speed) % 1) % 1 : 0
        for(let i=0;i<o.rmax;i++) {
          let s = (i + d) * o.imax
          let sizeM = 1, alphaM = 1, darknessM = 0
          if(o.animateSize) {
            sizeM = resolveAnimation(o.animateSize, s)
          }
          if(o.animateAlpha) {
            alphaM = resolveAnimation(o.animateAlpha, s)
          }
          if(o.animateDarkness) {
            darknessM = resolveAnimation(o.animateDarkness, s)
          }
          o.render[i].size = sizeM
          o.render[i].alpha = alphaM
          o.render[i].darkness = darknessM
        }
        o.rx = entity.rx
        o.ry = entity.ry
        o.radius = entity.radius * obj.resolveOscillator(o.sizeOscillate, 1, now)
        o.rsize = o.radius
        o.rd = obj.getRotation(d, o, now)
        obj.updatePath(o, dt, sTicks, now, true, client, cameraX, cameraY, gameW, gameH, gameScale, iGameScale, updateJoints, addParticle, fd, wm, hm, topd)
      } else if(o.type === 'transform') {
        let m = client ? entity.radius * gameScale : entity.radius
        o.rx = entity.rx + m * (o.x * cos - o.y * sin)
        o.ry = entity.ry + m * (o.y * cos + o.x * sin)
        o.radius = entity.radius * o.size * obj.resolveOscillator(o.sizeOscillate, 1, now)
        o.rsize = o.radius
        o.rd = obj.getRotation(d, o, now)
        obj.updatePath(o, dt, sTicks, now, true, client, cameraX, cameraY, gameW, gameH, gameScale, iGameScale, updateJoints, addParticle, fd, wm, hm, topd)
      } else if(o.render) {
        let m = client ? entity.radius * gameScale : entity.radius
        o.rx = entity.rx
        o.ry = entity.ry
        o.radius = entity.radius * obj.resolveOscillator(o.sizeOscillate, 1, now)
        o.rsize = o.radius
        o.rd = obj.getRotation(d, o, now)
        obj.updatePath(o, dt, sTicks, now, true, client, cameraX, cameraY, gameW, gameH, gameScale, iGameScale, updateJoints, addParticle, fd, wm, hm, topd)
      }
      if(o.particles) {
        let p = o.particles
        let size = entity.radius * (o.size >= 0 ? o.size : 1) * p.rsize * obj.resolveOscillator(o.sizeOscillate, 1, now)
        let amount = (sTicks > 6 ? 6 : sTicks) * p.amount
        let minSize = p.minSize, maxSize = p.maxSize
        if(p.size >= 0) {
          minSize = maxSize = p.size
        }
        let minSpeed = p.minSpeed, maxSpeed = p.maxSpeed
        if(p.speed >= 0 || p.speed <= 0) {
          minSpeed = maxSpeed = p.speed
        }
        let time = p.time
        switch(p.type) {
          case 'radial-out': {
            let offset = p.offset > 0 ? p.offset : 0
            for (let i = 2 * Math.random(); i < amount; i ++) {
              let angle = Math.random() * Math.PI * 2;
              let speed = size * (minSpeed === maxSpeed ? minSpeed : (minSpeed + (maxSpeed - minSpeed) * Math.random())) + p.absoluteSpeed
              let particleSize = size * (minSize === maxSize ? minSize : (minSize + (maxSize - minSize) * Math.random()))
              let sin = Math.sin(angle)
              let cos = Math.cos(angle)
              addParticle(p.layer, offset * sin * size, offset * cos * size, speed * sin, speed * cos, particleSize, angle, 0, 16777215, time, 1, p.radiant, 1, 1, entity)
            }
            break
          }
          case 'radial-in': {
            for (let i = 2 * Math.random(); i < amount; i ++) {
              let angle = Math.random() * Math.PI * 2
              let speed = size * (minSpeed === maxSpeed ? minSpeed : (minSpeed + (maxSpeed - minSpeed) * Math.random())) + p.absoluteSpeed
              let distance = speed * time
              let particleSize = size * (minSize === maxSize ? minSize : (minSize + (maxSize - minSize) * Math.random()))
              let sin = Math.sin(angle)
              let cos = Math.cos(angle)
              addParticle(p.layer, -distance * sin, -distance * cos, speed * sin, speed * cos, particleSize, angle, 0, 16777215, time, 1, p.radiant, 1, 1, entity)
            }
          }
        }
      }
    }
  }
  
  return obj
}

module.exports = constants