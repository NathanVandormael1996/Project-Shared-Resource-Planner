// types/index.ts
export interface Resource {
    id: number;
    title: string;
    description: string;
    type: 'Ruimte' | 'Apparatuur'; // Dit dwingt consistentie af
    image_url: string | null;
}