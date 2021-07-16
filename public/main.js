FPS = 1
socket = io()
P = 10, colours = [], dark = false, update = {dark: dark}

refreshCanvasShadow = () => { Draw.shadowBlur = 1; Draw.shadowColor = '#000000' }
autoDaytimeChanger = () => setInterval(() => { update.dark = !dark }, daytimeChangeRate)

refreshDaytimes = (not1st = false) => {
	console.log('true')
	clearInterval(daytimes.day)
	clearTimeout(daytimes.define_night)
	clearInterval(daytimes.night)

	if (!dark && not1st) {
		daytimes.night = autoDaytimeChanger()
		daytimes.define_night = setTimeout (() => { update.dark = !dark; daytimes.day = autoDaytimeChanger()}, daytimeChangeRate/4)
	}
	else {
		daytimes.day = autoDaytimeChanger()
		daytimes.define_night = setTimeout (() => { update.dark = !dark; daytimes.night = autoDaytimeChanger()}, daytimeChangeRate/2+daytimeChangeRate/4)
	}
}

// function f1(field){
	
// }

const draw = (field) => {
	if (flag) {
		canvas = Object.assign(document.createElement('canvas'), {id: 'field', width: field[0].length*P, height: field.length*P, onclick: coords => { document.getElementById('coords-text').innerHTML = '('+Math.floor((coords.pageX-8)/P) + '; '+Math.floor((coords.pageY-8)/P)+')' } }), Draw = canvas.getContext('2d')
		
		daytimeChangeRate = 10 *10000/FPS, daytimes = {day: null, night: null, define_night: null}
		document.body.append(canvas); refreshCanvasShadow()

		Draw.shadowBlur = 1
		Draw.shadowColor = '#000000'
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
		document.body.appendChild(Object.assign(document.createElement('button'), {className: 'add-new-element', innerHTML: 'Add a bomb'})).onclick = () => {
			const randomX = Math.floor(Math.random() * field[0].length), randomY = Math.floor(Math.random() * field.length)
			field[randomY][randomX] = 4
			bombs.push(new Bomb(randomX, randomY))
		}
		document.body.appendChild(Object.assign(document.createElement('button'), {className: 'add-new-element', innerHTML: 'Add a human'})).onclick = () => {
			const randomX = Math.floor(Math.random() * field[0].length), randomY = Math.floor(Math.random() * field.length)
			field[randomY][randomX] = 5
			humans.push(new Human(randomX, randomY))
		}
		document.body.appendChild(Object.assign(document.createElement('label'), {id: 'brightness', innerHTML: 'Night '})).onclick = change => { update.dark = change.target.checked }
		document.getElementById('brightness').appendChild(Object.assign(document.createElement('input'), {id: 'change-brightness', type: 'checkbox', checked: update.dark, onclick: change => { update.dark = change.target.checked; refreshDaytimes(true) }}))
		document.body.appendChild(Object.assign(document.createElement('p'), {id: 'coords',innerHTML: 'Coordinates: '})).appendChild(Object.assign(document.createElement('i'), {id: 'coords-text', innerHTML: 'none'}))

		refreshDaytimes()

		flag = false
	}
	// console.log(update)
	if (update.dark != undefined) {
		document.getElementById('change-brightness').checked = dark = update.dark
		colours = [
			dark ? '#70483c' : '#e1a95f', // earth (0)
			dark ? '#567d46' : '#7cfc22', // grass (1)
			'#f2ede5', 					  // cow   (2)
			dark ? '#acacac' : '#7cfc22', // wolf  (3)
			dark ? '#aa443e' : '#ff0000', // bomb  (4)
			dark ? '#a1665e' : '#ecbcb4', // human (5)
		]
		document.body.style.backgroundColor = dark ? '#808080' : '#ffffff'
		document.getElementById('coords').style.color = document.getElementById('brightness').style.color = dark ? '#c0c0c0' : '#000000'
		delete update.dark
		
	}
	Draw.clearRect(0, 0, canvas.width, canvas.height)
	console.log( field[0] )
	for (var y = 0; y < field.length; y++) {
		for (let x = 0; x < field[y].length; x++) {
			Draw.fillStyle = colours[field[y][x]]
			console.log(colours[field[y][x]]);
			
			Draw.fillRect(x*P, y*P, P, P)
		}
	}

	// document.getElementById('stats_grasses').innerHTML = grasses.length
	// document.getElementById('stats_cows').innerHTML = cows.length
	// document.getElementById('stats_wolves').innerHTML = wolves.length
	// document.getElementById('stats_bombs').innerHTML = bombs.length
	// document.getElementById('stats_humans').innerHTML = humans.length
}

flag = true

setInterval( () => {
	socket.on('send field', draw)
}, 1000/FPS)

//artur.matevosyan2@tumo.org

// var DEV_COUNTER = 0, DEV_TIMING = 1; setInterval(() => { DEV_COUNTER+=DEV_TIMING; console.log(DEV_COUNTER) }, DEV_TIMING*1000) // A TIMER FOR DEVELOPING MODE