import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import { isJsonString } from './utils';
import { jwtDecode } from 'jwt-decode';
import * as UserService from '../src/services/UserService';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from './redux/slice/userSlice';
import Loading from './components/LoadingComponent/Loading';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const { storageData, decoded } = handleDecoded();

    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
    setIsLoading(false);
  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token'); // Use let instead of const
    let decoded = {};

  if (storageData && isJsonString(storageData)) {
    storageData = JSON.parse(storageData);
    decoded = jwtDecode(storageData);
  }

  return { decoded, storageData };
  };

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

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  return (
    <div>
      <Loading isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const PageName = route.page;
              const isCheckAuth = !route.isPrivate || user.is_admin;
              const Layout = route.isShowHeader ? DefaultComponent : Fragment;
              return (
                <Route
                  key={route.path}
                  path={isCheckAuth ? route.path : ''}
                  element={
                    <Layout>
                      <PageName />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </Router>
      </Loading>
    </div>
  );
}

export default App;