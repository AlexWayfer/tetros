Array.prototype.sample = require('array-sample')

import { Playground } from './components/playground'

window.addEventListener('load', _event => {
	const playground = new Playground(document.querySelector('.playground'))

	document.querySelector('body').addEventListener('keydown', (event) => {
		// console.debug(event.code)

		switch (event.code) {
			case 'Escape':
				if (!playground.isPaused) {
					playground.pause()
				} else {
					playground.resume()
				}
				break
			case 'Space':
				if (!playground.isStarted) {
					playground.start()
				} else if (playground.isPaused) {
					playground.resume()
				} else if (playground.isStopped) {
					playground.restart()
				} else {
					playground.forceDown()
				}
				break
			case 'ArrowDown':
				if (playground.isStarted && !playground.isPaused && !playground.isStopped) {
					playground.forceDown()
				}
				break
		}
	})
})
