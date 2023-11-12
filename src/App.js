import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { isJsonString } from './utils';
import { jwtDecode } from 'jwt-decode';
import * as UserService from '../src/services/UserService'
import { useDispatch } from 'react-redux'
import { updateUser } from './redux/slice/userSlice';

function App() {
  let dispatch = useDispatch();

  useEffect(() => {
    let {storageData, decoded} = handleDecoded();

    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData)
    }
  }, []);

  let handleDecoded = () => {
    let storageData = localStorage.getItem('access_token');
    let decoded = {}

    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }

    return { decoded, storageData };
  }
  // Add a request interceptor
  UserService.axiosJWT.interceptors.request.use(async function (config) {
    let { decoded} = handleDecoded();
    let currentTime = new Date();

    if (decoded?.exp < currentTime.getTime() / 1000) {
      let data = await UserService.refreshToken();
      config.headers['token'] = `Bearer ${data?.access_token}`;
    }

    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  let handleGetDetailsUser = async (id, token) => {
    let res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  }

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