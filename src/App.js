import React, { Fragment } from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
// import axios from 'axios';
// import { useQuery } from '@tanstack/react-query';

function App() {

  // useEffect(() => {
  //   fetchApi();
  // }, []);

  // let fetchApi = async () => {
  //   let res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-product`);
  //   return res.data;
  // };

  // const query = useQuery({ queryKey: ['todos'], queryFn: fetchApi })
  // console.log("query: ", query);

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