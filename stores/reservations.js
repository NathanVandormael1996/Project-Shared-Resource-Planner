import { defineStore } from 'pinia'

export const useReservationStore = defineStore('reservations', {
    state: () => ({
        reservations: [],
        loading: false,
        error: null
    }),

    actions: {
        // Bestaande fetch logica
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
        },

        // NIEUW: Toevoegen (S3-01)
        async addReservation(bookingDetails) {
            this.loading = true
            this.error = null

            try {
                const supabase = useSupabase()

                const newBooking = {
                    resource_id: bookingDetails.resource_id,
                    name: bookingDetails.name,
                    title: bookingDetails.title,
                    date: bookingDetails.date,
                    start_time: bookingDetails.start_time,
                    end_time: bookingDetails.end_time
                }

                const { data, error } = await supabase
                    .from('reservations')
                    .insert([newBooking])
                    .select()

                if (error) throw error

                // Voeg direct toe aan de lokale state (snelle UI)
                if (data) {
                    this.reservations.push(data[0])
                }

                return { success: true }

            } catch (err) {
                console.error("Booking Error:", err)
                this.error = err.message
                return { success: false, error: err.message }
            } finally {
                this.loading = false
            }
        }
    }
})