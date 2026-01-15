import { defineStore } from 'pinia'

export const useReservationStore = defineStore('reservations', {
    state: () => ({
        reservations: [],
        loading: false,
        error: null
    }),

    actions: {
        // Fetch all reservations
        async fetchReservations() {
            this.loading = true
            this.error = null
            try {
                const supabase = useSupabase()
                const { data, error } = await supabase
                    .from('reservations')
                    .select('*')
                    .order('date', { ascending: true }) // Order by date usually makes sense
                    .order('start_time', { ascending: true })

                if (error) throw error
                this.reservations = data || []
            } catch (err) {
                console.error("Fout bij ophalen reservaties:", err)
                this.error = err.message
            } finally {
                this.loading = false
            }
        },

        // Validate Availability (Conflict detection)
        // Added 'excludeId' to allow editing a reservation without conflicting with itself
        checkAvailability(resourceId, date, newStart, newEnd, excludeId = null) {
            const dayReservations = this.reservations.filter(res =>
                res.resource_id === resourceId &&
                res.date === date &&
                res.id !== excludeId
            )

            // Check for time overlap
            const hasConflict = dayReservations.some(existing => {
                return newStart < existing.end_time && newEnd > existing.start_time
            })

            return !hasConflict
        },

        // Create Reservation
        async addReservation(reservation) {
            this.loading = true
            this.error = null

            // 1. Check availability
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

            // 2. Save to DB
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
        },

        async deleteReservation(id) {
            this.loading = true
            this.error = null
            try {
                const supabase = useSupabase()
                const { error } = await supabase
                    .from('reservations')
                    .delete()
                    .eq('id', id)

                if (error) throw error

                // Remove from local state
                this.reservations = this.reservations.filter(r => r.id !== id)
                return { success: true }
            } catch (err) {
                this.error = "Fout bij verwijderen: " + err.message
                return { success: false }
            } finally {
                this.loading = false
            }
        },

        async updateReservation(updatedRes) {
            this.loading = true
            this.error = null

            const isAvailable = this.checkAvailability(
                updatedRes.resource_id,
                updatedRes.date,
                updatedRes.start_time,
                updatedRes.end_time,
                updatedRes.id
            )

            if (!isAvailable) {
                this.loading = false
                this.error = "❌ Conflict: De nieuwe tijd is al bezet."
                return { success: false }
            }

            try {
                const supabase = useSupabase()
                const { data, error } = await supabase
                    .from('reservations')
                    .update({
                        name: updatedRes.name,
                        title: updatedRes.title,
                        date: updatedRes.date,
                        start_time: updatedRes.start_time,
                        end_time: updatedRes.end_time
                    })
                    .eq('id', updatedRes.id)
                    .select()

                if (error) throw error

                if (data && data.length > 0) {
                    const index = this.reservations.findIndex(r => r.id === updatedRes.id)
                    if (index !== -1) {
                        this.reservations[index] = data[0]
                    }
                }
                return { success: true }
            } catch (err) {
                this.error = "Update fout: " + err.message
                return { success: false }
            } finally {
                this.loading = false
            }
        }
    }
})