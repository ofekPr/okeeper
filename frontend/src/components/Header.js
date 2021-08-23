import React, { useState } from 'react'
import { Navbar, Nav, Container, Form, Button, FormControl, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../actions/userActions'

const Header = () => {
    const dispatch = useDispatch()

    const [searchInput, setSearchInput] = useState('')

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const logoutHandler = () => {
        dispatch(logout())
    }

    const searchhandler = (e) => {
        e.preventDefault()
        window.location.href = `/${searchInput}`
    }

    return (
        <header>
            <Navbar bg="light" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                            <Navbar.Brand >oKeeper</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav className="ml-auto">
                            {userInfo ? (
                                <NavDropdown title={userInfo.userName.toUpperCase()} id='userName'>
                                    <LinkContainer to={`/${userInfo.userName}`}>
                                        <NavDropdown.Item>Pages</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to={`/${userInfo.userName}/profile`}>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to='/'>
                                    <Nav.Link><i className='fas fa-user'></i> Sign In</Nav.Link>
                                </LinkContainer>
                            )}
                            <Nav.Item className='mx-3'>
                                <Form className="d-flex" onSubmit={e => searchhandler(e)}>
                                    <FormControl
                                    type="search"
                                    placeholder="Search a user..."
                                    className="mr-2"
                                    aria-label="Search"
                                    value={searchInput}
                                    onChange={e => setSearchInput(e.target.value.toLowerCase())}
                                    />
                                    <LinkContainer to={`/${searchInput}`}>
                                        <Button variant="outline-dark" className='mx-1'>Search</Button>
                                    </LinkContainer>
                                </Form>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
