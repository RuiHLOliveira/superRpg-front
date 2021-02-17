import EventBus from "./../../app/EventBus.js";
import config from "./../../app/config.js";
import notify from "./../../app/notify.js";
import request from "./../../app/request.js";

export default {
    data: function () {
      return {
            busy: true,
            games: [],
            characters: [],
            showCreateGameForm: false,
            showCreateCharacterForm: false,
            createForm_name: "",
            createForm_description: "",
            createCharacterForm_name: "",
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
                let games = this.processLoadedGames(json.games)
                games = this.loadGameCharacters(games)
                this.games = games;
            })
            .catch((error) => {
                this.busy = false;
                notify.notify(error,'error');
            });
        },
        processLoadedGames(games){
            games.forEach(game => {
                Vue.set(game, 'showCharacterList', false);
                Vue.set(game, 'showCreateCharacterForm', false);
            });
            return games;
        },
        loadGameCharacters(games){
            games.forEach((game) => {
                let filters = [
                    {'game': game.id}
                ];
                this.loadCharacters(filters)
                .then((characters) => {
                    game.characters = characters;
                })
            });
            return games;
        },
        loadCharacters(filters = []){
            this.busy = true;
            let querystring = '';
            if(filters.length > 0) {
                querystring = `?filters=`;
                filters = JSON.stringify(filters);
                querystring += `${filters}`;
            }
            const headers = new Headers();
            let requestData = {};
            requestData['url'] = config.serverUrl + "/characters" + querystring;
            requestData['headers'] = headers;
            return request.fetch(requestData)
            .then(([response,json]) => {
                this.busy = false;
                return json.characters;
            })
            .catch((error) => {
                this.busy = false;
                notify.notify(error,'error');
            });
        },
        toggleCreateGameForms(){
            this.showCreateGameForm = !this.showCreateGameForm;
        },
        toggleCharacterCreateForm(game){
            game.showCreateCharacterForm = !game.showCreateCharacterForm;
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
        createCharacter(game){
            this.busy = true;
            let requestData = {};
            const headers = new Headers();
            requestData['url'] = config.serverUrl + "/characters";
            requestData['method'] = "POST";
            requestData['headers'] = headers;
            requestData ['data'] = {
                'name': this.createCharacterForm_name,
                'game':game.id
            };
            request.fetch(requestData)
            .then( ([response, dados]) => {
                this.busy = false;
                notify.notify(`Character "${dados.character.name}" created!`,'success');
                this.loadGames();
            })
            .catch((error) => {
                console.log(error)
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
        <link rel="stylesheet" href="/ScreenComponents/Games/gamelist.css">
        <!-- MENU -->
        <application-menu></application-menu>

        <div class="mainContainer">

            <!-- MENU TOGGLE BUTTON -->
            <menu-toggle-button></menu-toggle-button>
            <!-- notice box -->
            <notice-box></notice-box>


            <!-- TITLE -->
            <h1 class="">Your Games</h1>

            <button @click="toggleCreateGameForms()" class="mt-4 btn btn-success"> Create game </button>
            <div v-if="showCreateGameForm == true">
                <input type="text" v-model="createForm_name" placeholder="name"/>
                <input type="text" v-model="createForm_description" placeholder="description"/>
                <button @click="toggleCreateGameForms()" class="mt-2 btn btn-secondary"> Close </button>
                <button @click="createGame()" class="mt-2 btn btn-success"> Create </button>
            </div>

            <!-- BUSY LOADER -->
            <div class="loader mt-4" v-if="busy == true"></div>
            
            <div v-else>
                <div v-if="games.length == 0">You havent subscribed to any game yet!</div>
                <div class="mt-4" 
                    v-for="game in games"
                    :key="game.id"
                >
                    <div class="flex">
                        <div>
                            <label class="">Game</label>
                            <span class="gameTitle">{{game.name}}</span><br>
                            <span class="">{{game.description}}</span>
                        </div>
                        <!--<div>
                            <button @click="toggleCharacterList(game)" class="mt-2 btn btn-sm btn-primary">Open</button>
                        </div>-->
                    </div>


                    <div class="pt-2 pb-3 px-3 characterList">
                        <div class="" v-if="characters.length > 0">Characters</div>
                        <div class="" v-if="characters.length == 0">You havent any character yet!</div>
                        <button
                            @click="toggleCharacterCreateForm(game)"
                            class="mt-2 btn btn-sm btn-primary"
                        >New Character</button>
                        <div v-if="game.showCreateCharacterForm == true">
                            <input type="text" v-model="createCharacterForm_name" placeholder="name"/>
                            <button @click="toggleCharacterCreateForm(game)" class="mt-2 btn btn-secondary"> Close </button>
                            <button @click="createCharacter(game)" class="mt-2 btn btn-success"> Create </button>
                        </div>

                        <div class="mt-2" v-for="character in game.characters"
                            :key="game.id"
                        >
                            {{character.name}}
                        </div>

                    </div>

                </div>
            </div>
            
        </div>
    </div>
    `
};