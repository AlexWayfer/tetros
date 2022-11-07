Array.prototype.sample = require('array-sample')

import { Playground } from './components/playground'

window.addEventListener('load', _event => {
	document.querySelectorAll('.playground').forEach(element => {
		new Playground(element)
	})
})
