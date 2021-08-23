import React, { useState, useEffect } from 'react'
import { Card, Form, Button, Modal } from 'react-bootstrap'
import ReactCodeInput from 'react-code-input'
import { Switch, FilePicker } from 'evergreen-ui'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listPageDetails, deletePage, updatePage, sendAuthEmail } from '../actions/pageActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import bcrypt from 'bcryptjs'

const EditPageScreen = ({ match, history }) => {
    const dispatch = useDispatch()

    const pageDetails = useSelector(state => state.pageDetails)
    const { loading, error, page } = pageDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userSendEmail = useSelector(state => state.userSendEmail)
    const { hashedCode } = userSendEmail

    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(page ? page.name : '')
    const [text, setText] = useState(page ? page.text : '')
    const [file, setFile] = useState(page ? page.file : [])
    const [publicViewing, setPublicViewing] = useState(page ? page.publicViewing : false)
    const [publicEditing, setPublicEditing] = useState(page ? page.publicEditing : false)
    const [isOneFactorAuthReqForViewing, setIsOneFactorAuthReqForViewing] = useState(false)
    const [publicEditingModalShown, setPublicEditingModalShown] = useState(false)
    const [emailModalShown, setEmailModalShown] = useState(false)

    useEffect(() => {
        dispatch(listPageDetails(match.params.userName, match.params.id))
    }, [match, dispatch, isEditing, userInfo])

    useEffect(() => {
        setName(page.name)
        page.text ? setText(page.text) : setText('')
        page.file ? setFile(page.file) : setFile([])
        setPublicViewing(page.publicViewing)
        setPublicEditing(page.publicEditing)
        setIsOneFactorAuthReqForViewing(page.isOneFactorAuthReqForViewing)
    }, [page])

    const submitHandler = async (name, text, file, publicViewing, publicEditing, isOneFactorAuthReqForViewing) => {
        const newPage = {_id: page._id, name, text, file, publicViewing, publicEditing, isOneFactorAuthReqForViewing}

        await dispatch(updatePage(match.params.userName, newPage))

        setIsEditing(false)
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

    const deleteHandler = async () => {
        await dispatch(deletePage(match.params.userName, page))

        history.push(`/${match.params.userName}`)
    }

    const PublicEditingModal = () =>  (
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
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
    )
    
    const toggleIsEditing = () => {
        if(userInfo && match.params.userName === userInfo.userName) {
            setIsEditing(!isEditing)
        } else if(publicEditing) {
            dispatch(sendAuthEmail(match.params.userName, page._id))
            setEmailModalShown(true)
        }
    }

    const emailModalSubmitHandler = (code) => {
        code = code.substring(0, 3) + '-' + code.substring(3)
        bcrypt.compare(code, hashedCode).then((result) => {
            if (result) {
                setEmailModalShown(false)
                setIsEditing(true)
            }
        });
    }

    const EmailModal = () => {
        const [code, setCode] = useState('')
        return (
        <>
            <Modal show={emailModalShown} onHide={() => setEmailModalShown(false)} centered>
                <Modal.Header>
                    <Modal.Title>Email Sent!</Modal.Title>
                </Modal.Header>

                <Modal.Body className='p-4'>
                    <h2>Check your inbox for the email!
                    Enter the code here:</h2>
                    <ReactCodeInput type='number' fields={6} value={code} onChange={e => setCode(e)} ></ReactCodeInput>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="light" onClick={() => setEmailModalShown(false)}>
                        Cancel
                    </Button>
                    <Button variant="dark" onClick={() => emailModalSubmitHandler(code)}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )}
    
    return (
        <>
            {loading || !page || page._id !== match.params.id ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : isEditing && (page.publicEditing || (userInfo && userInfo.userName === match.params.userName)) ? (
                <Card className="p-4" style={{
                    display: 'grid',
                    gridTemplateColumns: `
                        24%
                        24% 
                        24%
                        24%
                    `,
                    gridTemplateAreas:`
                        'return title title edit'
                        'name name name name'
                        'text text text text'
                        'file file file file'
                        'viewing viewing editing editing'
                        '. . . .'
                        'submit submit submit submit'
                        'delete delete delete delete'
                    `,
                    columnGap: '10px',
                    rowGap: '10px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'stretch',
                }}>
                    <LinkContainer to={`/${match.params.userName}`} style={{gridArea: 'return'}}>
                        <Button variant='light' className='p-0'>
                            <Card className="p-3">
                                <i className='fas fa-arrow-left'></i>
                            </Card>
                        </Button>
                    </LinkContainer>
                    <Card.Title style={{gridArea: 'title', textAlign: 'center'}}>
                        Edit a page: 
                    </Card.Title>
                    <Form.Group className="mb-3" style={{gridArea: 'name'}}>
                        <Form.Label>Enter Name: </Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter name" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" style={{gridArea: 'text'}} key='text'>
                        <Form.Label>page text</Form.Label>
                        <Form.Control 
                            type="text"
                            as={'textarea'}
                            placeholder="Enter text" 
                            value={text}
                            onChange={e => setText(e.target.value)}
                            style={{resize: 'none', height: '100px'}}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" style={{gridArea: 'file'}}>
                        <FilePicker     
                            multiple
                            value={file} 
                            onChange={e => setFile(e)}
                            placeholder='Select the file to upload:'
                            height={40}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" style={{gridArea: 'viewing'}}>
                        <Form.Label>Is viewing Public?</Form.Label>
                        <Switch checked={publicViewing} onChange={toggleIsViewingPublic} />
                    </Form.Group> 
                    {/* {publicViewing &&
                        <Form.Group className="mb-3" style={{gridArea: 'factorAuth'}}>
                            <Form.Label>
                                Is one factor authentication required for viewing this page?
                                <OverlayTrigger overlay={
                                    <Tooltip>
                                        In order to view the note from an unauthorized computer you will have to enter a code that will be sent to you via SMS or email.
                                    </Tooltip>
                                }>
                                    <i class="far fa-question-circle mx-1"></i>
                                </OverlayTrigger>
                            </Form.Label>
                            <Switch checked={isOneFactorAuthReqForViewing} onChange={() => setIsOneFactorAuthReqForViewing(!isOneFactorAuthReqForViewing)} />
                        </Form.Group>
                    } */}
                    {publicViewing && 
                        <Form.Group className="mb-3" style={{gridArea: 'editing'}}>
                            <Form.Label>Is Editing Public?</Form.Label>
                            <Switch checked={publicEditing} onChange={toggleIsEditingPublic} />
                        </Form.Group>
                    }
                    <Button variant="outline-success" type="submit" onClick={toggleIsEditing} className='p-2' style={{gridArea: 'edit'}}>
                        <i className="fas fa-edit"></i>
                    </Button>
                    <Button variant="outline-danger" onClick={deleteHandler} style={{gridArea: 'delete'}} disabled={!(publicEditing || userInfo)}>
                        <i className="fas fa-trash-alt"></i>
                    </Button>
                    <LinkContainer to={`/${match.params.userName}`} disabled={!name || name.length < 1} style={{gridArea: 'submit'}}>
                        <Button variant="outline-dark" type="submit" onClick={e => {
                            e.preventDefault()

                            submitHandler(name, text, file, publicViewing, publicEditing, isOneFactorAuthReqForViewing)
                        }}>
                            Update!
                        </Button>
                    </LinkContainer>
                </Card>
            ) : (
                <Card className="p-4" style={{
                    display: 'grid',
                    gridTemplateColumns: `
                        24%
                        24% 
                        24%
                        24%
                    `,
                    gridTemplateAreas:`
                        'return name name edit'
                        'text text text text'
                        'file file file file'
                    `,
                    columnGap: '10px',
                    rowGap: '10px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'stretch',
                }}>
                    <Card.Title style={{gridArea: 'name', textAlign: 'center'}}>
                        {name}
                    </Card.Title>
                    <LinkContainer to={`/${match.params.userName}`} style={{gridArea: 'return'}}>
                        <Button variant='light' className='p-0'>
                            <Card className="p-3">
                                <i className='fas fa-arrow-left'></i>
                            </Card>
                        </Button>
                    </LinkContainer>
                    <Form.Label style={{gridArea: 'text'}}>{text}</Form.Label>
                    {file.name && (
                        <Card.Text key={file.loc} style={{gridArea: 'file'}}  className='m-0'>
                            <a href={file.loc}  target="_blank" rel="noopener noreferrer">
                                <Button variant="outline-dark">
                                    {file.name}
                                </Button>
                            </a>
                        </Card.Text>
                    )}
                    <Button variant="outline-success" type="submit" onClick={toggleIsEditing} className='p-2' disabled={!(publicEditing || (userInfo && userInfo.userName === match.params.userName))} style={{gridArea: 'edit'}}>
                        <i className="fas fa-edit"></i>
                    </Button>
                    {/* <Button variant="outline-danger" onClick={deleteHandler} style={{gridArea: 'delete'}} disabled={!(publicEditing || (userInfo && userInfo.userName == match.params.userName))}>
                        <i className="fas fa-trash-alt"></i>
                    </Button> */}
                    {/* <LinkContainer to={`/${match.params.userName}`} disabled={!name || name.length < 1} style={{gridArea: 'submit'}} disabled>
                        <Button variant="outline-dark" type="submit" onClick={submitHandler}>
                            Update!
                        </Button>
                    </LinkContainer> */}
                </Card>
            )}
            <PublicEditingModal />
            <EmailModal />
        </>
    )
}

export default EditPageScreen

