# Shared Resource Planner

Een webapplicatie voor het reserveren van gedeelde schoolmiddelen (laptops, vergaderruimtes, beamers).

## Tech Stack

-   **Framework:** [Nuxt 4](https://nuxt.com)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com)
-   **State Management:** [Pinia](https://pinia.vuejs.org)
-   **Backend & Auth:** [Supabase](https://supabase.com)

Yaman: project setup gedaan 06/01/2026

Yaman: pinia store Geïmplementeerd 08/01/2026

Yaman: Data fetching logic (resources en reservaties) 08/01/2026

Yaman: Component Reservatie Formulier (inclusief validatie & extra's) toegevoegd 14/01/2026

Yaman: Logica: Beschikbaarheid Berekenen (overlap check) geïmplementeerd + meerdere items tegelijkertijd kunnen reserveren 15/01/2026

Nathan: Creation and application of reservation card 08/01/2026

Nathan: Resources fetching logic added 14/01/2026

Nathan: Reservation revision + filter 15/01/2026

Nathan: Bugfixes

Nathan: Update documentation/readme 16/01/2026

Xanthe: make the design

Xanthe: add Navcomponent

Xanthe: Add calendar

Xanthe: Add dark/light toggle

Xanthe: design/ add frontend resource

Theme components do not swap with the color toggle we have now, we need Nuxt colors for that
If someone wants to further work with it and make it working in Nuxt colors, run npm install, it will install the Nuxt colors