// Desktop Dashboard Controller
class Dashboard {
    constructor() {
        this.currentTimeframe = 'today';
        this.isLoading = false;
        this.cache = new Map();
        this.subscriptions = [];
        this.chart = null;
        this.animationObserver = null;
        
        this.init();
    }

    async init() {
        try {
            this.setupEventListeners();
            this.setupAnimationObserver();
            await this.loadDashboardData();
            this.setupRealtimeSubscriptions();
            this.startPeriodicSync();
        } catch (error) {
            console.error('Dashboard initialization error:', error);
            this.showError('Failed to initialize dashboard');
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(e.currentTarget.dataset.page);
            });
        });

        // Time frame selector
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeTimeframe(e.target.dataset.timeframe);
            });
        });

        // Chart controls
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeChartType(e.target.dataset.chart);
            });
        });

        // Quick actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Activity filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterActivities(e.target.dataset.filter);
            });
        });

        // Search
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.performSearch(e.target.value);
            }, 300));
        }

        // Notifications
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.showNotifications();
            });
        }

        // User profile click
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            userProfile.addEventListener('click', () => {
                this.showUserMenu();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window resize
        window.addEventListener('resize', this.debounce(() => {
            if (this.chart) {
                this.chart.resize();
            }
        }, 250));
    }

    setupAnimationObserver() {
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-metric').forEach(el => {
            this.animationObserver.observe(el);
        });
    }

    async loadDashboardData() {
        this.setLoading(true);
        
        try {
            const [metrics, activities, tasks, leads, performers] = await Promise.all([
                this.loadMetrics(),
                this.loadActivities(),
                this.loadTasks(),
                this.loadRecentLeads(),
                this.loadTopPerformers()
            ]);

            this.updateUI({ metrics, activities, tasks, leads, performers });
            this.setupChart(metrics.chartData);
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Failed to load dashboard data');
        } finally {
            this.setLoading(false);
        }
    }

    async loadMetrics() {
        const cacheKey = `metrics-${this.currentTimeframe}`;
        
        if (this.cache.has(cacheKey) && this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const metrics = await window.supabaseClient.fetchMetrics(this.currentTimeframe);
            
            const trends = {
                revenueChange: this.calculateTrend(metrics.revenue),
                leadsChange: this.calculateTrend(metrics.totalLeads),
                conversionChange: this.calculateTrend(metrics.conversions),
                winRateChange: this.calculateTrend(metrics.conversionRate)
            };

            const chartData = this.generateChartData(this.currentTimeframe);

            const result = { ...metrics, ...trends, chartData };
            this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
            
            return result;
        } catch (error) {
            console.error('Error loading metrics:', error);
            return this.getFallbackMetrics();
        }
    }

    async loadTopPerformers() {
        try {
            // Mock data for top performers
            return [
                { name: 'Sarah Johnson', deals: 12, revenue: 245000, avatar: 'SJ' },
                { name: 'Mike Chen', deals: 9, revenue: 189000, avatar: 'MC' },
                { name: 'Emily Davis', deals: 8, revenue: 167000, avatar: 'ED' },
                { name: 'James Wilson', deals: 7, revenue: 134000, avatar: 'JW' },
                { name: 'Lisa Martinez', deals: 6, revenue: 112000, avatar: 'LM' }
            ];
        } catch (error) {
            console.error('Error loading performers:', error);
            return [];
        }
    }

    updateUI({ metrics, activities, tasks, leads, performers }) {
        this.updateUserInfo();
        this.updateWelcomeSection(metrics);
        this.updateMetrics(metrics);
        this.renderActivities(activities);
        this.renderTasks(tasks);
        this.renderLeadsTable(leads);
        this.renderTopPerformers(performers);
    }

    updateWelcomeSection(metrics) {
        const greetingElement = document.getElementById('greetingText');
        const todayLeadsElement = document.getElementById('todayLeads');
        const pendingTasksElement = document.getElementById('pendingTasks');

        if (greetingElement) greetingElement.textContent = this.getGreeting();
        if (todayLeadsElement) this.animateCounter('todayLeads', metrics.todayLeads || 0);
        if (pendingTasksElement) this.animateCounter('pendingTasks', metrics.pendingTasks || 0);
    }

    updateMetrics(metrics) {
        this.animateCounter('totalRevenue', this.formatCurrency(metrics.revenue || 0));
        this.animateCounter('activeLeads', metrics.totalLeads || 0);
        this.animateCounter('conversions', metrics.conversions || 0);
        this.animateCounter('winRate', `${(metrics.conversionRate || 0).toFixed(1)}%`);

        this.updateTrendIndicator('revenueChange', metrics.revenueChange || 0);
        this.updateTrendIndicator('leadsChange', metrics.leadsChange || 0);
        this.updateTrendIndicator('conversionChange', metrics.conversionChange || 0);
        this.updateTrendIndicator('winRateChange', metrics.winRateChange || 0);
    }

    renderLeadsTable(leads) {
        const tbody = document.getElementById('leadsTableBody');
        if (!tbody) return;

        if (leads.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-tertiary);">
                        No leads found
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = leads.slice(0, 10).map(lead => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--uber-blue), var(--uber-purple)); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px;">
                            ${(lead.name || 'L').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style="font-weight: 600;">${lead.name || 'Unknown Lead'}</div>
                            <div style="font-size: 12px; color: var(--text-tertiary);">${lead.email || 'No email'}</div>
                        </div>
                    </div>
                </td>
                <td>${lead.company || 'N/A'}</td>
                <td><span class="status-badge ${lead.status || 'new'}">${lead.status || 'new'}</span></td>
                <td>${this.formatCurrency(lead.value || 0)}</td>
                <td>${lead.assigned_to?.name || 'Unassigned'}</td>
                <td>${this.formatRelativeTime(lead.updated_at || lead.created_at)}</td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button style="background: none; border: none; color: var(--text-tertiary); cursor: pointer;" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button style="background: none; border: none; color: var(--text-tertiary); cursor: pointer;" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button style="background: none; border: none; color: var(--text-tertiary); cursor: pointer;" title="More">
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderTopPerformers(performers) {
        const container = document.getElementById('performersList');
        if (!container) return;

        container.innerHTML = performers.map((performer, index) => `
            <div class="performer-item">
                <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                    <div style="font-size: 18px; font-weight: 700; color: var(--text-tertiary); min-width: 20px;">
                        ${index + 1}
                    </div>
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--uber-green), var(--uber-blue)); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px;">
                        ${performer.avatar}
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--text-primary);">${performer.name}</div>
                        <div style="font-size: 12px; color: var(--text-tertiary);">${performer.deals} deals • ${this.formatCurrency(performer.revenue)}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupChart(chartData) {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Leads',
                    data: chartData.leads,
                    borderColor: CONFIG.CHART_COLORS.primary,
                    backgroundColor: CONFIG.CHART_COLORS.primary + '10',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: CONFIG.CHART_COLORS.primary,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }, {
                    label: 'Conversions',
                    data: chartData.conversions,
                    borderColor: CONFIG.CHART_COLORS.secondary,
                    backgroundColor: CONFIG.CHART_COLORS.secondary + '10',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: CONFIG.CHART_COLORS.secondary,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            color: '#ffffff80',
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: '#ffffff08',
                            borderColor: '#ffffff10'
                        },
                        ticks: {
                            color: '#ffffff60'
                        }
                    },
                    y: {
                        grid: {
                            color: '#ffffff08',
                            borderColor: '#ffffff10'
                        },
                        ticks: {
                            color: '#ffffff60'
                        }
                    }
                }
            }
        });
    }

    navigateTo(page) {
        // Update active navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-page="${page}"]`)?.closest('.nav-item');
        if (activeItem) {
            activeItem.classList.add('active');
        }

        // Update page title
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.textContent = this.getPageTitle(page);
        }

        // Handle page navigation logic here
        console.log('Navigate to:', page);
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('globalSearch')?.focus();
        }
        
        // Ctrl/Cmd + N for new lead
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.handleQuickAction('add-lead');
        }
    }

    performSearch(query) {
        if (query.length < 2) return;
        
        console.log('Searching for:', query);
        // Implement search logic
    }

    showNotifications() {
        console.log('Show notifications');
        // Implement notifications panel
    }

    showUserMenu() {
        console.log('Show user menu');
        // Implement user menu dropdown
    }

    filterActivities(filter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        // Reload activities with filter
        this.loadActivities(filter).then(activities => {
            this.renderActivities(activities);
        });
    }

    changeChartType(chartType) {
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.chart === chartType);
        });
        
        // Update chart with new data type
        console.log('Change chart to:', chartType);
    }

    getPageTitle(page) {
        const titles = {
            dashboard: 'Dashboard',
            leads: 'Leads',
            opportunities: 'Opportunities',
            contacts: 'Contacts',
            territories: 'Territories',
            reports: 'Analytics',
            calendar: 'Calendar',
            tasks: 'Tasks',
            settings: 'Settings'
        };
        return titles[page] || 'Dashboard';
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Additional helper methods that are referenced but not shown in the provided code
    setLoading(isLoading) {
        this.isLoading = isLoading;
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            if (isLoading) {
                loadingScreen.classList.remove('hidden');
            } else {
                loadingScreen.classList.add('hidden');
            }
        }
    }

    showError(message) {
        console.error(message);
        // Implement error notification
    }

    isCacheValid(cacheKey) {
        const cached = this.cache.get(cacheKey);
        if (!cached) return false;
        
        const fiveMinutes = 5 * 60 * 1000;
        return (Date.now() - cached.timestamp) < fiveMinutes;
    }

    calculateTrend(currentValue) {
        // Mock trend calculation - would typically compare with previous period
        return Math.random() * 20 - 10; // Random between -10 and +10
    }

    generateChartData(timeframe) {
        // Mock chart data generation
        const days = timeframe === 'today' ? 7 : timeframe === 'week' ? 7 : 30;
        const labels = [];
        const leads = [];
        const conversions = [];

        for (let i = 0; i < days; i++) {
            labels.push(`Day ${i + 1}`);
            leads.push(Math.floor(Math.random() * 50) + 10);
            conversions.push(Math.floor(Math.random() * 20) + 5);
        }

        return { labels, leads, conversions };
    }

    getFallbackMetrics() {
        return {
            revenue: 1250000,
            totalLeads: 156,
            conversions: 34,
            conversionRate: 21.8,
            todayLeads: 12,
            pendingTasks: 8,
            chartData: this.generateChartData(this.currentTimeframe)
        };
    }

    async loadActivities(filter = 'all') {
        // Mock activities data
        return [
            { type: 'call', title: 'Called John Doe', subtitle: 'Follow-up discussion', time: '2 hours ago' },
            { type: 'email', title: 'Sent proposal to ABC Corp', subtitle: 'Q4 requirements', time: '4 hours ago' },
            { type: 'meeting', title: 'Demo with Tech Startup', subtitle: 'Product walkthrough', time: '1 day ago' }
        ];
    }

    async loadTasks() {
        // Mock tasks data
        return [
            { title: 'Follow up with lead', due: 'Today 3:00 PM', priority: 'high' },
            { title: 'Prepare Q4 report', due: 'Tomorrow 9:00 AM', priority: 'medium' },
            { title: 'Update CRM data', due: 'Friday 5:00 PM', priority: 'low' }
        ];
    }

    async loadRecentLeads() {
        // Mock leads data - would come from Supabase
        return [
            { name: 'John Smith', email: 'john@techcorp.com', company: 'TechCorp', status: 'new', value: 50000, created_at: new Date() },
            { name: 'Sarah Johnson', email: 'sarah@innovate.com', company: 'Innovate Inc', status: 'qualified', value: 75000, created_at: new Date() },
            { name: 'Mike Wilson', email: 'mike@startup.io', company: 'Startup.io', status: 'contacted', value: 25000, created_at: new Date() }
        ];
    }

    renderActivities(activities) {
        const container = document.getElementById('activityList');
        if (!container) return;

        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon" style="background: var(--uber-${activity.type === 'call' ? 'green' : activity.type === 'email' ? 'blue' : 'orange'});">
                    <i class="fas fa-${activity.type === 'call' ? 'phone' : activity.type === 'email' ? 'envelope' : 'calendar'}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-subtitle">${activity.subtitle}</div>
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    }

    renderTasks(tasks) {
        const container = document.getElementById('tasksList');
        if (!container) return;

        container.innerHTML = tasks.map(task => `
            <div class="task-item">
                <div class="task-checkbox">
                    <input type="checkbox" style="width: 16px; height: 16px;">
                </div>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-due">${task.due}</div>
                </div>
            </div>
        `).join('');
    }

    updateUserInfo() {
        const userInitial = document.getElementById('userInitial');
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');

        if (userInitial) userInitial.textContent = 'U';
        if (userName) userName.textContent = 'User Name';
        if (userRole) userRole.textContent = 'Sales Rep';
    }

    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning,';
        if (hour < 18) return 'Good afternoon,';
        return 'Good evening,';
    }

    animateCounter(elementId, value) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.textContent = value;
    }

    updateTrendIndicator(elementId, trend) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const isPositive = trend >= 0;
        element.textContent = `${isPositive ? '+' : ''}${trend.toFixed(1)}%`;
        element.parentElement.className = `metric-change ${isPositive ? 'positive' : 'negative'}`;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    }

    formatRelativeTime(date) {
        const now = new Date();
        const past = new Date(date);
        const diffInMs = now - past;
        const diffInHours = diffInMs / (1000 * 60 * 60);
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
        return `${Math.floor(diffInHours / 24)} days ago`;
    }

    changeTimeframe(timeframe) {
        this.currentTimeframe = timeframe;
        
        // Update active button
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.timeframe === timeframe);
        });
        
        // Reload data
        this.loadDashboardData();
    }

    handleQuickAction(action) {
        console.log('Quick action:', action);
        // Implement quick actions
    }

    setupRealtimeSubscriptions() {
        // Implement real-time subscriptions
        console.log('Setting up real-time subscriptions');
    }

    startPeriodicSync() {
        // Refresh data every 5 minutes
        setInterval(() => {
            this.loadDashboardData();
        }, 5 * 60 * 1000);
    }
}

