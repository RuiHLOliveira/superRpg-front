import EventBus from "../../app/EventBus.js";
import config from "../../app/config.js";
import notify from "../../app/notify.js";
import request from "../../app/request.js";

export default {
    data: function () {
      return {
            busy: true,
            characters: [],
        }
    },
    watch: {
    },
    computed: {
    },
    components: {
    },
    methods: {
        loadGames() {
            this.busy = true;
            const headers = new Headers();
            let requestData = {};
            requestData['url'] = config.serverUrl + "/characters";
            requestData['headers'] = headers;
            request.fetch(requestData)
            .then(([response,json]) => {
                this.busy = false;
                this.characters = json.characters;
            })
            .catch((error) => {
                this.busy = false;
                notify.notify(error,'error');
            });
        }
    },
    created () {
        this.loadGames();
    },



    template: /*jsx*/`
    <div class="flexWrapper">

        <!-- MENU -->
        <application-menu v-on:action="$emit('action',$event)"></application-menu>

        <div class="mainContainer">

            <!-- MENU TOGGLE BUTTON -->
            <menu-toggle-button></menu-toggle-button>
            <!-- notice box -->
            <notice-box></notice-box>


            <!-- TITLE -->
            <h1 class="">Your Games</h1>

            <!-- BUSY LOADER -->
            <div class="loader" v-if="busy == true"></div>

            <div v-else>
                <div class="" 
                    v-for="character in characters" :key="character.id"
                >
                    <div>
                        <label class="">Name</label>
                        <div class="">{{character.name}}</div>
                    </div>

                    <button 
                        @click=""
                        class="mt-2 btn btn-primary"
                    >Enter</button>
                </div>
                <div v-if="characters.length == 0">You dont have any character!</div>
            </div>
        </div>
    </div>
    `
};