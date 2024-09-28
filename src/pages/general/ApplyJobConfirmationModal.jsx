import React from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'

function exampleReducer(state, action) {
  switch (action.type) {
    case 'close':
      return { open: false }
    case 'open':
      return { open: true, size: action.size }
    default:
      throw new Error('Unsupported action...')
  }
}

const ApplyJobConfirmationModal = (props) => {
  const [state, dispatch] = React.useReducer(exampleReducer, {
    open: false,
  })
  const { open } = state;

  return (
    <>
      <Button primary size={props.size} onClick={() => dispatch({ type: 'open' })} disabled={props.disabled}>
        Apply
      </Button>

      <Modal
        size={'mini'}
        open={open}
        onClose={() => dispatch({ type: 'close' })}
      >
        <Modal.Content>
          <p>Your profile will be shared with the employer.</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => dispatch({ type: 'close' })}>
            I don't accept
          </Button>
          <Button positive onClick={() => {
            props.applyJob();
            dispatch({ type: 'close' });
          }}>
            I accept
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

export default ApplyJobConfirmationModal