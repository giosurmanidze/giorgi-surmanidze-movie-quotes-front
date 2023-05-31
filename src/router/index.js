import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../pages/Landing.vue'
import SuccessVerifiedEmail from '../pages/SuccessVerifiedEmail.vue'
import LoginForm from '../pages/LoginForm.vue'
import SignupForm from '../pages/SignupForm.vue'
import SentEmail from '../pages/SentEmail.vue'
import NewFeeds from '../pages/Auth/NewFeeds.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing,
      children: [
        {
          path: '/login',
          name: 'login',
          component: LoginForm
        },
        {
          path: '/signup',
          name: 'signup',
          component: SignupForm
        },
        {
          path: '/success',
          name: 'success',
          component: SuccessVerifiedEmail
        },
        {
          path: '/sent-email',
          name: 'sentEmail',
          component: SentEmail
        }
      ]
    },
    {
      path: '/new-feeds',
      name: 'newFeeds',
      component: NewFeeds
    }
  ]
})

export default router
