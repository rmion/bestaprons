Vue.component('menu-item', {
    props: ['meal'],
    computed: {
        steps() {
            return "/steps.html?id=" + this.meal._id
        },
        ingredients() {
            return "/ingredients.html?id=" + this.meal._id
        }
    },
    template: `
        <div class="card block">
            <div class="card-content">
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                            <img :src="meal.photo" alt="Placeholder image">
                        </figure>
                    </div>        
                    <div class="media-content">
                        <p class="title is-4">{{meal.name}}</p>
                        <p class="subtitle is-6">{{meal.time.min}} - {{meal.time.max}} min.</p>
                    </div>
                </div>
            </div>
            <footer class="card-footer">
                <a :href="ingredients" class="card-footer-item">Ingredients</a>
                <a :href="steps" class="card-footer-item">Steps</a>
            </footer>    
        </div>  
    `
})

let vm = new Vue({
    el: "#app",
    data: {
        meals: null,
    },
    mounted() {
        this.fetchMenu()
    },
    methods: {
        fetchMenu() {
            fetch("/api/menu")
                .then(response => response.json())
                .then(meals => { 
                    vm.meals = meals;
                })
        },
    },
})