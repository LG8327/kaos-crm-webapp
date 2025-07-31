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
            return this.cache.get(cacheKey).data;
        }

        try {
            const metrics = window.supabaseClient ? await window.supabaseClient.fetchMetrics(this.currentTimeframe) : this.getFallbackMetrics();
            
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

        // Use CONFIG if available, otherwise fallback colors
        const primaryColor = (window.CONFIG?.CHART_COLORS?.primary) || '#00D084';
        const secondaryColor = (window.CONFIG?.CHART_COLORS?.secondary) || '#276EF1';

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Leads',
                    data: chartData.leads,
                    borderColor: primaryColor,
                    backgroundColor: primaryColor + '10',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: primaryColor,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }, {
                    label: 'Conversions',
                    data: chartData.conversions,
                    borderColor: secondaryColor,
                    backgroundColor: secondaryColor + '10',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: secondaryColor,
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

    // Additional helper methods
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
                <div class="activity-icon" style="background: rgba(0, 208, 132, 0.15); color: #00D084;">
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
