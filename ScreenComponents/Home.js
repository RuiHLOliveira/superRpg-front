export default {
    data: function () {
      return {
            userName: 'man'
        }
    },
    computed: {
    },
    methods: {
    },
    template: `
    <div class="flexWrapper">
        <application-menu v-on:action="$emit('action',$event)"></application-menu>
        <div class="mainContainer">
            <menu-toggle-button></menu-toggle-button>
            Welcome, {{userName}}
        </div>
    </div>
    `
};