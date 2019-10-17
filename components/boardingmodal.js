
import Dialog from 'preact-material-components/Dialog'
import TextField from 'preact-material-components/TextField'

const BoardingModal = ({open, change, click, url}) => {    
    return (
        <Dialog class={open ? 'mdc-dialog--open' : ''} onAccept={click}>
            <Dialog.Header>INSTALLAZIONE</Dialog.Header>
            <Dialog.Body>
              <TextField fullwidth type='url' placeholder="URL CryptoLocalPOS" onChange={change} value={url}/>             
            </Dialog.Body>
            <Dialog.Footer>
                <Dialog.FooterButton accept={true} onClick={click}>Accept</Dialog.FooterButton>
            </Dialog.Footer>
        </Dialog>
    )
}

export default BoardingModal
