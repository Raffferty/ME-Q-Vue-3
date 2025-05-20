<template>
  <div class="container">
    <div class="about">
      <div class="grid">
        <div class="card col-6" style="background-color: bisque">
          <div class="card-header">
            <h2>Users List</h2>
          </div>
          <div
            class="test-var"
            @click="setUser({ id: counterStore.userList.length + 1, name: 'Aaaa', age: 11 })"
          >
            <p>addedUser: {{ addedUser || 'null' }}</p>
            <p>counterStore.user: {{ counterStore.user || 'null' }}</p>
          </div>
          <pre>{{ counterStore.userList }}</pre>
        </div>

        <div class="card primary col-6">
          <h1 class="test-var" @click="count++">@click="count++"</h1>

          <p class="test-var" @click="counterStore.increment">@click="counterStore.increment"</p>

          <h1>count: {{ count }}</h1>
          <h1>doubleCount: {{ counterStore.doubleCount }}</h1>
        </div>

        <div class="card primary col-6">
          <h1>This is an about page</h1>
          <p class="test-var" @click="counterStore.$reset()">{{ name }} counterStore.$reset</p>
        </div>

        <div class="card primary col-6">
          <a
            :href="'https://vuejs.org/guide/essentials/reactivity-fundamentals.html#additional-ref-unwrapping-details'"
            target="_blank"
          >
            https://vuejs.org/guide/essentials/reactivity-fundamentals.html#limitations-of-reactive
          </a>
          <h1>object_with_ref = { id: ref(1) }</h1>
          <p>id = {{ id }}</p>
          <p>id + 1 = {{ id + 1 }}</p>
          <p>object_with_ref.id = {{ object_with_ref.id }}</p>
          <p>object_with_ref.id.value + 5 = {{ object_with_ref.id.value + 5 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { pinia } from '@/main' // import the exported pinia instance
import { storeToRefs } from 'pinia'

import { useEnvStore } from '@/stores/environment'
import { useCounterStore } from '@/stores/counter'

import type { UserInfo } from '@/stores/counter'

console.log('pinia', pinia)

const counterStore = useCounterStore()
const envStore = useEnvStore()

console.log('ENV_MODE', envStore.ENV_MODE)
console.log('IS_DEV_MODE', envStore.IS_DEV_MODE)
console.log('IS_PROD_MODE', envStore.IS_PROD_MODE)
console.log('APP_API_HOST', envStore.APP_API_HOST)

const name = envStore.getEnv('VITE_APP_NAME')

// Destructuring from a Store
// const { count } = counterStore // this doesn't work for state and getters, you need to use storeToRefs()
const { increment } = counterStore // this works as increment is a function
const { count, doubleCount, doublePlusOne } = storeToRefs(counterStore) // this works

console.log('doubleCount.value', doubleCount.value)
console.log('doublePlusOne.value', doublePlusOne.value)

// doubleCount.value = 7 // Cannot assign to 'value' because it is a read-only property (getter)
// count.value = 7 // Ok (state)

let local_count = counterStore.count // this works

console.log('local_count', local_count)

// in Options syntax store pinia has own $reset function
// counterStore.$reset() // OK, as in the counterStore (setup syntax) we have created $reset action
// envStore.$reset() // Store "environment" is built using the setup syntax and does not implement $reset().

console.log('counterStore.$id', counterStore.$id) // counter

// watch the whole state on the pinia
watch(
  pinia.state,
  (state) => {
    console.log('watch pinia.state', state)
    // persist the whole state to the local storage whenever it changes
    // localStorage.setItem('app-state', JSON.stringify(state))
  },
  { deep: true },
)

// Subscribing to the state
counterStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  // mutation.type // 'direct' | 'patch object' | 'patch function'

  // same as counterStore.$id
  // mutation.storeId // 'counter'

  // only available with mutation.type === 'patch object'
  // mutation.payload // patch object passed to counterStore.$patch({ user: { id: counterStore.userList.length, name: 'OOO', age: 0 },})

  console.log('$subscribe mutation', mutation)
  console.log('$subscribe state', state)

  // persist the whole state to the local storage whenever it changes
  localStorage.setItem('counter', JSON.stringify(state))
})

