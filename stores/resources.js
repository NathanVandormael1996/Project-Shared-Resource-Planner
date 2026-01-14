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

                if (error) throw error

                // Sorting logic
                this.resources = data.sort((a, b) => {
                    const typeA = (a.type || '').toLowerCase();
                    const typeB = (b.type || '').toLowerCase();

                    if (typeA === 'kamer' && typeB !== 'kamer') return -1;

                    if (typeB === 'kamer' && typeA !== 'kamer') return 1;

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
                // In case reservations is empty, it still shows 0
                this.resources.push({ ...data[0], reservations: [] })
            }
        },

        async updateResource(id, updatedData) {
            const supabase = useSupabase()

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
                    // Put remote data into local array
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