import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/auth/LoginPage.vue'
import SignUp from '../views/auth/SignUp.vue'
import Home from '../views/HomePage.vue'
import NotFound from '../views/NotFound.vue'
import Predictions from '../views/UserPredictions.vue'
import Summary from '../views/SummaryTable.vue'
import Results from '../views/GameResults.vue'
import { useUserStore } from '../stores/userStore'
import { useAuthStore } from '../stores/authStore'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: SignUp,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/predictions',
    name: 'predictions',
    component: Predictions,
  },
  {
    path: '/summary',
    name: 'summary',
    component: Summary,
  },
  {
    path: '/results',
    name: 'results',
    component: Results,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      if (authStore.user?.role === 'admin') {
        next()
      } else {
        next({ name: '/home' })
      }
    },
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
]

// Izveidojiet Vue Router
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Add a global navigation guard to protect routes
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // Pārbaude, ja lapa nav login vai register
  if (to.name !== 'login' && to.name !== 'register') {
    try {
      // Pārbaudām, vai autentifikācija ir veiksmīga, iegūstot lietotāja datus
      const userFetched = await userStore.retrieveUserData()

      // Ja lietotājs ir veiksmīgi iegūts, pāriet uz galamērķi
      if (userFetched) {
        next()
      } else {
        // Ja neizdodas iegūt lietotāju, atgriezt uz login lapu
        next({ name: 'login' })
      }
    } catch (error) {
      console.error('Error during user fetch:', error)
      // Ja kļūda, pāriet uz login
      next({ name: 'login' })
    }
  } else {
    // Ja autentifikācija ir veiksmīga, ļauj piekļūt lapai
    next()
  }
})

export default router
