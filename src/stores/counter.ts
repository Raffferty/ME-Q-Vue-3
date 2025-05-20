import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

import { useEnvStore } from '@/stores/environment'

export interface UserInfo {
  id: number | string
  name: string
  age: number
}

export const useCounterStore = defineStore('counter', () => {
  // Accessing other stores
  const envStore = useEnvStore()

  // State
  // for initially empty lists
  const userList = ref<UserInfo[]>([])
  // for data that is not yet loaded
  const user = ref<UserInfo | null>(null)
  // these properties will have their type inferred automaticall
  const count = ref(0)

  // Getters
  const doubleCount = computed(() => count.value * 2)
  const doublePlusOne = computed(() => doubleCount.value + 1)
  const getUserById = (userId: number | string) => userList.value.find((user) => user.id === userId)

  // Actions
  function increment() {
    // using another sotr
    if (envStore.IS_DEV_MODE) {
      console.log('in counter store accessed to envStore')
      count.value++
      // return count.value // this value can be reached in counterStore.$onAction((after) => {}) as it is returned
      // and also returned value can be reached as const returned_value = increment()

      // return Promise.reject(count.value) // this error value can be reached in counterStore.$onAction((onError) => {}) as it is returned
      return Promise.resolve(count.value) // this value can be reached in counterStore.increment().then(()=>{...}) as it is Promise
    } else {
      count.value += 2

      return Promise.resolve(count.value) // this value can be reached in counterStore.increment().then(()=>{...}) as it is Promise
    }
  }

  function addUser(newUser: UserInfo) {
    userList.value.push(newUser)
  }

  //! Unlike getters,
  // actions can be asynchronous
  async function setUser(newUser: UserInfo) {
    try {
      user.value = await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(newUser)
        }, 2000)

        // setTimeout(() => {
        //   reject(false)
        // }, 2000)
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  // In Setup Stores, you need to create your own $reset() method
  function $reset() {
    userList.value = []
    user.value = null
    count.value = 0
  }

  watch(
    user,
    (newVal, oldVal) => {
      console.log('watch user oldVal', oldVal)
      console.log('watch user newVal', newVal)
    },
    { immediate: true, deep: true },
  )

  return {
    // State
    userList,
    user,
    count,
    // Getters
    doubleCount,
    doublePlusOne,
    getUserById,
    // Actions
    increment,
    addUser,
    setUser,
    $reset,
  }
})

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

//! You can’t use watch() directly inside a Pinia store with the Options API.
//! Instead, watch the store's state in a component or in a separate Composition API utility.
// For Typescript
/* export interface UserInfo {
  id: number | string
  name: string
  age: number
}

interface State {
  // for initially empty lists
  userList: UserInfo[]
  // for data that is not yet loaded
  user: UserInfo | null
  count: number
}

// In Option Stores, you can reset the state to its initial value by calling the $reset() method
export const useCounterStore = defineStore('counter', {
  // for state arrow function recommended for full type inference
  // In order for Vue to properly detect state, you must declare every state piece in data, even if its initial value is undefined.
  state: (): State => ({
    count: 0,
    userList: [],
    user: null,
  }),

  getters: {
    // automatically infers the return type as a number
    doubleCount: (state) => state.count * 2,

    // the return type **must** be explicitly set
    // as we are using anoter getter (this.doubleCount) in this getter
    //  Access any other getter via this
    // since we rely on `this`, we cannot use an arrow function
    doublePlusOne(): number {
      return this.doubleCount + 1
    },

    getUserById: (state) => {
      return (userId: number | string) => state.userList.find((user) => user.id === userId)
    },
  },

  actions: {
    // since we rely on `this`, we cannot use an arrow function
    increment() {
      // using another sotr
      const envStore = useEnvStore()

      if (envStore.IS_DEV_MODE) {
        console.log('in counter store accessed to envStore')

        this.count++

        // return this.count // this value can be reached in counterStore.$onAction((after) => {}) as it is returned
        // and also returned value can be reached as const returned_value = increment()

        // return Promise.reject(this.count) // this error value can be reached in counterStore.$onAction((onError) => {}) as it is returned
        return Promise.resolve(this.count) // this value can be reached in counterStore.increment().then(()=>{...}) as it is Promise
      } else {
        this.count--
      }
    },

    addUser(newUser: UserInfo) {
      this.userList.push(newUser)
    },

    //! Unlike getters,
    // actions can be asynchronous
    async setUser(newUser: UserInfo) {
      try {
        this.user = await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(newUser)
          }, 2000)

          // setTimeout(() => {
          //   reject(false)
          // }, 2000)
        })
      } catch (error) {
        console.log('error', error)
      }
    },
  },
}) */
