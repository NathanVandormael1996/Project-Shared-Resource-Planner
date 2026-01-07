import { createClient } from "@supabase/supabase-js";
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    const supabaseUrl = config.public.supabaseUrl;
    const supabaseAnonKey = config.public.supabaseAnonKey;
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Supabase configuratie ontbreekt in runtimeConfig");
        console.error("Controleer je .env bestand:");
        console.error("NUXT_PUBLIC_SUPABASE_URL=...");
        console.error("NUXT_PUBLIC_SUPABASE_ANON_KEY=...");
        return {
            provide: {
                supabase: null
            }
        };
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase client succesvol geïnitialiseerd");
    console.log("URL:", supabaseUrl);
    return {
        provide: {
            supabase
        }
    };
});
