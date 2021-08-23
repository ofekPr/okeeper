import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Button, Card } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Page from '../components/Page'
import { listPages } from '../actions/pageActions'

const PagesScreen = ({ match, history }) => {
    const dispatch = useDispatch()

    const pageList = useSelector(state => state.pageList)
    const { loading, error, pages } = pageList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        dispatch(listPages(match.params.userName))
    }, [dispatch, userInfo, match])

    const NewPageButton = () => {
        return (
            <>
                <Card className='my-3 p-0 rounded'>
                    <LinkContainer to={`/${match.params.userName}/new-page`}><Button variant='light' type="submit" size='lg'><i className='fas fa-plus'></i></Button></LinkContainer>
                </Card>
            </>
        )
    }

    return (
        <>
            {loading ? (
                <Loader />
            ) : error === 'User not found' ? (
                <Message variant='danger'>
                    User not found <Link to='/'>Home</Link>
                </Message>
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <>
                    <h1>{match.params.userName.toUpperCase()}'s pages:</h1>
                    {pages.length > 0 ? 
                        <>
                            <Row>
                                {pages.map(page => (
                                    <Col sm={12} md={6} lg={4} xl={3} key={page.name}>
                                        <Page page={page} userName={match.params.userName} history={history}/>
                                    </Col>
                                ))}
                            </Row>
                        </>
                    :
                        <Message variant="info">{`${match.params.userName} has no pages`}</Message>
                    }
                    {(userInfo && userInfo.userName === match.params.userName) && (
                        <Row>
                            <NewPageButton />
                        </Row>
                    )}
                </>
            )}
        </>
    )
}

export default PagesScreen
