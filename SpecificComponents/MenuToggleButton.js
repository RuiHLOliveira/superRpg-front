import EventBus from "../app/EventBus.js";
export default {
    data: function () {
        return {
        }
    },
    props: ['isInnerToggle'],
    methods: {
        toggleMenu(){
            EventBus.$emit('toggleMenu','toggleMenu')
        }
    },
    template: `
        <button
            class="toggleMenu btn btn-transparent"
            :class="{ innerToggle : isInnerToggle }"
            @click="toggleMenu()">
            <i class="fas fa-bars" v-if="!isInnerToggle"></i>
            <i class="fas fa-times" v-if="isInnerToggle"></i>
        </button>
    `
};