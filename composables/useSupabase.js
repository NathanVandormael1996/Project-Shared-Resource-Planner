export const useSupabase = () => {
    const { $supabase } = useNuxtApp();
    if (!$supabase) {
        console.error("Supabase client is niet beschikbaar. Controleer je configuratie.");
        return null;
    }
    return $supabase;
};