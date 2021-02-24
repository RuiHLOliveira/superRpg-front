import EventBus from "./../../app/EventBus.js";
import config from "./../../app/config.js";
import notify from "./../../app/notify.js";
import request from "./../../app/request.js";

export default {
    data: function () {
      return {
            busy: true,
            games: [],
        }
    },
    watch: {
    },
    computed: {
    },
    components: {
    },
    methods: {
        route(routeName){
            EventBus.$emit('route', routeName);
        },
        loadGames() {
            this.busy = true;
            const headers = new Headers();
            let requestData = {};
            requestData['url'] = config.serverUrl + "/gamesToSubscribe";
            requestData['headers'] = headers;
            request.fetch(requestData)
            .then(([response,json]) => {
                this.busy = false;
                let games = this.processLoadedGames(json.games)
                this.games = games;
                console.log(this.games);
            })
            .catch((error) => {
                this.busy = false;
                notify.notify(error,'error');
            });
        },
        processLoadedGames(games){
            games.forEach(game => {
                // Vue.set(game, 'showCharacterList', false);
                // Vue.set(game, 'showCreateCharacterForm', false);
            });
            return games;
        },
    },
    created () {
        this.loadGames();
    },



    template: /*jsx*/`
    <div class="flexWrapper">
        <link rel="stylesheet" href="/ScreenComponents/Games/gamelist.css">
        <!-- MENU -->
        <application-menu></application-menu>

        <div class="mainContainer">

            <!-- MENU TOGGLE BUTTON -->
            <menu-toggle-button></menu-toggle-button>
            <!-- notice box -->
            <notice-box></notice-box>


            <!-- TITLE -->
            <h1 class="">Subscribe to a Game</h1>

            <button @click="route('GameList')" class="mt-4 btn btn-success"> Back to Game List </button>

            <!-- BUSY LOADER -->
            <div class="loader mt-4" v-if="busy == true"></div>
            
            <div v-else>
                <div v-if="games.length == 0">Not so many games here! Create one!</div>
                <div class="mt-4" 
                    v-for="game in games"
                    :key="game.id"
                >
                    <div class="flex">
                        <div>
                            <label class="">Game</label>
                            <span class="gameTitle">{{game.name}}</span><br>
                            <span class="">{{game.description}}</span><br>
                            <span class="">Host: {{game.user.email}}</span>
                        </div>
                    </div>
                    <hr>

                </div>
            </div>
            
        </div>
    </div>
    `
};