// Listen counterStore.$onAction and returnes unsubscribe function
const unsubscribeCounterStoreOnAction = counterStore.$onAction(
  ({
    name, // name of the action // increment, ...
    store, // store instance
    args, // array of parameters passed to the action
    after, // hook after the action returns or resolves
    onError, // hook if the action throws or rejects
  }) => {
    // The callback passed to it is executed before the action itself.
    console.log('Action name', name)
    console.log('Action store', store)
    console.log('Action args', args)

    after((returned_value) => {
      console.log('Action after')
      console.log('after returned_value', returned_value)

      local_count = counterStore.count
      console.log('local_count', local_count)

      /* if (local_count == 3) {
      // Mutating the state with $patch object
      counterStore.$patch({
        user: { id: counterStore.userList.length, name: 'OOO', age: 0 },
      })
    } */

      /* if (local_count == 5) {
      // Mutating the state with $patch function
      counterStore.$patch((state) => {
        const id = state.userList.length
        state.userList.push({ id, name: 'BBB', age: 55 })
        state.user = { id, name: 'BBB', age: 55 }

        console.log('$patch((state)', state)
      })
    } */

      if (local_count > 5) {
        // Reset the state
        counterStore.$reset()
      }
    })

    onError((error) => {
      console.log('Action onError', error)
    })
  },
  // true // to keep  subscription after the component is unmounted
)

// By default, action subscriptions are bound to the component where they are added (if the store is inside a component's setup()).
// Meaning, they will be automatically removed when the component is unmounted.
// If you also want to keep them after the component is unmounted,
// pass true as the second argument to detach the action subscription from the current component:

// this subscription will be kept even after the component is unmounted: someStore.$onAction(callback, true)

// manually remove the listener
onBeforeUnmount(() => {
  unsubscribeCounterStoreOnAction()
})

const addedUser = ref<UserInfo | null>(null)

const setUser = (newUser: UserInfo) => {
  console.log('newUser', newUser)
  counterStore.setUser(newUser)

  counterStore.addUser(newUser)

  // if increment() returnes value, not Promise
  // const returned_value = increment()
  // console.log('incremented returned_value', returned_value)

  // if increment() returnes Promise
  increment()
    .then((returned_value) => {
      console.log('increment returned_value', returned_value)
    })
    .catch((error) => {
      console.log('increment error', error)
    })

  console.log('counterStore.getUserById(newUser.id)', counterStore.getUserById(newUser.id))

  addedUser.value = counterStore.getUserById(newUser.id) || null

  console.log('addedUser', addedUser)
  console.log('addedUser.value?.name', addedUser.value?.name)

  console.log('counterStore.user', counterStore.user)
  console.log('counterStore.user?.name', counterStore.user?.name)

  console.log('counterStore.userList', counterStore.userList)
  console.log('counterStore.userList[0]?.age', counterStore.userList[0]?.age)
}

// Object with ref property
const object_with_ref = { id: ref(1) }
const { id } = object_with_ref

console.log('id.value', id.value) // id is a ref, in teplate is used without .value
// but for the expressions in template should be {{ object_with_ref.id.value + 5 }}
object_with_ref.id.value = object_with_ref.id.value + 2
console.log('object_with_ref.id.value + 2 = ', object_with_ref.id.value)
</script>

<style lang="scss">
.about {
  $test-var-color: yellow;
  font-family: Outfit;

  h1 {
    color: var(--color-primary);

    @include text-overflow;
  }

  .test-var {
    width: fit-content;
    padding: 4px;
    color: var(--color-secondary);

    font-family: RedHatDisplay;

    &:hover {
      color: $test-var-color;
      background-color: var(--vt-c-black);
      cursor: pointer;
    }
  }
}
</style>
