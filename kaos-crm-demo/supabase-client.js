// Supabase Client Setup
class SupabaseClient {
    constructor() {
        this.client = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
        this.user = null;
        this.session = null;
        this.initializeAuth();
    }

    async initializeAuth() {
        try {
            const { data: { session } } = await this.client.auth.getSession();
            this.session = session;
            this.user = session?.user || null;
            
            // Listen for auth changes
            this.client.auth.onAuthStateChange((event, session) => {
                this.session = session;
                this.user = session?.user || null;
                this.handleAuthChange(event, session);
            });
        } catch (error) {
            console.error('Auth initialization error:', error);
        }
    }

    handleAuthChange(event, session) {
        if (event === 'SIGNED_IN') {
            console.log('User signed in:', session.user);
            this.loadUserData();
        } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            this.clearUserData();
        }
    }

    async loadUserData() {
        if (!this.user) return;

        try {
            // Load user profile from database
            const { data: profile, error } = await this.client
                .from('users')
                .select('*')
                .eq('auth_id', this.user.id)
                .single();

            if (error) throw error;

            // Store user data locally
            localStorage.setItem('userData', JSON.stringify(profile));
            
            // Update UI
            window.dashboard?.updateUserInfo(profile);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    clearUserData() {
        localStorage.removeItem('userData');
        localStorage.removeItem('dashboardCache');
        // Redirect to login or show login form
    }

    // Database Methods
    async fetchLeads(filters = {}) {
        const { data, error } = await this.client
            .from('leads')
            .select(`
                *,
                assigned_to:users(name, email),
                activities:lead_activities(*)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    async fetchMetrics(timeframe = 'today') {
        const now = new Date();
        let startDate;

        switch (timeframe) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'quarter':
                const quarter = Math.floor(now.getMonth() / 3);
                startDate = new Date(now.getFullYear(), quarter * 3, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }

        const { data, error } = await this.client
            .from('leads')
            .select('status, value, created_at')
            .gte('created_at', startDate.toISOString());

        if (error) throw error;

        // Calculate metrics
        const totalLeads = data.length;
        const conversions = data.filter(lead => lead.status === 'converted').length;
        const revenue = data
            .filter(lead => lead.status === 'converted')
            .reduce((sum, lead) => sum + (lead.value || 0), 0);

        return {
            totalLeads,
            conversions,
            revenue,
            conversionRate: totalLeads > 0 ? (conversions / totalLeads) * 100 : 0
        };
    }

    async fetchActivities(limit = 10) {
        const { data, error } = await this.client
            .from('lead_activities')
            .select(`
                *,
                lead:leads(name, email),
                user:users(name)
            `)
            .order('timestamp', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    }

    async fetchTasks(limit = 10) {
        const { data, error } = await this.client
            .from('tasks')
            .select('*')
            .eq('completed', false)
            .order('due_date', { ascending: true })
            .limit(limit);

        if (error) throw error;
        return data;
    }

    async createLead(leadData) {
        const { data, error } = await this.client
            .from('leads')
            .insert([leadData])
            .select();

        if (error) throw error;
        return data[0];
    }

    async updateLead(id, updates) {
        const { data, error } = await this.client
            .from('leads')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    }

    // Real-time subscriptions
    subscribeToLeads(callback) {
        return this.client
            .channel('leads')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'leads'
            }, callback)
            .subscribe();
    }

    subscribeToActivities(callback) {
        return this.client
            .channel('activities')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'lead_activities'
            }, callback)
            .subscribe();
    }
}

// Initialize Supabase client
window.supabaseClient = new SupabaseClient();
