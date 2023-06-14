Array.prototype.sample = require('array-sample')

import { Playground } from './components/playground'

window.addEventListener('load', _event => {
	const playground = new Playground(document.querySelector('.playground'))

	document.querySelector('body').addEventListener('keydown', (event) => {
		// console.debug(event.code)

		switch (event.code) {
			case 'Escape':
				playground.pause()
				break
			case 'Space':
				if (!playground.isStarted) {
					playground.start()
				} else if (playground.isPaused) {
					playground.resume()
				} else if (playground.isStopped) {
					playground.restart()
				} else {
					// Just a game, DROP THE FIGURE
				}
				break
		}
	})
})
