import React, { Fragment } from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'

function App() {
  return (
    <div>
      <Router>
        <Routes>
          { routes.map((route) => {
            const PageName = route.page
            const Layout = route.isShowHeader ? DefaultComponent : Fragment
            return (
              <Route key={ route.path } path={ route.path } element={
                <Layout>
                  <PageName/>
                </Layout>
              } />
            )
          })}
        </Routes>
      </Router>
    </div>
  )
}

export default App