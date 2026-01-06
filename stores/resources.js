// stores/resources.js
import { defineStore } from 'pinia'

export const useResourceStore = defineStore('resources', {
    state: () => ({
        resources: [],
        loading: false
    }),
    actions: {
        async fetchResources() {
            console.log('Fetching...')
        }
    }
})