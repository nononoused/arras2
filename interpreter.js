const interpreter = {
	end: function(s) {
		throw new Error(s)
	},
	parse: function(s) {
		let a = []
		while(s) {
			let n = this.line(s)
			if(n[0]) {
				a.push(n[0])
			}
			s = n[1]
		}
		return a
	},
	line: function(s, g) {
		let i = 0
		while(s[i] === '\n' || s[i] === ' ') { i ++ }
		if(i) { s = s.slice(i) }
		if(!s) { return [false, ''] }
		if(s.startsWith('//')) {
			let i = s.indexOf('\n')
			if(i < 0) {
				return [false, '']
			}
			s = s.slice(i + 1)
			return this.line(s, g)
		}
		if(s.startsWith('for')) {
			let j = this.trim(s.slice(3))
			if(j[0] === '(') {
				s = j
				let n1 = this.line(this.trim(s.slice(1)))
				s = this.trim(n1[1])
				let n2 = this.block(s)
				s = this.trim(n2[1].slice(1))
				let n3 = this.line(s, ')')
				s = this.trim(n3[1].slice(1))
				let m = []
				if(s[0] === '{') {
					s = this.trim(s.slice(1))
					let v = false
					if(s[0] === ')') {
						s = this.trim(s.slice(1))
						v = true
					} else {
						while(s) {
							let b = this.line(s, '}')
							s = this.trim(b[1])
							m.push(b[0])
							if(s[0] === '}') {
								s = this.trim(s.slice(1))
								v = true
								break
							}
						}
					}
					if(!v) {
						this.end('closing } expected')
					}
					if(m.length <= 0) { m = false }
				} else {
					m = this.line(s)
					s = '\n' + m[1]
					m = [m[0]]
				}
				return [{
					type: 'for',
					init: n1[0],
					condition: n2[0],
					after: n3[0],
					true: m
				}, this.checkEnd(s, g)]
			}
		}
		if(s.startsWith('while')) {
			let j = this.trim(s.slice(5))
			if(j[0] === '(') {
				s = j
				let n = this.parameters(this.trim(s.slice(1)), ')')
				s = this.trim(n[1])
				if(n[0].length <= 0) {
					this.end('while statement empty')
				}
				let m = []
				if(s[0] === '{') {
					s = this.trim(s.slice(1))
					let v = false
					if(s[0] === '}') {
						s = this.trim(s.slice(1))
						v = true
					} else {
						while(s) {
							let b = this.line(s, '}')
							s = this.trim(b[1])
							m.push(b[0])
							if(s[0] === '}') {
								s = this.trim(s.slice(1))
								v = true
								break
							}
						}
					}
					if(!v) {
						this.end('closing } expected')
					}
					if(m.length <= 0) { m = false }
				} else {
					m = this.line(s)
					s = '\n' + m[1]
					m = [m[0]]
				}
				let c = n[0][n[0].length - 1]
				return [{
					type: 'while',
					condition: c,
					true: m
				}, this.checkEnd(s, g)]
			}
		}
		if(s.startsWith('if')) {
			let j = this.trim(s.slice(2))
			if(j[0] === '(') {
				s = j
				let f = false
				let n = this.parameters(this.trim(s.slice(1)), ')')
				s = this.trim(n[1])
				if(n[0].length <= 0) {
					this.end('if statement empty')
				}
				let m = []
				if(s[0] === '{') {
					s = this.trim(s.slice(1))
					let v = false
					if(s[0] === '}') {
						s = this.trim(s.slice(1))
						v = true
					} else {
						while(s) {
							let b = this.line(s, '}')
							s = this.trim(b[1])
							m.push(b[0])
							if(s[0] === '}') {
								s = this.trim(s.slice(1))
								v = true
								break
							}
						}
					}
					if(s.startsWith('else')) {
						s = this.trim(s.slice(4))
						let k = []
						if(s[0] === '{') {
							s = this.trim(s.slice(1))
							let v = false
							if(s[0] === '}') {
								v = true
								s = this.trim(s.slice(1))
							} else {
								while(s) {
									let b = this.line(s, '}')
									s = this.trim(b[1])
									k.push(b[0])
									if(s[0] === '}') {
										s = this.trim(s.slice(1))
										v = true
										break
									}
								}
							}
							if(!v) {
								this.end('closing } expected')
							}
							if(k.length > 0) {
								f = k
							}
						} else if(s.startsWith('if')) {
							let b = this.line(s)
							s = b[1]
							f = [b[0]]
						}
					}
					if(!v) {
						this.end('closing } expected')
					}
					if(m.length <= 0) { m = false }
				} else {
					m = this.line(s)
					s = '\n' + m[1]
					m = [m[0]]
				}
				let c = n[0][n[0].length - 1]
				return [{
					type: 'if',
					condition: c,
					true: m,
					false: f
				}, this.checkEnd(s, g)]
			}
		}
		if(s.startsWith('break')) {
			let j = this.trim(s.slice(5))
			if(this.identifiers.indexOf(j[0]) < 0 && this.numbers.indexOf(j[0]) < 0) {
				s = j
				return [{
					type: 'break'
				}, this.checkEnd(s, g)]
			}
		}
		if(s.startsWith('continue')) {
			let j = this.trim(s.slice(8))
			if(this.identifiers.indexOf(j[0]) < 0 && this.numbers.indexOf(j[0]) < 0) {
				s = j
				return [{
					type: 'continue'
				}, this.checkEnd(s, g)]
			}
		}
		if(s.startsWith('delete ')) {
			s = this.trim(s.slice(7))
			let n = this.expression(s)
			s = this.trim(n[0][1])
			if(n[1] === 'memory') {
				let f = n[0][0]
				let l = f.operations.length
				if(l === 0) {
					f.type = 'deletekey'
					delete f.operations
					return [f, this.checkEnd(s, g)]
				} else {
					let r = f.operations.splice(l - 1, 1)[0]
					if(r.type === 'get') {
						f.type = 'memoryset'
						f.delete = true
						f.deleteKey = r.key
						return [f, this.checkEnd(s, g)]
					}

				}
			}
			this.end('refused to parse line')
		}
		if(s.startsWith('return ')) {
			s = this.trim(s.slice(7))
			let n = this.block(s)
			s = this.trim(n[1])
			return [{
				type: 'return',
				value: n[0]
			}, this.checkEnd(s, g)]
		}
		let n = this.expression(s)
		s = this.trim(n[0][1])
		if(n[1] === 'memory') {
			let f = n[0][0]
			let l = f.operations.length
			if(l && f.operations[l - 1].type === 'apply') {
				return [f, this.checkEnd(s, g)]
			}
			if(s[0] === '=') {
				let o = this.block(this.trim(s.slice(1)))
				f.type = 'memoryset'
				f.value = o[0]
				return [f, this.checkEnd(o[1], g)]
			}
			if(s[1] === '=' && this.operators0.indexOf(s[0]) >= 0) {
				let o = this.block(this.trim(s.slice(2)))
				f.value = {
					operation: s[0],
					b: o[0]
				}
				f.type = 'memoryset'
				return [f, this.checkEnd(o[1], g)]
			}
			if(s[0] === s[1] && (s[0] === '+' || s[0] === '-')) {
				f.value = {
					operation: s[0],
					b: 1
				}
				s = this.trim(s.slice(2))
				f.type = 'memoryset'
				return [f, this.checkEnd(s, g)]
			}
		}
		this.end('refused to parse line')
	},
	checkEnd: function(s, g) {
		s = this.trim(s)
		if(!s) {
			return ''
		}
		if(s[0] === g) {
			return s
		}
		if(s[0] === '\n' || s[0] === ';') {
			return s.slice(1)
		}
		if(s.startsWith('//')) {
			return s
		}
		this.end('expected \\n or ; after line')
	},
	expression: function(s) {
		// "3" -> 3
		// "memory.a" -> { type:"memory", key:"a", operations:[] }
		s = this.trim(s)
		if(this.isNumber(s)) {
			let n = this.number(s)
			return [n, 'number']
		} else if(this.isString(s)) {
			let n = this.string(s)
			return [n, 'string']
		} else if(this.isArray(s)) {
			let n = this.array(s)
			return [n, 'array']
		} else if(this.isMemory(s)) {
			let n = this.memory(s)
			return [n, 'memory']
		}
		this.end('invalid expression')
	},
	trim: function(s) {
		// "  whatever" -> "whatever"
		let i = 0
		while(s[i] === ' ') { i ++ }
		if(i) { s = s.slice(i) }
		return s
	},
	identifiers: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_',
	numbers: '0123456789',
	numeric: '-0123456789',
	isArray: function(s) {
		return s[0] === '['
	},
	array: function(s) {
		s = this.trim(s.slice(1))
		return this.parameters(s, ']')
	},
	isString: function(s) {
		return s[0] === '"' || s[0] === "'"
	},
	string: function(s) {
		let t = s[0], b = true
		s = s.slice(1)
		for(let i=0,l=s.length;i<l;i++) {
			let c = s[i]
			if(c === '\\' && b) {
				b = false
			} else if(c === t && b) {
				return [s.slice(0, i), s.slice(i + 1)]
			}
		}
		this.end('failed to parse string')

	},
	isMemory: function(s) {
		// "memory.whatever" -> true
		// "whatever" -> false
		return this.identifiers.includes(s[0])
	},
	memory: function(s) {
		// "memory.a" -> { type:"memory", key:"a", operations:[] }
		//s = s.slice(7)
		let r = ''
		if(this.identifiers.indexOf(s[0]) >= 0) {
			for(let i=1,l=s.length;i<l;i++) {
				let c = s[i]
				if(this.identifiers.indexOf(c) < 0 && this.numbers.indexOf(c) < 0) {
					r = this.trim(s.slice(i))
					s = s.slice(0, i)
					break
				}
			}
			let n = this.operations(r)
			r = n[1]
			return [{
				type: 'memory',
				key: s,
				operations: n[0]
			}, r]
		}
		this.end('identifier expected')
	},
	isNumber: function(s) {
		// "4.5e+9" -> true
		// "whatever" -> false
		return this.numeric.indexOf(s[0]) >= 0
	},
	number: function(s) {
		// "1.2e1" -> 12
		if(s[0] === '-') {
			let n = this.number(s.slice(1))
			n[0] = -n[0]
			return n
		}
		let r = '', t = '', d = true, e = true
		for(let i=0,l=s.length;i<l;i++) {
			let c = s[i]
			if(this.numbers.indexOf(c) >= 0) {
				t += c
			} else if(c === '.' && d) {
				d = false
				t += c
			} else if(c === 'e' && e) {
				d = e = false
				t += c
				let n = s[i + 1]
				if(n === '+' || n === '-') {
					t += n
					i ++
				}
			} else {
				r = s.slice(i)
				break
			}
		}
		if(t) {
			return [parseFloat(t), r]
		} else {
			this.end('number expected')
		}
	},
	operations: function(s) {
		// "[1][2]" -> [ { type:"get", key:1 }, { type:"get", key:2 } ]
		let t = []
		if(s[0] === '(') {
			s = s.slice(1)
			let n = this.parameters(s, ')')
			t.push({
				type: 'apply',
				parameters: n[0]
			})
			s = this.trim(n[1])
			let o = this.operations(s)
			t.push(...o[0])
			s = o[1]
		} else if(s[0] === '[') {
			s = s.slice(1)
			let n = this.block(s)
			t.push({
				type: 'get',
				key: n[0]
			})
			s = this.trim(n[1])
			if(s[0] === ']') {
				s = this.trim(s.slice(1))
				let o = this.operations(s)
				t.push(...o[0])
				s = o[1]
			} else {
				this.end('closing ] expected')
			}
		}
		return [t, s]
	},
	parameters: function(s, g) {
		let a = []
		s = this.trim(s)
		if(s[0] === g) {
			return [a, s.slice(1)]
		}
		while(s) {
			let n = this.block(s)
			a.push(n[0])
			s = this.trim(n[1])
			if(s[0] === g) {
				s = s.slice(1)
				return [a, s]
			} else if(s[0] === ',') {
				s = s.slice(1)
			} else {
				this.end(`expected , or ${g}`)
			}
		}
		this.end(`closing ${g} expected`)
	},
	checkblock: function(s, a) {
		let i = 0
		while(s[i] === '!' || s[i] === '~') {
			a = {
				type: s[i],
				a: a
			}
			if(typeof a.a !== 'object') {
				a = this.runOperation(a.type, a.a)
			}
			i ++
		}
		return a
	},
	block: function(s) {
		let a = []
		while(s) {
			s = this.trim(s)
			if(s[0] === '\n') {
				break
			}
			let i = 0
			while(s[i] === '!' || s[i] === '~') {
				i ++
			}
			let p = s.slice(0, i), r = false
			s = s.slice(i)
			if(s[0] === '(') {
				s = s.slice(1)
				let n = this.block(s)
				s = this.trim(n[1])
				if(s[0] === ')') {
					s = this.trim(s.slice(1))
					r = n[0]
				} else {
					this.end('closing ) expected')
				}
			} else {
				let n = this.expression(s)
				r = n[0][0]
				s = this.trim(n[0][1])
			}
			a.push(this.checkblock(p, r))
			let e = s[0] + s[1] + s[2], f = s[0] + s[1], g = s[0]
			if(this.operators3.indexOf(e) >= 0) {
				s = s.slice(3)
				a.push(e)
			} else if(this.operators2.indexOf(f) >= 0) {
				s = s.slice(2)
				a.push(f)
			} else if(this.operators1.indexOf(g) >= 0) {
				s = s.slice(1)
				a.push(g)
			} else {
				break
			}
		}
		for(let i=0,l=this.operatorsOrder.length;i<l;i++) {
			let p = this.operatorsOrder[i]
			for(let q=0;q<2;q++) {
				for(let i=0,l=a.length;i+2<l;i+=2) {
					let o = a[i + 1]
					if(p.indexOf(o) >= 0) {
						let y = {
							type: o,
							a: a[i],
							b: a[i + 2]
						}
						if(typeof y.a !== 'object' && typeof y.b !== 'object') {
							y = this.runOperation(y.type, y.a, y.b)
							a.splice(i, 3, y)
							i -= 2
							l -= 2
						} else if(q) {
							a.splice(i, 3, y)
							i -= 2
							l -= 2
						}
					}
				}
			}
		}
		if(a.length === 1) {
			a = a[0]
		} else {
			this.end('failed to parse block')
		}
		return [a, s]
	},
	operators0: ['+', '-', '*', '/', '%', '&', '|', '^'],
	operators1: ['+', '-', '*', '/', '%', '&', '|', '^', '>', '<'],
	operators2: ['**', '==', '<=', '>=', '&&', '||', '<<', '>>'],
	operators3: ['===', '!=='],
	operatorsOrder: [['**'], ['*', '/'], ['%'], ['+', '-'], ['<<', '>>'], ['==', '!=', '===', '!==', '>', '<', '>=', '<='], ['&&', '||'], ['&', '|', '^']],
	runOperation: function(type, a, b) {
		switch(type) {
			case '**':
				return Math.pow(a, b)
			case '*':
				return a * b
			case '/':
				return a / b
			case '+':
				return a + b
			case '-':
				return a - b
			case '%':
				return a % b
			case '&':
				return a & b
			case '|':
				return a | b
			case '^':
				return a ^ b
			case '==':
				return a == b
			case '!=':
				return a != b
			case '===':
				return a === b
			case '!==':
				return a !== b
			case '>':
				return a > b
			case '<':
				return a < b
			case '<=':
				return a <= b
			case '>=':
				return a >= b
			case '&&':
				return a && b
			case '||':
				return a || b
			case '<<':
				return a << b
			case '>>':
				return a >> b
			case '!':
				return !a
			case '~':
				return ~a
			default:
				this.end('invalid operation')
		}
	},
	compile: function(o, d) {
		let memory = {
			log: function() {
				return console.log(...arguments)
			},
			...d,
			true: true,
			false: false,
			sqrt: function(a) {
				return Math.sqrt(a)
			},
			PI: Math.PI,
			E: Math.E,
			abs: function(a) {
				return a < 0 ? -a : a
			},
			floor: function(a) {
				return Math.floor(a)
			},
			ceil: function(a) {
				return Math.ceil(a)
			},
			round: function(a) {
				return Math.round(a)
			},
			sin: function(a) {
				return Math.sin(a)
			},
			cos: function(a) {
				return Math.cos(a)
			},
			tan: function(a) {
				return Math.tan(a)
			},
			random: function() {
				return Math.random()
			},
			ln: function(a) {
				return Math.log(a)
			},
			exp: function(a) {
				return Math.exp(a)
			},
			pow: function(a, b) {
				return Math.pow(a, b)
			},
			length: function(a) {
				return a.length
			},
			slice: function(a, b, c) {
				return a.slice(b, c)
			},
			now: function() {
				return Date.now()
			},
			parseInt: function(a, b) {
				return parseInt(a, b)
			},
			parseFloat: function(a, b) {
				return parseFloat(a, b)
			},
			toString: function(a, b) {
				return a.toString(b)
			},
			stringify: function(a) {
				return JSON.stringify(a)
			},
			parse: function(a) {
				return JSON.parse(a)
			}
		}
		for(let i in o) {
			if(this.object[i] || !i) {
				this.end(`invalid key ${i}`)
			}
			memory[i] = this.parse(o[i])
		}
		return memory
	},
	run: function(memory, a, b, c, args, t) {
		if(Array.isArray(a)) {
			if(!args) { args = [] }
			for(let i=0,l=a.length;i<l;i++) {
				let l = a[i]
				if(l.type === 'break' || l.type === 'continue') {
					this.checkSwitch(l.type, b, c)
					return l.type
				}
				let r = this.runLine(memory, l, b, c, args)
				if(r === 'break' || r === 'continue') {
					this.checkSwitch(r, b, c)
					return r
				} if(r && r[0] === 'return') {
					return t ? r[1] : r
				}
			}
		} else {
			this.end(`${a} is not a function`)
		}
	},
	checkSwitch: function(a, b, c) {
		if(a === 'break' && !b) {
			this.end('illegal break statement')
		}
		if(a === 'continue' && !c) {
			this.end('illegal continue statement')
		}
	},
	runLine: function(memory, obj, b, c, args) {
		switch(obj.type) {
			case 'break': 
				return 'break'
			case 'continue':
				return 'continue'
			case 'return':
				return ['return', this.runBlock(memory, obj.value, args)]
			case 'deletekey': {
				if(this.object[obj.key] || !obj.key) {
					this.end(`invalid key ${obj.key}`)
				}
				delete memory[obj.key]
				break
			}
			case 'memoryset': {
				if(this.object[obj.key] || !obj.key) {
					this.end(`invalid key ${obj.key}`)
				}
				let l = obj.operations.length
				if(l === 0) {
					let k = obj.key
					let r = k === 'arguments' ? args : memory[k]
					if(obj.delete) {
						delete r[this.runBlock(memory, obj.deleteKey, args)]
						break
					}
					if(obj.value.operation) {
						r = this.runOperation(obj.value.operation, r, this.runBlock(memory, obj.value.b, args))
					} else {
						r = this.runBlock(memory, obj.value, args)
					}
					if(k === 'arguments') {
						this.end('can\'t set arguments')
					} else {
						memory[k] = r
					}
				} else {
					let a = obj.operations[l - 1]
					if(a.type === 'get') {
						let v = this.runMemory(memory, {
							...obj,
							operations: obj.operations.slice(0, l - 1)
						}, args)
						let k = this.runBlock(memory, obj.operations[l - 1].key, args)
						let r = v[k]
						if(obj.delete) {
							delete r[this.runBlock(memory, obj.deleteKey, args)]
							break
						}
						if(obj.value.operation) {
							r = this.runOperation(obj.value.operation, r, this.runBlock(memory, obj.value.b, args))
						} else {
							r = this.runBlock(memory, obj.value, args)
						}
						v[k] = r
					} else {
						this.end('invalid left-hand expression in assignment')
					}
				}
				break
			}
			case 'memory': {
				this.runMemory(memory, obj, args)
				break
			}
			case 'if': {
				let r = this.runBlock(memory, obj.condition, args)
				if(r) {
					if(obj.true) {
						return this.run(memory, obj.true, b, c, args)
					}
				}
				if(obj.false) {
					return this.run(memory, obj.false, b, c, args)
				}
			}
			case 'while': {
				while(this.runBlock(memory, obj.condition, args)) {
					if(this.run(memory, obj.true, true, false, args) === 'break') {
						break
					}
				}
				break
			}
			case 'for': {
				console.log('for', obj.true)
				for(this.runLine(memory, obj.init, args); this.runBlock(memory, obj.condition, args); this.runLine(memory, obj.after, args)) {
					let r = this.run(memory, obj.true, true, true, args)
					if(r === 'break') { break }
					if(r === 'continue') { continue }
				}
				break
			}
		}
	},
	runBlock: function(memory, block, args) {
		if(typeof block !== 'object') {
			return block
		}
		if(Array.isArray(block)) {
			let a = []
			for(let i=0,l=block.length;i<l;i++) {
				a.push(this.runBlock(memory, block[i], args))
			}
			return a
		}
		try {
			return this.runOperation(block.type, this.runBlock(memory, block.a, args), this.runBlock(memory, block.b, args))
		} catch(e) {}
		switch(block.type) {
			case 'memory': {
				return this.runMemory(memory, block, args)
			}
			default:
				this.end('invalid type')
		}
	},
	runMemory: function(memory, o, args) {
		if(this.object[o.key] || !o.key) {
			this.end(`invalid key ${o.key}`)
		}
		return this.unstackOperations(memory, o.key === 'arguments' ? args : memory[o.key], o.operations, args)
	},
	unstackOperations: function(memory, m, o, args) {
		let p = o[0], i = 0
		while(p) {
			switch(p.type) {
				case 'get': {
					let v = this.runBlock(memory, p.key, args)
					if(this.object[v] || typeof v !== 'number') {
						this.end(`invalid key ${p.key}`)
					}
					m = m[v]
					break
				}
				case 'apply': {
					let a = []
					for(let i=0,l=p.parameters.length;i<l;i++) {
						a.push(this.runBlock(memory, p.parameters[i], args))
					}
					if(typeof m === 'function') {
						m = m(...a)
					} else {
						m = this.run(memory, m, false, false, a, true)
					}
					break
				}
				default:
					this.end('invalid operation')
			}
			i ++
			p = o[i]
		}
		return m
	},
	object: {
		'break': true,
		'continue': true,
		'for': true,
		'while': 'true',
		'if': true,
		'return': true
	}
}


