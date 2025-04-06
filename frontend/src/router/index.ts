import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/auth/LoginPage.vue'
import SignUp from '../views/auth/SignUp.vue'
import Home from '../views/HomePage.vue'
import NotFound from '../views/NotFound.vue'
import Predictions from '../views/UserPredictions.vue'
import Summary from '../views/SummaryTable.vue'
import Results from '../views/GameResults.vue'
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
    beforeEnter: (_to, _from, next) => {
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
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  if (to.name !== 'register' && to.name !== 'login') {
    if (authStore.user) {
      // Ja lietotājs jau ir ielādēts, netērē resursus vēlreiz
      return next()
    }

    try {
      const userFetched = await authStore.fetchUserData()
      if (userFetched) {
        next()
      } else {
        next({ name: 'login' })
      }
    } catch (error) {
      console.error('Error during user fetch:', error)
      next({ name: 'login' })
    }
  } else {
    next()
  }
})


export default router
