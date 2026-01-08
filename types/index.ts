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
    user_id: string;
    title: string;
    start_time: string;
    end_time: string;
    // status: 'pending' | 'approved' | 'rejected';
}