import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Row, Col, Container, FormControl, Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { login, register } from '../actions/userActions'
import Message from '../components/Message'
import Loader from '../components/Loader'

const HomeScreen = ({ history }) => {
    const [hasAnAcount, setHasAnAcount] = useState(true)
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setValMessage] = useState(null)

    const setMessage = (message) => {
        setValMessage(message)
        setTimeout(() => {
            setValMessage(null)
        }, 5000);
    }

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const userRegister = useSelector(state => state.userRegister)

    const { loading, error, userInfo } = userRegister.userInfo ? userRegister : userLogin

    useEffect(() => {
        if(userInfo && userInfo.userName) {
            history.push(`/${userInfo.userName}`)
        }
    }, [history, userInfo])

    const submitLoginHandler = (e) => {
        e.preventDefault()

        setMessage(null)
        dispatch(login(email, password))
    }
    
    const submitRegisterHandler = (e) => {
        e.preventDefault()

        if (!userName) {
            setMessage('User Name is required')
        } else if (!email) {
            setMessage('Email is required')
        } else if (!password || !confirmPassword) {
            setMessage('Password is required')
        } else if (password !== confirmPassword) {
            setMessage('passwords do not match')
        } else {
            setMessage(null)
            dispatch(register(userName, email, password))
        }
    }

    return (
        <>
            <h1>Welcome to oKeeper!</h1>
            <p>The place to keep and share your stuff! notes, files, assays and more!</p>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form>
                <Form.Group>
                    <Form.Check 
                        type='checkbox'
                        label='Have an acount?'
                        checked={hasAnAcount}
                        onChange={() => setHasAnAcount(!hasAnAcount)}
                    />
                </Form.Group>
            </Form>
            <Card className='p-3 m-0 mt-3'>
                {hasAnAcount ?
                    <Form>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    as={FormControl}
                                />
                            </Form.Group>
                        
                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password" 
                                    placeholder="Enter password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                            </Form.Group>
                        </Row>
                        
                        <Row>
                            <Container>
                                <Button 
                                    variant="outline-dark" 
                                    type="submit"
                                    onClick={submitLoginHandler}
                                >
                                    Submit
                                </Button>
                            </Container>
                        </Row>
                    </Form>
                :
                    <Form>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridUserName">
                                <Form.Label>
                                    User Name: 
                                    <OverlayTrigger overlay={
                                        <Tooltip>
                                            After creating your user you will not be able to change your user name.
                                        </Tooltip>
                                    }>
                                        <i class="far fa-question-circle mx-1"></i>
                                    </OverlayTrigger>
                                </Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter user name:"
                                    onChange={(e) => setUserName(e.target.value.toLowerCase())}
                                    value={userName}
                                    as={FormControl}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    as={FormControl}
                                />
                            </Form.Group>
                        </Row>

                        
                        <Row className="mb-3">        
                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password" 
                                    placeholder="Enter password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Confirm Password:</Form.Label>
                                <Form.Control
                                    type="password" 
                                    placeholder="Confirm password"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                />
                            </Form.Group>
                        </Row>
                        
                        <Button 
                            variant="outline-dark" 
                            type="submit"
                            onClick={submitRegisterHandler}
                        >
                            Submit
                        </Button>
                    </Form>
                }
            </Card>
        </>
    )
}

export default HomeScreen