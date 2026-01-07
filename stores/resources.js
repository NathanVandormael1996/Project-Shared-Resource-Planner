import { defineStore } from 'pinia'

export const useResourceStore = defineStore('resources', {
    state: () => ({
        resources: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchResources() {
            // if (this.resources.length > 0) return  <-- TIJDELIJK UITZETTEN VOOR DEBUGGEN

            this.loading = true
            this.error = null

            console.log("START FETCHING...");

            try {
                const supabase = useSupabase()

                if (!supabase) {
                    console.error("Geen Supabase client gevonden!");
                    throw new Error('Supabase client niet geladen')
                }

                const { data, error } = await supabase
                    .from('resources')
                    .select('*')
                    .order('id')

                console.log("DATA UIT SUPABASE:", data);
                console.log("mq ERROR UIT SUPABASE:", error);

                if (error) throw error

                this.resources = data
            } catch (err) {
                console.error("CATCH ERROR:", err);
                this.error = err.message || err
            } finally {
                this.loading = false
                console.log(" KLAAR MET FETCHEN");
            }
        }
    }
})

