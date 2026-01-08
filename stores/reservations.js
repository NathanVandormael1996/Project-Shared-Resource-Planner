// stores/reservations.js
import { defineStore } from 'pinia'

export const useReservationStore = defineStore('reservations', {
    state: () => ({
        reservations: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchReservations() {
            this.loading = true
            this.error = null

            try {
                const supabase = useSupabase()

                const { data, error } = await supabase
                    .from('reservations')
                    .select('*')
                    .order('date', { ascending: true })
                    .order('start_time', { ascending: true })

                if (error) throw error

                this.reservations = data
            } catch (err) {
                console.error("Reservation Store Error:", err)
                this.error = err.message
            } finally {
                this.loading = false
            }
        }
    }})