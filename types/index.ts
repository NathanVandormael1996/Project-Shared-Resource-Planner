// types/index.ts
export interface Resource {
    id: number;
    title: string;
    description: string;
    type: 'Ruimte' | 'Apparatuur'; // Dit dwingt consistentie af
    image_url: string | null;
}

export interface Reservation {
    id: number;
    resource_id: number;
    name: string;
    title: string;
    date: string;
    start_time: string;
    end_time: string;
}