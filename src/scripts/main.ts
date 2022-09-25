import { Playground } from './components/playground'

window.addEventListener('load', _event => {
	document.querySelectorAll('.playground').forEach(element => {
		let playground = new Playground(element)
		playground.start()
	})
})
