// stores/resources.js
import { defineStore } from 'pinia'

export const useResourceStore = defineStore('resources', {
    // 1. STATE: Het magazijn van je data
    state: () => ({
        resources: [],
        reservations: [],
        loading: false,
        error: null
    }),

    // 2. ACTIONS: De functies die het werk doen
    actions: {
        async fetchResources() {
            if (this.resources.length > 0) return

            this.loading = true
            this.error = null

            try {
                const supabase = useSupabase()

                if (!supabase) throw new Error('Supabase client niet geladen')

                const { data, error } = await supabase
                    .from('resources')
                    .select('*')
                    // .order('created_at', { ascending: false })

                if (error) throw error

                this.resources = data
            } catch (err) {
                console.error("Store Error (Resources):", err);
                this.error = err.message || "Kon resources niet ophalen"
            } finally {
                this.loading = false
            }
        },

        async fetchReservations() {
            try {
                const supabase = useSupabase()

                const { data, error } = await supabase
                    .from('reservations')
                    .select('*')
                    // .order('start_time', { ascending: true })

                if (error) throw error

                this.reservations = data
                console.log("Reservaties opgehaald:", data.length)

            } catch (err) {
                console.error("Store Error (Reservations):", err)
            }
        }
    }
})