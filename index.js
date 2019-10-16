// window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB

// if (!window.indexedDB) {
//     window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.")
// }

import 'preact-material-components/style.css'
import './style'
import { Component } from 'preact'
import { checkCookie, setCookie, getWidth, validateUrl, idbUrl } from './utils'

import Dialog from 'preact-material-components/Dialog'
import TextField from 'preact-material-components/TextField'

import BTCPay from './components/btcpayserver'
import Buttonrow from './components/buttonrow'
import Display from './components/display'
import Keypad from './components/keypad'
import BoardingModal from './components/boardingmodal'
import TopBar from './components/topbar'

export default class App extends Component {
	state = {
		payValue: '',
		sanitizedValue: 0,
		fontSize: 120,
		clientConfirm: false,
		btcpayOpen: false,
		btcpayurl: null,
		orderId: null
	}

	resetURL = () => {
		idbUrl('reset')
		this.setState({btcpayurl: null, onBoarding: true})
		// const cookie = `btcpayurl=null`
		// setCookie(cookie)
	}

	checkInvoices = () => {
		return
	}

	checkSize = () => {
		const div = document.getElementById('display')
		let maxWidth = getWidth(div.parentElement)
		let curWidth = getWidth(div, 1)
		const fontSize = this.state.fontSize
		const gamma = maxWidth / curWidth || 0
		if(curWidth > maxWidth){
			return this.setState({fontSize: Math.floor(fontSize * gamma)})
		}	
		
		if(curWidth < maxWidth && fontSize < 120) {
			return this.setState({fontSize: Math.min(fontSize * gamma, 120)})
		}
	}

	handleInput = (e) => {
		if(this.state.clientConfirm) return
		const key = e.target.innerText
		let value = this.state.payValue
		if(key == 'C') {
			value = value.substring(0, value.length - 1)
			if(value == '0'){value = ''}
			this.setState({payValue: value, sanitizedValue: Math.round(parseFloat(value) * 100) / 100})
			return this.checkSize()
		}
		if(key == '.' && value.includes(key)) return
		if(!value.length && key == '.') return this.setState({payValue: '0.'})
		this.setState((state, props) => {
			value = state.payValue + e.target.innerText
			return { payValue: value, sanitizedValue: Math.round(parseFloat(value) * 100) / 100 }
		})
		
		return this.checkSize()
	}

	handleConfirm = (e) => {
		e.preventDefault()
		if(this.state.payValue === '') return
		this.setState({clientConfirm: true})
	}

	openPayment = () => {
		document.btcpay.submit()
	}

	handleCancel = () => {
		if(this.state.payValue === '') return
		return this.setState({
			payValue: '',
			clientConfirm: false,
			sanitizedValue: 0,
			orderId: null
		})
	}

	handleURL = (e) => {
		const url = e.target.value
		if(validateUrl(url)){
			this.setState({btcpayurl: e.target.value})
		}
	}

	boarding = () => {
		const url = this.state.btcpayurl
		if(validateUrl(url)){
			idbUrl(url)
			// const cookie = `btcpayurl=${url}`
			// setCookie(cookie)
			this.setState({onBoarding: false})
		}
	}

	componentDidMount = () => {
		idbUrl().then(res => {
			const url = res
			// const url = checkCookie('btcpayurl')		
			if(!url){
				return this.setState({onBoarding: true})
			}
			// const btcpayurl = res
			this.setState({btcpayurl: url.url})
		})
		
	}

	render({}, {clientConfirm, onBoarding, payValue, fontSize, sanitizedValue}) {
		return (
			<div class='root'>
				<TopBar erase={this.resetURL}/>
				{onBoarding && <BoardingModal 
					open={onBoarding} 
					click={this.boarding} 
					change={this.handleURL}
					url={this.state.btcpayurl} />}
				{clientConfirm && 
					<Dialog class='mdc-dialog--open'>
						<Dialog.Header>Riepilogo</Dialog.Header>
						<Dialog.Body>
							<TextField label="Aggiungi una nota (opzionale)" dense value={this.state.orderId} onInput={e => this.setState({orderId: e.target.value})}/>
							<h2>{`PAGA €${sanitizedValue.toFixed(2)} in CRYPTO`}</h2>
							<BTCPay value={sanitizedValue} url={this.state.btcpayurl} orderId={this.state.orderId} />
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.FooterButton cancel={true} onClick={this.handleCancel}>ANNULLA</Dialog.FooterButton>
							<Dialog.FooterButton accept={true} onClick={this.openPayment}>CONFERMA</Dialog.FooterButton>
						</Dialog.Footer>
					</Dialog>
				}
				<Display value={payValue} fontSize={fontSize} />
				<Keypad click={this.handleInput} client={clientConfirm}/>
				<Buttonrow confirm={this.handleConfirm} cancel={this.handleCancel}  />
			</div>
		)
	}
}
