import { defineStore } from 'pinia'

export const useReservationStore = defineStore('reservations', {
    state: () => ({
        reservations: [],
        loading: false,
        error: null
    }),

    actions: {
        // Alle reservaties ophalen van backend
        async fetchReservations() {
            this.loading = true
            this.error = null
            try {
                const supabase = useSupabase()
                const { data, error } = await supabase
                    .from('reservations')
                    .select('*')

                if (error) throw error
                this.reservations = data || []
            } catch (err) {
                console.error("Fout bij ophalen reservaties:", err)
                this.error = err.message
            } finally {
                this.loading = false
            }
        },

        // Beschikbaarheid valideren (Conflict detectie)
        checkAvailability(resourceId, date, newStart, newEnd) {
            const dayReservations = this.reservations.filter(res =>
                res.resource_id === resourceId &&
                res.date === date
            )

            // Check op tijdsoverlap
            const hasConflict = dayReservations.some(existing => {
                return newStart < existing.end_time && newEnd > existing.start_time
            })

            return !hasConflict
        },

        // Nieuwe reservatie aanmaken met validatie
        async addReservation(reservation) {
            this.loading = true
            this.error = null

            // 1. Beschikbaarheid checken
            const isAvailable = this.checkAvailability(
                reservation.resource_id,
                reservation.date,
                reservation.start_time,
                reservation.end_time
            )

            if (!isAvailable) {
                this.loading = false
                this.error = "❌ Deze tijd is al bezet! Kies een ander moment."
                return { success: false }
            }

            // 2. Opslaan in DB
            try {
                const supabase = useSupabase()

                const newBooking = {
                    resource_id: reservation.resource_id,
                    name: reservation.name,
                    title: reservation.title,
                    date: reservation.date,
                    start_time: reservation.start_time,
                    end_time: reservation.end_time
                }

                const { data, error } = await supabase
                    .from('reservations')
                    .insert([newBooking])
                    .select()

                if (error) throw error

                if (data && data.length > 0) {
                    this.reservations.push(data[0])
                }

                return { success: true }
            } catch (err) {
                this.error = "Database error: " + err.message
                return { success: false }
            } finally {
                this.loading = false
            }
        }
    }
})