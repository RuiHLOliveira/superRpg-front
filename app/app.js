import EventBus from "./EventBus.js";
import routing from "./routing.js";
import ApplicationMenu from './../SpecificComponents/Nav.js';
import MenuToggleButton from './../SpecificComponents/MenuToggleButton.js';
import noticeBox from "./../Components/NoticeBox.js";
import config from "./../../app/config.js";
import notify from "./notify.js";
import request from "./request.js";

Vue.component('application-menu', ApplicationMenu);
Vue.component('menu-toggle-button', MenuToggleButton);
Vue.component('notice-box', noticeBox);
Vue.directive('focus', {
    // Quando o elemento vinculado é inserido no DOM...
    inserted: function (el) {
      // Coloque o foco no elemento
      el.focus()
    }
});

const vm = new Vue({
    el: "#app",
    data: {
        currentScreenComponent: routing.NotFoundScreenComponent
    },
    computed: {
        ViewComponent () {
            return this.currentScreenComponent;
        }
    },
    methods: {
        runAction (actionName) {
            if(actionName == 'logout') {
                this.logout();
            } else {
                console.error('unsuported action: ', actionName);
            }
        },
        logout () {
            this.busy = true;
            //PREPARE REQUEST FOR LOGOUT
            const headers = new Headers();
            let requestData = {};
            headers.append("Authorization", window.localStorage.sRegiserToken);
            headers.append('Content-Type','application/json');
            requestData['url'] = config.serverUrl + "/auth/logout";
            requestData['method'] = "POST";
            requestData['headers'] = headers;
            requestData['data'] = {
                'refresh_token': window.localStorage.sRegisterRefreshToken,
                'token': window.localStorage.sRegisterToken
            };
            //RUN REQUEST FOR LOGOFF
            request.fetch(requestData)
            .then(([response,json]) => {
                this.busy = false;
                window.localStorage.sRegisterToken = '';
                window.localStorage.sRegisterRefreshToken = '';
                this.routeTo('Login');
            })
            .catch((error) => {
                this.busy = false;
                notify.notify(error,'error');
                window.localStorage.sRegisterToken = '';
                window.localStorage.sRegisterRefreshToken = '';
                this.routeTo('Login');
            });
        },
        findFullScreenComponentByHash(hash){
            let fullScreenComponent = routing.screenComponents.find( component => {
                return component.hash === hash
            });
            if(fullScreenComponent === undefined) fullScreenComponent = routing.NotFoundScreenComponent
            return fullScreenComponent;
        },
        findFullScreenComponent (screenComponentName) {
            let fullScreenComponent = routing.screenComponents.find( component => {
                return component.name === screenComponentName;
            });
            
            if(fullScreenComponent === undefined) fullScreenComponent = routing.NotFoundScreenComponent
            return fullScreenComponent;
        },
        isAuthenticated() {
            if(window.localStorage.sRegisterToken === '' ||
            window.localStorage.sRegisterToken === undefined){
                return false;
            }
            return true;
        },
        routeTo (screenComponentName){
            if(!this.isAuthenticated()) {
                screenComponentName = 'Login';
            }
            const fullScreenComponent = this.findFullScreenComponent(screenComponentName);
            this.currentScreenComponent = fullScreenComponent.component;
            // history.pushState({}, fullScreenComponent.name, fullScreenComponent.route);
            location.hash = fullScreenComponent.name;
        },
        defineStartScreen () {
            if(window.localStorage.sRegisterToken !== ''){
                let screenComponent = this.findFullScreenComponentByHash(location.hash);
                this.routeTo(screenComponent.name == 'NotFound' ? routing.GameListScreenComponent.name : screenComponent.name);
            } else {
                this.routeTo('Login');
            }
        },
    },
    created () {
        EventBus.$on('route',(data) => {
            this.routeTo(data);
        });
        EventBus.$on('action',(data) => {
            this.runAction(data);
        });
        this.defineStartScreen();
    },
    render: function (createElement) {
        return createElement(this.ViewComponent);
    }
});