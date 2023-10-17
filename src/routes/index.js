import HomePage from "../pages/HomePage/HomePage";
import CoursePage from "../pages/CoursePage/CoursePage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"
import CategoryProductPage from "../pages/CategoryProductPage/CategoryProductPage";

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
        path: '/category',
        page: CategoryProductPage,
        isShowHeader: true
    },
    {
        path: '*',
        page: NotFoundPage,
        isShowHeader: false
    },
]