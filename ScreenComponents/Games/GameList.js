import EventBus from "./../../app/EventBus.js";
import config from "./../../app/config.js";
import notify from "./../../app/notify.js";
import request from "./../../app/request.js";

export default {
    data: function () {
      return {
            busy: true,
            games: [],
            showCreateGameForm: false,
            createForm_name: "",
            createForm_description: "",
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
            requestData['url'] = config.serverUrl + "/games";
            requestData['headers'] = headers;
            request.fetch(requestData)
            .then(([response,json]) => {
                this.busy = false;
                this.games = json.games;
            })
            .catch((error) => {
                this.busy = false;
                notify.notify(error,'error');
            });
        }, 
        toggleCreateGameForms(){
            this.showCreateGameForm = !this.showCreateGameForm;
        },
        createGame(){
            this.busy = true;

            let requestData = {};
            const headers = new Headers();
            requestData['url'] = config.serverUrl + "/games";
            requestData['method'] = "POST";
            requestData['headers'] = headers;
            requestData ['data'] = {
                'name': this.createForm_name,
                'description' : this.createForm_description
            };

            request.fetch(requestData)
            .then( ([response, dados]) => {
                this.busy = false;
                notify.notify(dados.message,'success');
                this.loadGames();
            })
            .catch((error) => {
                this.busy = false;
                notify.notify(error,'error');
            });

        },
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

            <button @click="toggleCreateGameForms()" class="mt-2 btn btn-success"> Create game </button>
            <div v-if="showCreateGameForm == true">
                <input type="text" v-model="createForm_name" placeholder="name"/>
                <input type="text" v-model="createForm_description" placeholder="description"/>
                <button @click="toggleCreateGameForms()" class="mt-2 btn btn-secondary"> Close </button>
                <button @click="createGame()" class="mt-2 btn btn-success"> Create </button>

            </div>

            <!-- BUSY LOADER -->
            <div class="loader" v-if="busy == true"></div>
            
            <div v-else>
                <div class="" 
                    v-for="game in games" :key="game.id"
                >
                    <label class="">Game:</label>
                    <span class="">{{game.name}}</span>
                    <button @click="" class="mt-2 btn btn-primary">Open</button>
                </div>
                <div v-if="games.length == 0">You havent subscribed to any game yet!</div>
            </div>
            
        </div>
    </div>
    `
};