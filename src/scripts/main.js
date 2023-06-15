Array.prototype.sample = require('array-sample')

import { Playground } from './components/playground'

window.addEventListener('load', _event => {
	const playground = new Playground(document.querySelector('.playground'))

	document.querySelector('body').addEventListener('keydown', event => {
		console.debug('body keydown event.code = ', event.code)

		switch (playground.state) {
			case 'initialized':
				switch (event.code) {
					case 'Space':
						playground.start()
						break
				}
				break
			case 'running':
				switch (event.code) {
					case 'Escape':
						playground.pause()
						break
					case 'Space':
						playground.forceDown()
						break
					case 'ArrowDown':
						playground.accelerate()
						break
				}
				break
			case 'paused':
				switch (event.code) {
					case 'Escape':
						playground.resume()
						break
					case 'Space':
						playground.resume()
						break
				}
				break
			case 'stopped':
				switch (event.code) {
					case 'Space':
						playground.restart()
						break
				}
		}
	})

	document.querySelector('body').addEventListener('keyup', event => {
		console.debug('body keyup event.code = ', event.code)

		switch (playground.state) {
			case 'accelerated':
				switch (event.code) {
					case 'ArrowDown':
						playground.stopAcceleration()
						break
				}
				break
		}
	})
})
