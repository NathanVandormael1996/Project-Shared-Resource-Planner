import { defineStore } from 'pinia'

export const useReservationStore = defineStore('reservations', {
    state: () => ({
        reservations: [],
        loading: false,
        error: null
    }),

    actions: {
        // 1. Data ophalen
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

        // 2. LOGICA: Beschikbaarheid Berekenen (De "Hersenen")
        checkAvailability(resourceId, date, newStart, newEnd) {
            // Stap A: Filter op resource en dag
            const dayReservations = this.reservations.filter(res =>
                res.resource_id === resourceId &&
                res.date === date
            )

            // Stap B: Check op overlap
            // Formule: (Nieuwe Start < Bestaande Einde) EN (Nieuwe Einde > Bestaande Start)
            const hasConflict = dayReservations.some(existing => {
                return newStart < existing.end_time && newEnd > existing.start_time
            })

            // Als er conflict is -> NIET beschikbaar (false)
            return !hasConflict
        },

        // 3. Toevoegen (Nu mét check!)
        async addReservation(reservation) {
            this.loading = true
            this.error = null

            // STAP A: Check eerst lokaal of het vrij is
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

            // STAP B: Opslaan in Supabase
            try {
                const supabase = useSupabase()

                // We sturen alleen de nodige velden
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

                // Voeg toe aan lokale lijst voor directe update
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