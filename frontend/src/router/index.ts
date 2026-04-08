import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import Login from '../views/auth/LoginPage.vue'
import SignUp from '../views/auth/SignUp.vue'
import Home from '../views/HomePage.vue'
import NotFound from '../views/NotFound.vue'
import Predictions from '../views/UserPredictions.vue'
import Summary from '../views/SummaryTable.vue'
import Results from '../views/GameResults.vue'
// import ForgotPassword from '../views/auth/ForgotPassword.vue'
// import ResetPassword from '../views/auth/ResetPassword.vue'

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

  // {
  //   path: '/forgot-password',
  //   name: 'forgot-password',
  //   component: ForgotPassword,
  // },
  // {
  //   path: '/reset-password',
  //   name: 'reset-password',
  //   component: ResetPassword,
  // },

  {
    path: '/results',
    name: 'results',
    component: Results,
    beforeEnter: (_to: any, _from: any, next: any) => {
      const authStore = useAuthStore()
      if (authStore.user?.role === 'admin') {
        next()
      } else {
        next({ name: 'home' })
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

const publicPages = ['login', 'register', 'forgot-password', 'reset-password']

router.beforeEach(async (to, _from, next) => {
  const { isAuthenticated } = useAuthStore()

  // Ja lietotājs jau login → nedod pieeju login/register
  if (isAuthenticated && ['login', 'register'].includes(to.name as string)) {
    return next({ name: 'home' })
  }

  // Ja lietotājs nav login un lapa nav publiska → aizsargi
  if (!isAuthenticated && !publicPages.includes(to.name as string)) {
    return next({ name: 'login' })
  }

  return next()
})

export default router
