import Button from 'preact-material-components/Button'

const Buttonrow = ({cancel, confirm}) => {
    return (
        <div class='buttons'>
            <Button onClick={cancel}>Cancella</Button>
            <Button raised onClick={confirm}>PAGA</Button>
        </div>
    )
}

export default Buttonrow
