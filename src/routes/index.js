import HomePage from "../pages/HomePage/HomePage";
import CoursePage from "../pages/CoursePage/CoursePage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"
import CategoryProductPage from "../pages/CategoryProductPage/CategoryProductPage";
import SignInPage from "../pages/SignInPage/SignInPage"
import SignUpPage from "../pages/SignUpPage/SignUpPage"
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage"
import ProfilePage from "../pages/ProfilePage/ProfilePage"
import { AdminPage } from "../pages/AdminPage/AdminPage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true
    },
    {
        path: '/course',
        page: CoursePage,
        isShowHeader: true
    },
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true
    },
    {
        path: '/:category',
        page: CategoryProductPage,
        isShowHeader: true
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false
    },
    {
        path: '/product-details/:id',
        page: ProductDetailPage,
        isShowHeader: true
    },
    {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader: true
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true
    },
    {
        path: '*',
        page: NotFoundPage,
        isShowHeader: false
    },
]