window.Dashboard = Dashboard;

    setupEventListeners() {
        // Time frame selector
        document.querySelectorAll('.time-frame-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeTimeframe(e.target.dataset.timeframe);
            });
        });

        // Quick actions
        document.querySelectorAll('.quick-action-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // FAB button
        const fabButton = document.getElementById('fabButton');
        if (fabButton) {
            fabButton.addEventListener('click', () => {
                this.handleQuickAction('add-lead');
            });
        }

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.navigateTo(e.currentTarget.dataset.page);
            });
        });

        // View analytics
        const viewAnalyticsBtn = document.getElementById('viewAnalytics');
        if (viewAnalyticsBtn) {
            viewAnalyticsBtn.addEventListener('click', () => {
                this.showAnalyticsModal();
            });
        }

        // Network status monitoring
        window.addEventListener('online', () => this.updateNetworkStatus(true));
        window.addEventListener('offline', () => this.updateNetworkStatus(false));

        // Page visibility for performance
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.refresh();
            }
        });
    }

    setupAnimationObserver() {
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.1 });

        // Observe animated elements
        document.querySelectorAll('.animate-metric').forEach(el => {
            this.animationObserver.observe(el);
        });
    }

    async loadDashboardData() {
        this.setLoading(true);
        
        try {
            // Load data in parallel
            const [metrics, activities, tasks, leads] = await Promise.all([
                this.loadMetrics(),
                this.loadActivities(),
                this.loadTasks(),
                this.loadRecentLeads()
            ]);

            this.updateUI({ metrics, activities, tasks, leads });
            this.setupChart(metrics.chartData);
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Failed to load dashboard data');
        } finally {
            this.setLoading(false);
        }
    }

    async loadMetrics() {
        const cacheKey = `metrics-${this.currentTimeframe}`;
        
        if (this.cache.has(cacheKey) && this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const metrics = await window.supabaseClient.fetchMetrics(this.currentTimeframe);
            
            // Calculate trends (mock data for demo)
            const trends = {
                leadsChange: this.calculateTrend(metrics.totalLeads),
                conversionChange: this.calculateTrend(metrics.conversions),
                revenueChange: this.calculateTrend(metrics.revenue),
                dealsChange: this.calculateTrend(metrics.totalLeads - metrics.conversions)
            };

            // Generate chart data
            const chartData = this.generateChartData(this.currentTimeframe);

            const result = { ...metrics, ...trends, chartData };
            this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
            
            return result;
        } catch (error) {
            console.error('Error loading metrics:', error);
            return this.getFallbackMetrics();
        }
    }

    async loadActivities() {
        try {
            const activities = await window.supabaseClient.fetchActivities(10);
            return activities || [];
        } catch (error) {
            console.error('Error loading activities:', error);
            return this.getFallbackActivities();
        }
    }

    async loadTasks() {
        try {
            const tasks = await window.supabaseClient.fetchTasks(10);
            return tasks || [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            return this.getFallbackTasks();
        }
    }

    async loadRecentLeads() {
        try {
            const leads = await window.supabaseClient.fetchLeads();
            return leads.slice(0, 6) || [];
        } catch (error) {
            console.error('Error loading leads:', error);
            return this.getFallbackLeads();
        }
    }

    updateUI({ metrics, activities, tasks, leads }) {
        // Update user info
        this.updateUserInfo();
        
        // Update metrics
        this.animateCounter('totalLeads', metrics.totalLeads);
        this.animateCounter('conversions', metrics.conversions);
        this.animateCounter('revenue', this.formatCurrency(metrics.revenue));
        this.animateCounter('activeDeals', metrics.totalLeads - metrics.conversions);

        // Update trend indicators
        this.updateTrendIndicator('leadsChange', metrics.leadsChange);
        this.updateTrendIndicator('conversionChange', metrics.conversionChange);
        this.updateTrendIndicator('revenueChange', metrics.revenueChange);
        this.updateTrendIndicator('dealsChange', metrics.dealsChange);

        // Update activity list
        this.renderActivities(activities);
        
        // Update tasks list
        this.renderTasks(tasks);
        
        // Update recent leads
        this.renderRecentLeads(leads);
    }

    updateUserInfo(userData = null) {
        const user = userData || JSON.parse(localStorage.getItem('userData') || '{}');
        const userName = user.name || 'User';
        const userInitial = userName.charAt(0).toUpperCase();

        // Update greeting
        const greetingElement = document.getElementById('greetingText');
        const userNameElement = document.getElementById('userName');
        const userInitialElement = document.getElementById('userInitial');

        if (greetingElement) greetingElement.textContent = this.getGreeting();
        if (userNameElement) userNameElement.textContent = userName.split(' ')[0];
        if (userInitialElement) userInitialElement.textContent = userInitial;
    }

    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning,';
        if (hour < 17) return 'Good afternoon,';
        return 'Good evening,';
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = 0;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            let currentValue;
            if (typeof targetValue === 'string' && targetValue.includes('$')) {
                const numericValue = parseFloat(targetValue.replace(/[$,]/g, ''));
                currentValue = this.formatCurrency(startValue + (numericValue - startValue) * easeOutQuart);
            } else {
                currentValue = Math.floor(startValue + (parseInt(targetValue) - startValue) * easeOutQuart);
            }
            
            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    updateTrendIndicator(elementId, change) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const isPositive = change >= 0;
        const icon = element.previousElementSibling;
        
        if (icon) {
            icon.className = `fas fa-arrow-${isPositive ? 'up' : 'down'}`;
        }
        
        element.textContent = `${isPositive ? '+' : ''}${change.toFixed(1)}%`;
        element.parentElement.className = `metric-change ${isPositive ? 'positive' : 'negative'}`;
    }

    renderActivities(activities) {
        const container = document.getElementById('activityList');
        if (!container) return;

        if (activities.length === 0) {
            container.innerHTML = this.getEmptyState('clock', 'No Recent Activity', 'Activity will appear here');
            return;
        }

        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${this.getActivityIconClass(activity.type)}" 
                     style="background: ${this.getActivityColor(activity.type)}20; color: ${this.getActivityColor(activity.type)}">
                    <i class="${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.type?.toUpperCase() || 'Activity'}</div>
                    <div class="activity-subtitle">${activity.notes || activity.lead?.name || 'No details'}</div>
                </div>
                <div class="activity-time">${this.formatRelativeTime(activity.timestamp)}</div>
            </div>
        `).join('');
    }

    renderTasks(tasks) {
        const container = document.getElementById('tasksList');
        if (!container) return;

        if (tasks.length === 0) {
            container.innerHTML = this.getEmptyState('check-circle', 'No Upcoming Tasks', "You're all caught up!");
            return;
        }

        container.innerHTML = tasks.map(task => `
            <div class="task-item">
                <div class="task-checkbox">
                    <i class="fas fa-circle" style="color: ${this.getPriorityColor(task.priority)}"></i>
                </div>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-due">${this.formatDate(task.due_date)} • ${task.priority}</div>
                </div>
            </div>
        `).join('');
    }

    renderRecentLeads(leads) {
        const container = document.getElementById('recentLeadsGrid');
        if (!container) return;

        if (leads.length === 0) {
            container.innerHTML = this.getEmptyState('users', 'No Recent Leads', 'New leads will appear here');
            return;
        }

        container.innerHTML = leads.map(lead => `
            <div class="lead-card">
                <div class="lead-header">
                    <div class="lead-avatar">
                        ${(lead.name || 'L').charAt(0).toUpperCase()}
                    </div>
                    <div class="lead-info">
                        <div class="lead-name">${lead.name || 'Unknown Lead'}</div>
                        <div class="lead-email">${lead.email || 'No email'}</div>
                    </div>
                    <div class="lead-status ${lead.status || 'new'}">${lead.status || 'new'}</div>
                </div>
            </div>
        `).join('');
    }

    setupChart(chartData) {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Leads',
                    data: chartData.leads,
                    borderColor: CONFIG.CHART_COLORS.primary,
                    backgroundColor: CONFIG.CHART_COLORS.primary + '20',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Conversions',
                    data: chartData.conversions,
                    borderColor: CONFIG.CHART_COLORS.secondary,
                    backgroundColor: CONFIG.CHART_COLORS.secondary + '20',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff80'
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: '#ffffff10'
                        },
                        ticks: {
                            color: '#ffffff60'
                        }
                    },
                    y: {
                        grid: {
                            color: '#ffffff10'
                        },
                        ticks: {
                            color: '#ffffff60'
                        }
                    }
                }
            }
        });
    }

    changeTimeframe(timeframe) {
        if (this.currentTimeframe === timeframe) return;

        this.currentTimeframe = timeframe;
        
        // Update UI
        document.querySelectorAll('.time-frame-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.timeframe === timeframe);
        });

        // Reload data
        this.loadDashboardData();
    }

    handleQuickAction(action) {
        switch (action) {
            case 'add-lead':
                this.showAddLeadModal();
                break;
            case 'schedule-call':
                this.showScheduleCallModal();
                break;
            case 'send-email':
                this.showEmailModal();
                break;
            case 'new-meeting':
                this.showMeetingModal();
                break;
            case 'view-reports':
                this.navigateTo('analytics');
                break;
            default:
                console.log('Quick action:', action);
        }
    }

    navigateTo(page) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });

        // Handle navigation logic
        console.log('Navigate to:', page);
        // Implementation would depend on your routing system
    }

    setupRealtimeSubscriptions() {
        // Subscribe to leads changes
        const leadsSubscription = window.supabaseClient.subscribeToLeads((payload) => {
            console.log('Leads update:', payload);
            this.refresh();
        });

        // Subscribe to activities changes
        const activitiesSubscription = window.supabaseClient.subscribeToActivities((payload) => {
            console.log('Activities update:', payload);
            this.loadActivities().then(activities => this.renderActivities(activities));
        });

        this.subscriptions.push(leadsSubscription, activitiesSubscription);
    }

    startPeriodicSync() {
        setInterval(() => {
            if (document.visibilityState === 'visible' && navigator.onLine) {
                this.refresh();
            }
        }, CONFIG.SYNC_INTERVAL);
    }

    async refresh() {
        if (this.isLoading) return;
        
        this.clearCache();
        await this.loadDashboardData();
    }

    setLoading(loading) {
        this.isLoading = loading;
        const loadingScreen = document.getElementById('loading-screen');
        const mainApp = document.getElementById('main-app');

        if (loading) {
            loadingScreen?.classList.remove('hidden');
            mainApp?.classList.add('hidden');
        } else {
            setTimeout(() => {
                loadingScreen?.classList.add('hidden');
                mainApp?.classList.remove('hidden');
            }, 500);
        }
    }

    updateNetworkStatus(isOnline) {
        const statusElement = document.getElementById('networkStatus');
        if (!statusElement) return;

        const indicator = statusElement.querySelector('.status-indicator');
        const text = statusElement.querySelector('span');

        if (isOnline) {
            indicator.classList.remove('offline');
            indicator.classList.add('online');
            text.textContent = 'Online';
        } else {
            indicator.classList.remove('online');
            indicator.classList.add('offline');
            text.textContent = 'Offline';
        }
    }

    // Helper methods
    calculateTrend(currentValue) {
        // Mock trend calculation - in production, compare with previous period
        return (Math.random() - 0.3) * 20; // Random trend between -6% and +14%
    }

    generateChartData(timeframe) {
        const labels = [];
        const leads = [];
        const conversions = [];

        // Generate mock data based on timeframe
        const points = timeframe === 'today' ? 24 : timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;

        for (let i = 0; i < points; i++) {
            if (timeframe === 'today') {
                labels.push(`${i}:00`);
            } else {
                labels.push(`Day ${i + 1}`);
            }
            leads.push(Math.floor(Math.random() * 50) + 10);
            conversions.push(Math.floor(Math.random() * 20) + 5);
        }

        return { labels, leads, conversions };
    }

    getActivityIcon(type) {
        const icons = {
            call: 'fas fa-phone',
            email: 'fas fa-envelope',
            meeting: 'fas fa-calendar',
            note: 'fas fa-sticky-note',
            deal: 'fas fa-handshake'
        };
        return icons[type] || 'fas fa-circle';
    }

    getActivityColor(type) {
        const colors = {
            call: CONFIG.CHART_COLORS.secondary,
            email: CONFIG.CHART_COLORS.primary,
            meeting: CONFIG.CHART_COLORS.accent,
            note: '#AF52DE',
            deal: CONFIG.CHART_COLORS.warning
        };
        return colors[type] || '#666';
    }

    getPriorityColor(priority) {
        const colors = {
            low: CONFIG.CHART_COLORS.primary,
            medium: CONFIG.CHART_COLORS.warning,
            high: CONFIG.CHART_COLORS.accent,
            urgent: CONFIG.CHART_COLORS.danger
        };
        return colors[priority] || '#666';
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatRelativeTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }

    getEmptyState(icon, title, subtitle) {
        return `
            <div class="empty-state">
                <i class="fas fa-${icon}"></i>
                <h4>${title}</h4>
                <p>${subtitle}</p>
            </div>
        `;
    }

    isCacheValid(key) {
        const cached = this.cache.get(key);
        return cached && (Date.now() - cached.timestamp) < CONFIG.CACHE_DURATION;
    }

    clearCache() {
        this.cache.clear();
    }

    showError(message) {
        // Implement error notification
        console.error(message);
    }

    // Fallback data methods
    getFallbackMetrics() {
        return {
            totalLeads: 0,
            conversions: 0,
            revenue: 0,
            conversionRate: 0,
            leadsChange: 0,
            conversionChange: 0,
            revenueChange: 0,
            dealsChange: 0,
            chartData: { labels: [], leads: [], conversions: [] }
        };
    }

    getFallbackActivities() {
        return [];
    }

    getFallbackTasks() {
        return [];
    }

    getFallbackLeads() {
        return [];
    }

    // Modal methods (implement based on your modal system)
    showAddLeadModal() {
        console.log('Show add lead modal');
    }

    showScheduleCallModal() {
        console.log('Show schedule call modal');
    }

    showEmailModal() {
        console.log('Show email modal');
    }

    showMeetingModal() {
        console.log('Show meeting modal');
    }

    showAnalyticsModal() {
        console.log('Show analytics modal');
    }

    // Cleanup
    destroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        if (this.chart) this.chart.destroy();
        if (this.animationObserver) this.animationObserver.disconnect();
    }
}

// Export for global use
window.Dashboard = Dashboard;
