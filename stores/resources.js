import { defineStore } from 'pinia'

export const useResourceStore = defineStore('resources', {
    state: () => ({
        resources: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchResources() {
            if (this.resources.length > 0) return

            this.loading = true
            this.error = null

            try {
                const supabase = useSupabase()

                // Haal data op
                const { data, error } = await supabase
                    .from('resources')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) throw error

                this.resources = data
            } catch (err) {
                console.error("Store Error:", err);
                this.error = err.message || err
            } finally {
                this.loading = false
            }
        }
    }
})

