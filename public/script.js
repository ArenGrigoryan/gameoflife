'use strict'

var P = 10, field = [], dark = false, colours
const grasses = [], cows = [], wolves = [], update = {dark: dark}, FPS = 10, daytimeChangeRate = 10 *10000/FPS, daytimes = {day: null, night: null, define_night: null}
	, refreshCanvasShadow = () => { draw.shadowBlur = 1; draw.shadowColor = '#000000' }
	, autoDaytimeChanger = () => setInterval(() => { update.dark = !dark }, daytimeChangeRate)

for (let y = 0; y < 50; y++) {
	field.push([])
	for (let x = 0; x < 50; x++) {
		const cell = Math.random()
		if (cell < 0.5) field[y].push(0)
		else if (cell < 0.93) {
			field[y].push(1)
			grasses.push(new Grass(x,y))
		}
		else if (cell < 0.98) {
			field[y].push(2)
			cows.push(new Cow(x,y))
		}
		else {
			field[y].push(3)
			wolves.push(new Wolf(x,y))
		}
	}
}

const canvas = Object.assign(document.createElement('canvas'), {id: 'field', width: field[0].length*P, height: field.length*P, onclick: coords => { document.getElementById('coords-text').innerHTML = '('+Math.floor((coords.pageX-8)/P) + '; '+Math.floor((coords.pageY-8)/P)+')' } }), draw = canvas.getContext('2d')
document.body.append(canvas); refreshCanvasShadow()

draw.shadowBlur = 1
draw.shadowColor = '#000000'
document.body.appendChild(Object.assign(document.createElement('input'), {id: 'change-pixel-size', type: 'number', value: P})).oninput = () => {
	let changed = document.getElementById('change-pixel-size').value
	changed = changed == '' ? 0 : parseFloat(changed)
	if (typeof changed === 'number' && changed >= 0) {
		P = changed
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
		canvas.width = field[0].length*P
		canvas.height = field.length*P
		refreshCanvasShadow()
	}
	document.getElementById('change-pixel-size').value = P
}
document.body.appendChild(Object.assign(document.createElement('button'), {className: 'add-new-element', innerHTML: 'Add a cow'})).onclick = () => {
	const randomX = Math.floor(Math.random() * field[0].length), randomY = Math.floor(Math.random() * field.length)
	field[randomY][randomX] = 2
	cows.push(new Cow(randomX, randomY))
}
document.body.appendChild(Object.assign(document.createElement('button'), {className: 'add-new-element', innerHTML: 'Add a wolf'})).onclick = () => {
	const randomX = Math.floor(Math.random() * field[0].length), randomY = Math.floor(Math.random() * field.length)
	field[randomY][randomX] = 3
	wolves.push(new Wolf(randomX, randomY))
}
document.body.appendChild(Object.assign(document.createElement('label'), {id: 'brightness', innerHTML: 'Night '})).onclick = change => { update.dark = change.target.checked }
document.getElementById('brightness').appendChild(Object.assign(document.createElement('input'), {id: 'change-brightness', type: 'checkbox', checked: update.dark, onclick: change => { update.dark = change.target.checked; refreshDaytimes(true) }}))
document.body.appendChild(Object.assign(document.createElement('p'), {id: 'coords',innerHTML: 'Coordinates: '})).appendChild(Object.assign(document.createElement('i'), {id: 'coords-text', innerHTML: 'none'}))

const refreshDaytimes = (not1 = false) => {
	clearInterval(daytimes.day)
	clearTimeout(daytimes.define_night)
	clearInterval(daytimes.night)

	if (!dark && not1) {
		daytimes.night = autoDaytimeChanger()
		daytimes.define_night = setTimeout (() => { update.dark = !dark; daytimes.day = autoDaytimeChanger()}, daytimeChangeRate/4)
	}
	else {
		daytimes.day = autoDaytimeChanger()
		daytimes.define_night = setTimeout (() => { update.dark = !dark; daytimes.night = autoDaytimeChanger()}, daytimeChangeRate/2+daytimeChangeRate/4)
	}
}; refreshDaytimes()

setInterval(() => {
	if (update.dark != undefined) {
		document.getElementById('change-brightness').checked = dark = update.dark
		colours = [
			dark ? '#70483c' : '#e1a95f', // earth
			dark ? '#567d46' : '#7cfc22', // grass
			'#f2ede5', 					  // cow
			dark ? '#acacac' : '#7cfc22'  // wolf
		]
		document.body.style.backgroundColor = dark ? '#808080' : '#ffffff'
		document.getElementById('coords').style.color = document.getElementById('brightness').style.color = dark ? '#c0c0c0' : '#000000'
		delete update.dark
	}

	draw.clearRect(0, 0, canvas.width, canvas.height)
	for (var y = 0; y < field.length; y++) for (let x = 0; x < field[y].length; x++) {
		draw.fillStyle = colours[field[y][x]]
		draw.fillRect(x*P, y*P, P, P)
	}
	if (dark) for (let w of wolves) w.action()
	else for (let c of cows) c.action()
	for (let g of grasses) g.action()
}, 1000/FPS)

setInterval(() => {
	console.log(count(cows))
}, 1000)

// var DEV_COUNTER = 0, DEV_TIMING = 1; setInterval(() => { DEV_COUNTER+=DEV_TIMING; console.log(DEV_COUNTER) }, DEV_TIMING*1000) // DEVELOPING MODE