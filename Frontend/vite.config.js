import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    allowedHosts: ['d6ed817b9935.ngrok-free.app'], // <-- Add your Ngrok domain here
  },
})

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite';

// export default defineConfig({
//   plugins: [
//     tailwindcss(),
//     react({
//       jsxRuntime: 'automatic', // Ensure modern JSX transform
//       babel: {
//         parserOpts: {
//           plugins: ['jsx', 'typescript'] // Support JSX and optional TypeScript
//         }
//       }
//     })
//   ],
//   server: {
//     host: true, // Allow external access
//     allowedHosts: ['5abdc4289170.ngrok-free.app'], // Add your Ngrok domain here
//   }
// });