import { join } from 'path';

export default {
  content: [join(__dirname, 'index.html'), join(__dirname, 'src/**/*.{js,ts,jsx,tsx}')],
  theme: {
    extend: {}
  },
  plugins: []
};
