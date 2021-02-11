
import Login from "./../ScreenComponents/Login.js";
import Register from "./../ScreenComponents/Register.js";
import Home from "./../ScreenComponents/Home.js";
import InboxIndex from "./../ScreenComponents/Inbox/Index.js";
import ProjectsIndex from "./../ScreenComponents/Projects/Index.js";

const page = '?page=';
const NotFound = { template: '<p>404 Page not found</p>' };
const HomeScreenComponent = {
    route: `/${page}home`,
    hash: '#Home',
    name: 'Home',
    component: Home
};

export default {
    'screenComponents': [
        {
            route: '',
            hash: '#Login',
            name: 'Login',
            component: Login
        },
        {
            route: '/',
            hash: '#Login',
            name: 'Login',
            component: Login
        },
        {
            route: '',
            hash: '#Register',
            name: 'Register',
            component: Register
        },
        {
            route: `/${page}home`,
            hash: '#Home',
            name: 'Home',
            component: Home
        },
        {
            route: `/${page}inboxIndex`,
            hash: '#InboxIndex',
            name: 'InboxIndex',
            component: InboxIndex
        },
        {
            route: `/${page}projectsIndex`,
            hash: '#ProjectsIndex',
            name: 'ProjectsIndex',
            component: ProjectsIndex
        },
        HomeScreenComponent
    ],
    'NotFoundScreenComponent': {
        route: undefined,
        hash: '',
        name: 'NotFound',
        component: NotFound
    },
    'HomeScreenComponent': HomeScreenComponent 
};