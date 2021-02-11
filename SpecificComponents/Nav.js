import EventBus from "./../app/EventBus.js";
export default {
    data: function () {
      return {
            userName: "guy",
            menuActive: false
        }
    },
    computed: {
        userGuest () {
            if(window.localStorage.sRegisterToken === '' ||
            window.localStorage.sRegisterToken === undefined){
                return true;
            }
            return false;
        },
        userAuth () {
            return !this.userGuest;
        }
    },
    methods: {
        route(name){
            EventBus.$emit('route',name);
        },
        action(name){
            EventBus.$emit('action',name)
        },
        toggleMenu(){
            this.menuActive = !this.menuActive;
        }
    },
    created () {
        EventBus.$on('toggleMenu',(data) => {
            this.toggleMenu();
        });
    },
    template: `
    <nav id="sidebar" v-if="menuActive">
        <menu-toggle-button isInnerToggle="true"></menu-toggle-button>
        <div class="sidebar-header">
            <span>
                <i class="fas fa-2x fa-dice"></i>
                <br>Super RPG
            </span>
        </div>

        <div v-if="userAuth" class="sidebarUserWelcome">
            <span>Hey, {{userName}}!</span>
        </div>
        
        <ul id="nav-menu">
            <li v-if="userGuest">
                <button @click="route('Login')">
                    <i class="fas fa-user-check"></i>
                    Login
                </button>
            </li>
            <li v-if="userGuest">
                <button @click="route('Register')">
                    <i class="fas fa-user-plus"></i>
                    Register
                </button>
            </li>
            <li v-if="userAuth">
                <button @click="action('logout')">
                    <i class="fas fa-user-times"></i>
                    Logout
                </button>
            </li>
            <li v-if="userAuth">
                <button @click="route('Home')">
                    <i class="fas fa-home"></i>
                    Home
                </button>
            </li>
            <li v-if="userAuth">
                <button @click="route('InboxIndex')">
                    <i class="fas fa-plus"></i>
                    Inbox
                </button>
            </li>
            <li v-if="userAuth">
                <button @click="route('ProjectsIndex')">
                    <i class="fas fa-plus"></i>
                    Projects
                </button>
            </li>
            <li v-if="userAuth">
                <button @click="route('SituationsIndex')">
                    <i class="fas fa-align-justify"></i>
                    Situations
                </button>
            </li>
            <li v-if="userAuth">
                <button @click="route('InvitationsIndex')">
                    <i class="fas fa-envelope-open-text"></i>
                    Invitations
                </button>
            </li>
        </ul>
    </nav>
    `
};