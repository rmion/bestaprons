Vue.component('ingredient-item', {
    props: ['item'],
    template: `
        <tr>
            <td>{{item.qty}}</td>
            <td>{{item.name}}</td>
        </tr>
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
            fetch(`/api/ingredients/${this.mealId}`)
                .then(response => response.json())
                .then(meal => { 
                    vm.meal = meal;
                })
        },
    },
})