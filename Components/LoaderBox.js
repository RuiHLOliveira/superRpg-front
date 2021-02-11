

// import EventBus from "./../app/EventBus.js";
export default {
    data: function () {
        return {
        }
    },
    props: ['busy'],
    computed: {
    },
    created () {
        // EventBus.$on('notice', (data) => {
        //     notify.notify(data.notice, data.noticeType, data.time);
        // });
    },
    methods: {
    },
    template: `
    <div class="loader" v-if="busy"></div>
    `
};