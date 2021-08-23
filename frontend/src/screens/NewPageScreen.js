import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Form, Button, Modal } from 'react-bootstrap'
import { Switch } from 'evergreen-ui'
import { LinkContainer } from 'react-router-bootstrap'
import Message from '../components/Message'
import { createNewPage } from '../actions/pageActions'

const NewPageScreen = ({ match, history }) => {    
    const [name, setName] = useState('' )
    const [text, setText] = useState('')
    const [file, setFile] = useState('')
    const [publicViewing, setPublicViewing] = useState(false)
    const [publicEditing, setPublicEditing] = useState(false)
    const [publicEditingModalShown, setPublicEditingModalShown] = useState(false)
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()

    const submitHandler = async (e) => {
        if (!name) {
            setMessage('Name is required')
        } else {
            console.log(file)
            await dispatch(createNewPage(match.params.userName, {
                name,
                text,
                file,
                publicViewing,
                publicEditing
            }))
            
            history.push(`/${match.params.userName}`)
        }
    }

    const PublicEditingModalCancel = () => {
        setPublicEditingModalShown(false)
        setPublicEditing(!publicEditing)
    }

    const toggleIsEditingPublic = () => {
        setPublicEditing(!publicEditing)
        if (!publicEditing) {
            setPublicEditingModalShown(true)
        }
    }

    const toggleIsViewingPublic = () => {
        setPublicViewing(!publicViewing)
    }


    const PublicEditingModal = () => (
        <>
            <Modal show={publicEditingModalShown} onHide={PublicEditingModalCancel} centered>
                <Modal.Header>
                    <Modal.Title>Public Editing</Modal.Title>
                </Modal.Header>

                <Modal.Body className='p-4'>
                    Please note that one factor authentication is required. 
                    In order to edit this page from an unauthorized computer, 
                    you will have to enter a code that will be sent to you via SMS or email
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="light" onClick={PublicEditingModalCancel}>
                        Cancel
                    </Button>
                    <Button variant="dark" onClick={() => setPublicEditingModalShown(false)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )

    return (
        <>
            {message && <Message variant='danger'>{message}</Message>}
            <LinkContainer to={`/${match.params.userName}`}>
                <Button variant='light' className='p-0'>
                    <Card className="p-3">
                        <i className='fas fa-arrow-left'></i>
                    </Card>
                </Button>
            </LinkContainer>
            <Card className="p-3">
                <Card.Title>
                    Create a new page:
                </Card.Title>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>page name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter name" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            required
                        />
                    </Form.Group>
                
                    <Form.Group className="mb-3">
                        <Form.Label>page text</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter text" 
                            value={text}
                            onChange={e => setText(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control 
                            type="file" 
                            onChange={e => setFile(e.target.files[0])}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Is viewing Public?</Form.Label>
                        <Switch checked={publicViewing} onChange={toggleIsViewingPublic} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Is Editing Public?</Form.Label>
                        <Switch checked={publicEditing} onChange={toggleIsEditingPublic} />
                    </Form.Group>

                    <LinkContainer to={`/${match.params.userName}`} disabled={!name || name.length < 1}>
                        <Button variant="outline-dark" type="submit" onClick={submitHandler}>
                            create!
                        </Button>
                    </LinkContainer>
                </Form>
            </Card>
            <PublicEditingModal />
        </>
    )
}

export default NewPageScreen
