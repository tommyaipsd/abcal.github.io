// Theme configurations
export const themes = {
  blue: {
    name: 'Blue',
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a'
    },
    gradient: 'from-blue-50 to-indigo-100'
  },
  pink: {
    name: 'Pink',
    primary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843'
    },
    gradient: 'from-pink-50 to-rose-100'
  },
  yellow: {
    name: 'Yellow',
    primary: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12'
    },
    gradient: 'from-yellow-50 to-amber-100'
  },
  green: {
    name: 'Green',
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d'
    },
    gradient: 'from-green-50 to-emerald-100'
  },
  purple: {
    name: 'Purple',
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87'
    },
    gradient: 'from-purple-50 to-violet-100'
  },
  orange: {
    name: 'Orange',
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12'
    },
    gradient: 'from-orange-50 to-red-100'
  }
}

export const getThemeCSS = (theme) => {
  const t = themes[theme]
  if (!t) return ''
  
  return `
    :root {
      --primary-50: ${t.primary[50]};
      --primary-100: ${t.primary[100]};
      --primary-200: ${t.primary[200]};
      --primary-300: ${t.primary[300]};
      --primary-400: ${t.primary[400]};
      --primary-500: ${t.primary[500]};
      --primary-600: ${t.primary[600]};
      --primary-700: ${t.primary[700]};
      --primary-800: ${t.primary[800]};
      --primary-900: ${t.primary[900]};
    }
    
    .bg-primary-50 { background-color: ${t.primary[50]}; }
    .bg-primary-500 { background-color: ${t.primary[500]}; }
    .bg-primary-600 { background-color: ${t.primary[600]}; }
    .bg-primary-700 { background-color: ${t.primary[700]}; }
    .text-primary-500 { color: ${t.primary[500]}; }
    .text-primary-600 { color: ${t.primary[600]}; }
    .text-primary-700 { color: ${t.primary[700]}; }
    .text-primary-800 { color: ${t.primary[800]}; }
    .border-primary-500 { border-color: ${t.primary[500]}; }
    .ring-primary-500 { --tw-ring-color: ${t.primary[500]}; }
    .focus\\:ring-primary-500:focus { --tw-ring-color: ${t.primary[500]}; }
    .focus\\:border-primary-500:focus { border-color: ${t.primary[500]}; }
    .hover\\:bg-primary-600:hover { background-color: ${t.primary[600]}; }
    .hover\\:bg-primary-700:hover { background-color: ${t.primary[700]}; }
    .hover\\:text-primary-500:hover { color: ${t.primary[500]}; }
    .bg-primary-100 { background-color: ${t.primary[100]}; }
    .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
  `
}