// Kaos CRM Configuration
const CONFIG = {
    SUPABASE_URL: 'https://abhjpjrwkhmktyneuslz.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaGpwanJ3a2hta3R5bmV1c2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODQ4MjQsImV4cCI6MjA2NzM2MDgyNH0.dUotGpB_jNMegT7PCmmU78ufY-zaep72DN4QaYfybHQ',
    API_ENDPOINTS: {
        leads: '/leads',
        activities: '/activities',
        tasks: '/tasks',
        users: '/users',
        organizations: '/organizations'
    },
    CHART_COLORS: {
        primary: '#00D084',
        secondary: '#276EF1',
        accent: '#FF9500',
        success: '#00D084',
        warning: '#FFCC00',
        danger: '#FF4444'
    },
    ANIMATION_DURATION: 300,
    SYNC_INTERVAL: 30000, // 30 seconds
    CACHE_DURATION: 300000 // 5 minutes
};

// Environment detection
CONFIG.ENVIRONMENT = window.location.hostname === 'localhost' ? 'development' : 'production';

// Export for use in other modules
window.CONFIG = CONFIG;
