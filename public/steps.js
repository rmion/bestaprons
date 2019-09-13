Vue.component('step-item', {
    props: ['step'],
    template: `
        <article>
            <div class="message-header">
                <p>{{step.heading}}</p>
            </div>
            <div class="message-body">
                {{step.steps}}
            </div>
        </article>
    `
})

let vm = new Vue({
    el: "#app",
    data: {
        meal: null,
        mealId: window.location.search.slice(window.location.search.indexOf('=') + 1)
    },
    mounted() {
        this.fetchSteps()
    },
    methods: {
        fetchSteps() {
            fetch(`/api/steps/${this.mealId}`)
                .then(response => response.json())
                .then(meal => { 
                    vm.meal = meal;
                })
        },
    },
})