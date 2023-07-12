import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/pages/guest/LandingPage.vue'
import SuccessVerifiedEmail from '@/pages/guest/SuccessVerifiedEmail.vue'
import LoginForm from '@/pages/guest/LoginForm.vue'
import SignupForm from '@/pages/guest/SignupForm.vue'
import SentEmail from '@/pages/guest/SentEmail.vue'
import NewsFeedPage from '@/pages/Auth/NewsFeedPage.vue'
import ForgotPassword from '@/pages/guest/ForgotPassword.vue'
import RecoverInstructions from '@/pages/guest/RecoverInstructions.vue'
import CreatePassword from '@/pages/guest/CreatePassword.vue'
import ChangedPassword from '@/pages/guest/CreatePassword.vue'
import MovieList from '@/pages/Auth/MovieList.vue'
import UserProfile from '@/pages/Auth/UserProfile.vue'
import SingleMovie from '@/pages/Auth/SingleMovie.vue'
import { useAuthStore } from '@/stores/auth/useAuthStore.js'
import { isAuthenticated, isNotAuthenticated } from '@/router/guard/auth-guard.js'
import ForbiddenPage from '@/pages/ErrorPages/ForbiddenPage.vue'
import NotFound from '@/pages/ErrorPages/NotFound.vue'
import axios from '@/config/axios/index.js'
import SuccessUpdatedVerifiedEmail from '@/pages/Auth/SuccessUpdatedVerifiedEmail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage,
      children: [
        {
          path: '/login',
          name: 'login',
          component: LoginForm,
          beforeEnter: isNotAuthenticated
        },
        {
          path: '/signup',
          name: 'signup',
          component: SignupForm,
          beforeEnter: isNotAuthenticated
        },
        {
          path: '/success',
          name: 'success',
          component: SuccessVerifiedEmail,
          beforeEnter: isNotAuthenticated
        },
        {
          path: '/sent-email',
          name: 'sentEmail',
          component: SentEmail,
          beforeEnter: isNotAuthenticated
        },
        {
          path: '/forgot-password',
          name: 'forgotPassword',
          component: ForgotPassword,
          beforeEnter: isNotAuthenticated
        },
        {
          path: '/recover-instructions',
          name: 'recoverInstructions',
          component: RecoverInstructions,
          beforeEnter: isNotAuthenticated
        },
        {
          path: '/reset-password',
          name: 'resetPassword',
          component: CreatePassword,
          beforeEnter: isNotAuthenticated
        },
        {
          path: '/changed-password',
          name: 'changedPassword',
          component: ChangedPassword,
          beforeEnter: isNotAuthenticated
        },
      ]
    },
    {
      path: '/news-feed',
      name: 'newsFeed',
      component: NewsFeedPage,
      beforeEnter: isAuthenticated
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: ForbiddenPage
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound
    },
    {
      path: '/movie-list',
      name: 'movieList',
      component: MovieList,
      beforeEnter: isAuthenticated
    },
    {
      path: '/movie/:id',
      name: 'moviePage',
      component: SingleMovie,
      beforeEnter: isAuthenticated
    },
    {
      path: '/user-profile',
      name: 'userProfile',
      component: UserProfile,
      beforeEnter: isAuthenticated
    },
    {
      path: '/email-verified',
      name: 'emailVerified',
      component: SuccessUpdatedVerifiedEmail,
      beforeEnter: isAuthenticated
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (authStore.authenticated === null) {
    try {
      await axios.get('api/user')
      authStore.authenticated = true
    } catch (err) {
      authStore.authenticated = false
    } finally {
      next()
    }
  } else {
    next()
  }
})

export default router
