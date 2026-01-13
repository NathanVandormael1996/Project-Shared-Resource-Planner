// stores/resources.js
import { defineStore } from 'pinia'

export const useResourceStore = defineStore('resources', {
    state: () => ({
        resources: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchResources() {
            this.loading = true
            this.error = null
            try {
                const supabase = useSupabase()
                const { data, error } = await supabase
                    .from('resources')
                    .select(`
                        *,
                        reservations (
                            id
                        )
                    `)
                    .order('title', { ascending: true })

                if (error) throw error
                this.resources = data
            } catch (err) {
                console.error("Resource Store Error:", err)
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
    }
})