/*

======== scenexe2script ========

- Variables
  - Do not use `let`, `const`, `var`
  - All variables are global
  - To create a new one, just assign
  - To assign, `name = <value>`
    - Examples: `three = 3`, `six = 2 + 4`, `color = 'green'`
  - To read, type the name
    - Examples: `five = 2 + three`, `two = six / 3`
  - `+=`, `-=`, `*=`, and similar are supported
  - It is recommended not to assign default variables such as `log`
  - `__proto__`, `constructor`, `valueOf`, `toString`, and similar are not allowed as variable names
  - Variable names must start with one of `abcdefghijklmnopqrstuvwxuzABCDEFGHIJKLMNOPQRSTUVWXYZ$_`
  - While the first letter can't be a number, other letters can: `a5 = 1`

- Data Types
  - Number
    - Can be implicit
    - Examples: `num = 5`, `num = -3e6`, `num = 0.7`, `num = 9e-2`
  - String
    - Can be implicit but must use `'` or `"`
    - Examples: `str = 'hello'`, `str = "world"`
    - Subscriptable: `str = 'ABCDEF'; charB = str[1]`
    - DO NOT implicitly subscript: `charC = 'ABCDEF'[2]`
    - Instead: `str = 'ABCDEF'; charC = str[2]`
    - To get length, use `length(str)`
  - Array
    - Can be implicit
    - Examples: `arr = [1, 2, 3]`, `arr = [[0, 0], [0, 0]]`
    - Subscriptable: `arr = [0, 1, 2]; two = arr[2]`
    - DO NOT implicitly subscript: `two = [0, 1, 2][2]`
    - Instead: `arr = [0, 1, 2]; two = arr[2]`
    - To get length, use `length(arr)`
  - Function
    - Can't be implicitly defined, but can be executed
    - Examples: `log('hi')`, `sqrt(5)`

- Arguments
  - `arguments` variable is local
  - `arguments` is an array

- Operators
  - Basic: `+`, `-`, `*`, `/`, `%`, `**`
    - `+`: adds two numbers, also adds other things like strings
      - Example: `seven = 5 + 2`
    - `-`: subtracts the second number from the first
      - Example: `three = 5 - 2`
    - `*`: multiplies two numbers
      - Example: `eight = 4 * 2`
    - `/`: divides the first number by the second
      - Example: `two = 4 / 2`
    - `%`: remainder when first number is divided by the second
      - Example: `two = 11 % 3`
    - `**`: raises the first number to the power of the second
      - Example:`nine = 3 ** 2`
  - Bitwise `&`, `|`, `^`, `<<`, `>>`, `~`
    - `&`: bitwise AND
      - Example: `nine = 13 & 11`
    - `|`: bitsise OR
      - Example: `fifteen = 7 | 9`
    - `^`: bitwise XOR
      - Example: `six = 3 ^ 5`
    - `<<`: bitwise left shift
      - Example: `eight = 1 << 3`
    - `>>`: bitwise right shift
      - Example: `four = 16 >> 2`
    - `~`: bitwise not
      - Example: `one = ~-2`
  - Comparators: `==`, `!=`, `===`, `!==`, `>`, `<`, `>=`, `<=`
    - `==`: true if the left and right side are the same
      - Example: `if(1 == 1) { log('1 is equal to 1') }`
    - `!=`: true if the left and right side are not the same
      - Example: `if(1 != 2) { log('1 is not equal to 2') }`
    - `===`: `==` but stricter
      - Example: `if(3 === '3') { log('int 3 is strictly equal to str 3') }`
    - `!==`: `!=` but stricter
      - Example: `if(3 !== '3') { log('int 3 is not strictly equal to str 3') }`
    - `>`: true if left side is larger than right side
      - Example: `if(1 > 0) { log('1 is larger than 0') }`
    - `<`: true if left side is smaller than right side
      - Example: `if(1 < 0) { log('1 is smaller than 0') }`
    - `>=`: same as `>` but also true if left and right side are equal
      - Example: `if(1 >= 1) { log('1 is larger than or equal to 1') }`
    - `<=`: same as `<` but also true if left and right side are equal
      - Example: `if(1 <= 1) { log('1 is less than or equal to 1') }`
  - Logic: `&&`, `||`, `!`
    - `&&`: true if left and right side are true
      - Example: `if(1 === 3 / 3 && 1 === 4 / 4) { log('1 is equal to 3 / 3 and 4 / 4') }`
    - `||`: true if either left or right side is true
      - Example: `if(1 > 0 || 1 < 0) { log('1 is greater than 0 or less than 0') }`
    - `!`: true if statement after is false, false if statement after is true
      - Example: `if(!1 == 0) { log('1 is not equal to 0') }`

-Default Functions
  - `log`: same as `console.log`
  - `sqrt`: same as `Math.sqrt`, returns square root of input
  - `PI`: same as `Math.PI`, equals value of pi
  - `E`: same as `Math.E`, equals value of e
  - `abs`: same as `Math.abs`, returns distance from 0 to input
  - `floor`: same as `Math.floor`, returns input without any decimals, truncating
  - `ceil`: same as `Math.ceil`, returns the least number greater than or equal to input
  - `round`: same as `Math.round`, rounds the input to the nearest whole number
  - `sin`: same as `Math.sin`, returns sin of input
  - `cos`: same as `Math.cos`, returns cos of input
  - `tan`: same as `Math.tan`, returns tan of input
  - `random`: same as `Math.random`, returns random number in the interval [0, 1)
  - `ln`: same as `Math.log`, returns ln of input
  - `exp`: same as `Math.exp`, returns E to the power of input
  - `pow`: same as `Math.pow`, returns first input to the power of second input
  - `length`: returns length of string or array
  - `slice`: slices string or array. First argument is string or array, second and third arguments are slice inputs
  - `now`: same as `Date.now`, returns millis
  - `parseInt`: parses int from string, base can be specified
  - `parseFloat`: parses float from string, base can be specified
  - `toString`: converts first input to string
  - `stringify`: same as `JSON.stringify`, converts object to string
  - `parse`: same as `JSON.parse`, converts string to object

If, Else Statememts
  - `if(condition) { log('it is true') }`
  - `if(condition) log('it is true')`
  - `if(condition) { log('it is true') } else { log('it is not true') }`
  - `if(num == 1) { log('it is 1') } else if(num == 2) { log('it is 2') } else { log('it is not 1 or 2') }`

While Statements
  - `while(condition) { log('actions here') }`

For Statements
 - `for(i = 0; i < 10; i ++) { log(i) }`
 - `for(i = 3; i > 0; i --) log(i)`

Break
  - Only works in `while` or `for` loops
  - Breaks out of the loop
  - `break`

Continue
 - Only works in `for` loops
 - Skips to the next iteration
 - `continue`

Delete
  - Can be used to delete variables or properties
  - `delete three`
  - `delete arr[5]`

Comments
 - Start with `//`
 - Ends after line break

*/
