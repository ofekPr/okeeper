import React, { useState, useEffect } from 'react'
import { Card, Form, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

const ProfileScreen = ({ match, history }) => {
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)
    const [successShown, setSuccessShown] = useState(false)

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    useEffect(() => {
        if (!userInfo) {
            history.push('/')
        } else {
            if (!user || !user.userName) {
                dispatch(getUserDetails(match.params.userName, 'profile'))
            } else {
                setUserName(user.userName)
                setEmail(user.email)
            }
        }
    }, [history, userInfo, dispatch, user, match])

    const submitHandler = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setMessage('passwords do not match')
        } else {
            setMessage(null)
            setPassword('')
            setConfirmPassword('')
            setSuccessShown(true)
            dispatch(updateUserProfile(userName, { id: user._id, userName, email, password}))
            setTimeout(() => {
                setSuccessShown(false)
            }, 3000)
        }
    }

    return (
        <>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {(success && successShown) && <Message variant='success'>Profile Updated!</Message>}
            {loading && <Loader />}
            <Card className="p-4" style={{
                display: 'grid',
                gridTemplateColumns: `
                    24%
                    24% 
                    24%
                    24%
                `,
                gridTemplateAreas:`
                    'return title title .'
                    'name name email email'
                    'password password conpassword conpassword'
                    '. . . .'
                    'submit submit submit submit'
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
                    User Profile
                </Card.Title>
                <Form.Group className="mb-3" style={{gridArea: 'name'}}>
                    <Form.Label>User Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter user name" 
                        value={userName} 
                        readOnly 
                    />
                </Form.Group>
            
                <Form.Group className="mb-3" style={{gridArea: 'email'}}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter text" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" style={{gridArea: 'password'}}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Enter password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </Form.Group>
                
                <Form.Group className="mb-3" style={{gridArea: 'conpassword'}}>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Confirm password" 
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>

                <LinkContainer to={`/${match.params.userName}`} style={{gridArea: 'submit'}}>
                    <Button variant="outline-dark" type="submit" onClick={submitHandler}>
                        Update!
                    </Button>
                </LinkContainer>
            </Card>
            {/* <Card className="p-3">
                <Card.Title>
                    User Profile
                </Card.Title>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>User Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter user name" 
                            value={userName} 
                            readOnly 
                        />
                    </Form.Group>
                
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter text" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Enter password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Confirm password" 
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>

                    <LinkContainer to={`/${match.params.userName}`}>
                        <Button variant="outline-dark" type="submit" onClick={submitHandler}>
                            Update!
                        </Button>
                    </LinkContainer>
                </Form>
            </Card> */}
        </>
    )
}

export default ProfileScreen

