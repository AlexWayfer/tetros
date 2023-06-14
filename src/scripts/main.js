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
		}
	})
})
