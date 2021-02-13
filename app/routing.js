
import Login from "./../ScreenComponents/Login.js";
import Register from "./../ScreenComponents/Register.js";
import GameList from "./../ScreenComponents/Games/GameList.js";
import InboxIndex from "./../ScreenComponents/Inbox/Index.js";
import ProjectsIndex from "./../ScreenComponents/Projects/Index.js";

const page = '?page=';
const NotFound = { template: '<p>404 Page not found</p>' };
const GameListScreenComponent = {
    route: `/${page}GameList`,
    hash: '#GameList',
    name: 'GameList',
    component: GameList
};

export default {
    'screenComponents': [
        {
            route: '',
            hash: '#Login',
            name: 'Login',
            needAuthentication: false,
            component: Login
        },
        {
            route: '/',
            hash: '#Login',
            name: 'Login',
            needAuthentication: false,
            component: Login
        },
        {
            route: '',
            hash: '#Register',
            name: 'Register',
            needAuthentication: false,
            component: Register
        },
        {
            route: `/${page}GameList`,
            hash: '#GameList',
            name: 'GameList',
            needAuthentication: true,
            component: GameList
        },
        {
            route: `/${page}inboxIndex`,
            hash: '#InboxIndex',
            name: 'InboxIndex',
            needAuthentication: true,
            component: InboxIndex
        },
        {
            route: `/${page}projectsIndex`,
            hash: '#ProjectsIndex',
            name: 'ProjectsIndex',
            needAuthentication: true,
            component: ProjectsIndex
        },
        GameListScreenComponent
    ],
    'NotFoundScreenComponent': {
        route: undefined,
        hash: '',
        name: 'NotFound',
        needAuthentication: false,
        component: NotFound
    },
    'GameListScreenComponent': GameListScreenComponent 
};