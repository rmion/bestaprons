Vue.component('meal-filter', {
    props: ['ingredient'],
    template: `
        <button @click="$emit('change-selected-ingredient', ingredient)">
            {{ ingredient }}
        </button>
    `,
})
Vue.component('meal-item', {
    props: ['meal'],
    computed: {
        details() {
            return "/details.html?id=" + this.meal._id
        }
    },
    template: `
        <div class="card block">
            <div class="card-image">
                <figure class="image is-4by4">
                    <img :src="meal.photo" alt="Photo of meal">
                </figure>
            </div>
            <div class="card-content">
                <div class="media">
                    <div class="media-content">
                        <p class="title is-4">{{meal.name}}</p>
                        <p class="subtitle is-6">with {{meal.sides}}</p>
                        <p class="subtitle is-5">{{meal.calories}} cals; {{meal.fat}}g</p>
                    </div>
                </div>
                <div class="content">
                    {{meal.time.min}} - {{meal.time.max}} min.
                </div>
            </div>
            <footer class="card-footer">
                <a :href="details" class="card-footer-item">Recipe</a>
                <button @click="$emit('add-to-menu', meal._id)" class="card-footer-item">Add</button>
            </footer>    
        </div>  
    `
})
Vue.component('menu-item', {
    props: ['meal'],
    computed: {
        details() {
            return "/details.html?id=" + this.meal._id
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
                        <p class="subtitle is-5">{{meal.calories}} cals; {{meal.fat}}g</p>
                        <p class="subtitle is-6">{{meal.time.min}} - {{meal.time.max}} min.</p>
                    </div>
                </div>
            </div>
            <footer class="card-footer">
                <a :href="details" class="card-footer-item">Recipe and instructions</a>
            </footer>    
        </div>  
    `
})

let vm = new Vue({
    el: "#app",
    data: {
        meals: null,
        filteredMeals: [],
        menu: [],
        selectedIngredient: null,
        mainIngredients: [
            "beef",
            "chicken",
            "fish",
            "pork",
            "turkey",
            "vegetarian"
        ],
        didSave: null
    },
    mounted() {
        this.fetchMeals()
    },
    methods: {
        fetchMeals() {
            fetch('/api/meals')
                .then(response => response.json())
                .then(meals => { 
                    vm.meals = meals;
                    vm.filteredMeals = meals;
                })
        },
        filterByMainIngredient() {
            this.filteredMeals = this.meals.filter(meal => meal.main_ingredient === this.selectedIngredient)
        },
        changeSelectedIngredient(ingredient) {
            this.selectedIngredient = ingredient;
            this.filterByMainIngredient()
        },
        addToMenu(id) {
            this.menu.push(id)
        },
        saveMenuToDB() {
            this.didSave = 0;
            fetch('/api/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "meals": this.menu
                })
            })
            .then(response => response.json())
            .then(doc => {
                vm.didSave = doc.result.ok
            })
        }
    },
})