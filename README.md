# Color Cluster Game

An interactive, physics-based color clustering game built with **React**, **TypeScript**, **Vite**, and **TailwindCSS**.

The goal is simple: **group all moving dots by their color using pointer repulsion** — but the real-time motion physics and collisions make it a fun and engaging challenge.

---

## Features

-   **Real-time physics simulation** (no canvas — pure DOM manipulation via `translate3d` for GPU acceleration).
-   **Customizable** color palette and dots per color (2–100).
-   **Fixed-timestep physics** with friction, collision, and boundary bounce for stable simulation.
-   **Idle motion** to keep particles "alive" even when untouched.
-   Settings menu for quick, in-game adjustments.
-   **Win detection** with automatic stop and time tracking.
-   Modern setup: **Vite + React 19** with **Tailwind CSS** for styling.

---

## How to Play

1.  Click **Start Game**.
2.  Move your mouse (or touch) — nearby dots will be **repelled** by your pointer.
3.  **Cluster** all dots of the same color close together.
4.  Once every color forms a tight cluster _and_ clusters don't overlap — **you win!**

### Settings

Use the **Settings** menu to:

-   Add or remove colors.
-   Change the number of dots per color (from 2 up to 100).

---

## Setup & Run

### Prerequisites

You need [Node.js](https://nodejs.org/) installed on your system.

1.  **Install dependencies**

    ```bash
    npm install
    ```

2.  **Start the dev server**

    ```bash
    npm run dev
    ```

    Then open `http://localhost:5173` in your browser.

3.  **Build for production**
    ```bash
    npm run build
    ```

---

## Key Technical Notes

-   **Fixed Timestep:** Uses a fixed timestep (`1/60 s`) with an accumulator for stable, deterministic simulation independent of frame rate.
-   **Performance:** Capped substeps (max 5 per frame) prevent runaway CPU load on slow devices.
-   **Rendering:** All motion is handled via direct **DOM transforms** (`translate3d`) for optimal GPU acceleration.
-   **Win Check:** Cluster validation runs efficiently every **200 ms** to detect the win condition.

### Customization

You can easily tune physics behavior in `src/game/constants.ts`:

| Constant         | Description                                            | Default |
| :--------------- | :----------------------------------------------------- | :------ |
| `DOT_SIZE`       | Visual size (diameter) of each dot in pixels.          | `18`    |
| `FRICTION`       | Motion damping factor (higher is more resistance).     | `0.035` |
| `STRENGTH`       | Pointer repulsion strength (how hard dots are pushed). | `3.0`   |
| `CLUSTER_RADIUS` | Max allowed radius for a valid, winning cluster.       | `80`    |
| `MAX_SPEED`      | Max velocity cap to prevent extreme speeds.            | `1200`  |

---

## Tech Stack

| Technology      | Purpose                 |
| :-------------- | :---------------------- |
| **React 19**    | UI Library              |
| **TypeScript**  | Static Typing           |
| **Vite**        | Build Tool & Dev Server |
| **TailwindCSS** | Utility-First Styling   |
