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
            try {
                const supabase = useSupabase()
                const { data, error } = await supabase
                    .from('resources')
                    .select('*, reservations(id)')
                // We remove the .order() from Supabase because we will sort it manually below

                if (error) throw error

                // CUSTOM SORTING LOGIC
                this.resources = data.sort((a, b) => {
                    const typeA = (a.type || '').toLowerCase();
                    const typeB = (b.type || '').toLowerCase();

                    // 1. If 'a' is a Kamer and 'b' is not, 'a' comes first
                    if (typeA === 'kamer' && typeB !== 'kamer') return -1;
                    // 2. If 'b' is a Kamer and 'a' is not, 'b' comes first
                    if (typeB === 'kamer' && typeA !== 'kamer') return 1;

                    // 3. If both are the same priority, sort alphabetically by type
                    return typeA.localeCompare(typeB);
                });

            } catch (err) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },

        async addResource(newResource) {
            const supabase = useSupabase()
            const { data, error } = await supabase
                .from('resources')
                .insert([newResource])
                .select()

            if (error) throw error
            if (data) {
                // Manually add empty reservations array so the Card counter shows 0
                this.resources.push({ ...data[0], reservations: [] })
            }
        },

        async updateResource(id, updatedData) {
            const supabase = useSupabase()

            // FIX: Remove 'reservations' from payload so Supabase doesn't look for a non-existent column
            const { reservations, ...payload } = updatedData

            const { data, error } = await supabase
                .from('resources')
                .update(payload)
                .eq('id', id)
                .select()

            if (error) throw error

            if (data) {
                const index = this.resources.findIndex(res => res.id === id)
                if (index !== -1) {
                    // Update local state while preserving the existing reservation array
                    this.resources[index] = { ...data[0], reservations: reservations || [] }
                }
            }
        },

        async deleteResource(id) {
            const supabase = useSupabase()
            const { error } = await supabase
                .from('resources')
                .delete()
                .eq('id', id)

            if (error) throw error
            this.resources = this.resources.filter(res => res.id !== id)
        }
    }
})