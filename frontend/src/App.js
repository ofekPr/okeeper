import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import HomeScreen from './screens/HomeScreen'
import PagesScreen from './screens/PagesScreen'
import NewPageScreen from './screens/NewPageScreen'
import PageScreen from './screens/PageScreen'
import ProfileScreen from './screens/ProfileScreen'

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/' component={HomeScreen} exact/>
          <Route path='/:userName' component={PagesScreen} exact/>
          <Route path='/:userName/new-page' component={NewPageScreen}/>
          <Route path='/:userName/page/:id' component={PageScreen}/>
          <Route path='/:userName/profile' component={ProfileScreen}/>
        </Container>
      </main>
    </Router>
  )
}

export default App
