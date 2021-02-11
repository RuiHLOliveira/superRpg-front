import EventBus from "./../app/EventBus.js";
import config from "./../app/config.js";
import request from "./../app/request.js";
import notify from "./../app/notify.js";

export default {
    data: function () {
      return {
            email: '',
            password: '',
            notice: '',
            noticeType: '',
            busy: true,
        }
    },
    created () {
        this.busy =  false;
    },
    methods: {
        route(name){
            EventBus.$emit('route',name);
        },
        login(){

            // const exception = (error) => {
            //     console.error(error);
            //     this.busy = false;
            //     notify.notify('Your request failed. Please try again in a few seconds.', 'error');
            // };

            this.busy = true;

            const failFunction = (response, json) => {
                this.busy = false;
                EventBus.$emit('HANDLE_REQUEST_ERROR', {response, json});
            };

            let requestData = {};
            const headers = new Headers();
            requestData['url'] = config.serverUrl + "/auth/login";
            requestData['method'] = "POST";
            requestData['headers'] = headers;
            requestData['data'] = {
                'email': this.email,
                'password': this.password
            };

            request.fetch(requestData)
            .then(([response,json]) => {
                this.busy = false;
                window.localStorage.sRegisterToken = json.token;
                window.localStorage.sRegisterRefreshToken = json.refresh_token;
                notify.notify(json.message,'success');
                EventBus.$emit('route','Home');
            })
            .catch((error) => {
                console.error(error);
                this.busy = false;
                notify.notify(error,'error');
                // EventBus.$emit('HANDLE_REQUEST_ERROR', {response, json});
            });
        },
    },
    template: `
    <div class="flexWrapper">

        <!--<application-menu></application-menu>-->

        <div class="mainContainer">
            <div>
                <span>
                    <i class="fas fa-2x fa-dice"></i>
                    <br>Super RPG
                </span>
            </div>

            <form @submit.prevent="login">
                <h1 class="h3 mb-3 font-weight-normal">Login</h1>

                <label for="inputEmail">Email</label>
                <input 
                    :disabled="busy"
                    v-model="email"
                    class="form-control"
                    type="email" name="email" id="inputEmail"
                    required autofocus
                >

                <label class="mt-3" for="inputPassword">Password</label>
                <input 
                    :disabled="busy"
                    v-model="password" 
                    class="form-control mb-3"
                    type="password" name="password" id="inputPassword"
                    required
                >

                <button 
                    type="submit"
                    :disabled="busy"
                    class="mb-3 btn btn-primary"
                    style="width:100%">
                    <i class="fas fa-user-check"></i>
                    Login
                </button>

                <div class="mb-3 text-center">or</div>

                <button 
                    type="button"
                    @click="route('Register')"
                    :disabled="busy"
                    class="mb-3 btn btn-primary"
                    style="width:100%">
                    <i class="fas fa-user-plus"></i>
                    Register yourself
                </button>

                <!-- <button @click="route('Login')">
                    <i class="fas fa-user-check"></i>
                    Login
                </button> -->

                <div class="loader" v-if="busy"></div>
                <notice-box></notice-box>

            </form>
        </div>
    </div>
    `
};