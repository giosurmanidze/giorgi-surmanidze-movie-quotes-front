import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { recoverPassword, createUser, sendForgotPassword } from './requests/sendRequest'
import { useI18n } from 'vue-i18n'
import { useModalStore } from '@/stores/useModalStore'
import { useMoviesStore } from '@/stores/useMoviesStore'
import { useQuotesStore } from '@/stores/useQuotesStore'
import axios from '@/config/axios/auth-index'

export function useSubmitCreatePassword() {
  const route = useRoute()
  const router = useRouter()
  const loading = ref(false)

  const submit = async (values) => {
    loading.value = true

    try {
      values.email = route.query.email
      values.token = route.query.token
      values['password_confirmation'] = values.password_confirmation
      await recoverPassword(values)
      loading.value = false
      router.push({
        name: 'changedPassword'
      })
    } catch (error) {
      loading.value = false
      console.log(error)
    }
  }

  return {
    submit,
    loading
  }
}

export function useSubmitForgotPassword() {
  const { locale } = useI18n({ useScope: 'global' })
  const router = useRouter()
  const loading = ref(false)

  const submit = async (values, actions) => {
    loading.value = true

    try {
      await sendForgotPassword(values)
      loading.value = false
      router.push({
        name: 'recoverInstructions'
      })
    } catch (error) {
      loading.value = false
      actions.setFieldError('email', error.response.data.errors.email[0][locale.value])
    }
  }

  return {
    submit,
    loading
  }
}

export function useCreateMovie() {
  const store = useModalStore()
  const genreArray = ref([])
  const moviesStore = useMoviesStore()
  const imgValue = ref(true)
  const errorMessage = ref('')

  function submit(values, { resetForm }) {
    errorMessage.value = ''
    imgValue.value = true
    let genreIds = values.genre.map((genre) => genre.id)

    let data = {
      name_en: values.nameEn,
      name_ka: values.nameKa,
      genre: JSON.stringify(genreIds),
      director_en: values.directorEn,
      director_ka: values.directorKa,
      description_en: values.descriptionEn,
      description_ka: values.descriptionKa,
      budget: values.budget,
      release_date: values.releaseDate,
      thumbnail: values.thumbnail
    }

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    axios
      .post('api/movies', data, config)
      .then((response) => {
        store.toggleAddMoviesModal()
        store.toggleMovieAddedModal()
        moviesStore.movies.unshift(response.data)
        resetForm()
        genreArray.value = []
        imgValue.value = false
      })
      .catch((error) => {
        errorMessage.value = error.response.data.message
      })
  }

  return {
    submit,
    genreArray,
    imgValue,
    errorMessage
  }
}

export function useCreateQuote() {
  const quotesStore = useQuotesStore()
  const imgValue = ref(true)
  const store = useModalStore()
  const { getQuotesRefresh } = useQuotesStore()

  function submit(values, { resetForm }) {
    imgValue.value = true
    let data = {
      body_en: values.bodyEn,
      body_ka: values.bodyKa,
      thumbnail: values.thumbnail,
      movie_id: values.movie
    }

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }

    axios
      .post('api/quotes', data, config)
      .then((response) => {
        store.toggleAddQuotesModal()
        store.toggleQuoteAddedModal()
        quotesStore.quotes.unshift(response.data)
        getQuotesRefresh()
        resetForm()
        imgValue.value = false
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return {
    submit,
    imgValue
  }
}

export function fetchMovie(params) {
  const router = useRouter()
  const moviesStore = useMoviesStore()
  const movie = ref()
  moviesStore.edited = false

  axios
    .get(`api/movies/${params.value}`)
    .then((response) => {
      movie.value = response.data
      moviesStore.quotes = response.data.quotes
    })
    .catch(() => {
      router.back()
    })

  return {
    movie
  }
}

export function useSubmitRegister() {
  const { locale } = useI18n({ useScope: 'global' })
  const router = useRouter()
  const loading = ref(false)

  const submit = async (values, actions) => {
    loading.value = true

    try {
      await createUser(values)
      loading.value = false
      router.push({
        name: 'sentEmail'
      })
    } catch (error) {
      loading.value = false
      const errors = error.response?.data.errors
      for (const key in errors) {
        actions.setFieldError(key, errors[key][0][locale.value])
      }
    }
  }

  return {
    submit,
    loading
  }
}

export function useEditMovie(params) {
  const { updatedMovie } = useMoviesStore()
  const store = useModalStore()

  function submit(values) {
    let genreIds = values.genre.map((genre) => genre.id)
    let data = {
      name_en: values.nameEn,
      name_ka: values.nameKa,
      genre: JSON.stringify(genreIds),
      director_en: values.directorEn,
      director_ka: values.directorKa,
      description_en: values.descriptionEn,
      description_ka: values.descriptionKa,
      budget: values.budget,
      release_date: values.releaseDate,
      thumbnail: values.thumbnail1
    }

    console.log(values.genre)
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }

    axios
      .post(`api/movies/${params.value}`, data, config)
      .then((response) => {
        updatedMovie.value = response.data
        store.toggleEditModal(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return {
    submit
  }
}
export function useEditQuote(quote) {
  const successMessage = ref(null)
  const moviesStore = useMoviesStore()
  function submit(values) {
    let data = {
      body_en: values.bodyEn,
      body_ka: values.bodyKa,
      thumbnail: values.thumbnail
    }
    const quoteId = ref(quote.value.id)
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    axios
      .post(`api/quotes/${quoteId.value}`, data, config)
      .then(() => {
        successMessage.value = true
        moviesStore.edited = true
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return {
    submit,
    successMessage
  }
}
export function useCreateComment(quoteId) {
  const store = useModalStore()
  const { getQuotesRefresh } = useQuotesStore()

  function submit(values, actions) {
    let data = {
      quote_id: quoteId.value,
      body: values.comment
    }
    axios
      .post('api/comments', data)
      .then((response) => {
        if (response.status === 200) {
          actions.resetForm()
          store.toggleCommentAddedModal()
          getQuotesRefresh()
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return {
    submit
  }
}

export function getLikesData(quoteId) {
  const likeable = ref(null)
  function getLikes() {
    axios.post('api/likes/' + quoteId + '/likeable').then((response) => {
      likeable.value = response.data.likeable
    })
  }
  return {
    getLikes,
    likeable
  }
}

export function addLike(likeable, quoteId) {
  const { getQuotesRefresh } = useQuotesStore()
  function handleQuoteLike() {
    likeable.value = !likeable.value

    let data = {
      like: true,
      quote_id: quoteId
    }
    axios
      .post('api/like', data)
      .then(() => {
        getQuotesRefresh()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return {
    handleQuoteLike
  }
}
