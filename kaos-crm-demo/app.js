// Main application logic
class KaosCRM {
    constructor() {
        this.isLoaded = false;
        this.user = null;
        this.dashboard = null;
        this.init();
    }

    async init() {
        this.showLoadingScreen();
        await this.simulateLoading();
        await this.initializeSupabase();
        await this.loadUser();
        this.hideLoadingScreen();
        this.setupGlobalEventListeners();
        this.updateGreeting();
        this.checkNetworkStatus();
        this.initializeDashboard();
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainApp = document.getElementById('main-app');
        
        if (loadingScreen) loadingScreen.style.display = 'flex';
        if (mainApp) mainApp.classList.add('hidden');
    }

    async simulateLoading() {
        // Simulate app initialization
        return new Promise(resolve => {
            setTimeout(resolve, 2000);
        });
    }

    async initializeSupabase() {
        try {
            // Wait for Supabase client to initialize
            if (window.supabaseClient) {
                await window.supabaseClient.initializeAuth();
            }
        } catch (error) {
            console.error('Supabase initialization error:', error);
        }
    }

    async loadUser() {
        // Try to load from localStorage first
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
            this.user = JSON.parse(storedUser);
        } else {
            // Fallback user data
            this.user = {
                name: 'Demo User',
                email: 'demo@kaoscrm.com',
                avatar: 'DU'
            };
        }
        
        // Update UI with user data
        const userInitial = document.getElementById('userInitial');
        const userName = document.getElementById('userName');
        
        if (userInitial) userInitial.textContent = this.user.name.charAt(0).toUpperCase();
        if (userName) userName.textContent = this.user.name.split(' ')[0];
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainApp = document.getElementById('main-app');
        
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
            
            if (mainApp) {
                mainApp.classList.remove('hidden');
                mainApp.style.opacity = '1';
            }
            
            this.isLoaded = true;
        }, 100);
    }

    initializeDashboard() {
        // Initialize dashboard after app is loaded
        setTimeout(() => {
            this.dashboard = new Dashboard();
            window.dashboard = this.dashboard;
        }, 600);
    }

    setupGlobalEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Network status
        window.addEventListener('online', () => {
            this.updateNetworkStatus(true);
        });

        window.addEventListener('offline', () => {
            this.updateNetworkStatus(false);
        });

        // Page visibility
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Global error handling
        window.addEventListener('error', (e) => {
            this.handleGlobalError(e);
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.handleGlobalError(e);
        });
    }

    handleKeyboardShortcuts(e) {
        // Cmd/Ctrl + K for quick search
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            this.openQuickSearch();
        }

        // Escape to close modals
        if (e.key === 'Escape') {
            this.closeModals();
        }

        // Arrow keys for navigation
        if (e.key === 'ArrowLeft' && e.metaKey) {
            e.preventDefault();
            this.navigateBack();
        }

        if (e.key === 'ArrowRight' && e.metaKey) {
            e.preventDefault();
            this.navigateForward();
        }

        // Quick actions
        if (e.altKey && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const actions = ['add-lead', 'schedule-call', 'send-email', 'new-meeting', 'view-reports'];
            const actionIndex = parseInt(e.key) - 1;
            if (this.dashboard && actions[actionIndex]) {
                this.dashboard.handleQuickAction(actions[actionIndex]);
            }
        }
    }

    handleResize() {
        // Handle responsive adjustments
        const width = window.innerWidth;
        
        if (width < 768) {
            this.switchToMobileView();
        } else {
            this.switchToDesktopView();
        }

        // Resize chart if dashboard is loaded
        if (this.dashboard && this.dashboard.chart) {
            this.dashboard.chart.resize();
        }
    }

    updateNetworkStatus(isOnline) {
        const networkStatus = document.getElementById('networkStatus');
        if (!networkStatus) return;

        const indicator = networkStatus.querySelector('.status-indicator');
        const text = networkStatus.querySelector('span');

        if (isOnline) {
            indicator.classList.remove('offline');
            indicator.classList.add('online');
            text.textContent = 'Online';
            
            // Sync data when coming back online
            if (this.dashboard) {
                this.dashboard.refresh();
            }
        } else {
            indicator.classList.remove('online');
            indicator.classList.add('offline');
            text.textContent = 'Offline';
        }
    }

    checkNetworkStatus() {
        this.updateNetworkStatus(navigator.onLine);
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden
            this.pauseRealtimeUpdates();
        } else {
            // Page is visible
            this.resumeRealtimeUpdates();
            
            // Refresh dashboard data when page becomes visible
            if (this.dashboard) {
                this.dashboard.refresh();
            }
        }
    }

    handleGlobalError(error) {
        console.error('Global error:', error);
        
        // Show user-friendly error message
        this.showNotification('Something went wrong. Please refresh the page.', 'error');
    }

    updateGreeting() {
        const greetingText = document.getElementById('greetingText');
        if (!greetingText) return;

        const hour = new Date().getHours();
        let greeting;

        if (hour < 12) {
            greeting = 'Good morning,';
        } else if (hour < 17) {
            greeting = 'Good afternoon,';
        } else {
            greeting = 'Good evening,';
        }

        greetingText.textContent = greeting;
    }

    openQuickSearch() {
        console.log('Opening quick search...');
        // In a real app, this would open a search modal
        this.showNotification('Quick search (Cmd/Ctrl + K)', 'info');
    }

    closeModals() {
        // Close any open modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    navigateBack() {
        console.log('Navigate back');
        // In a real app, this would handle history
        this.showNotification('Navigate back (Cmd/Ctrl + ←)', 'info');
    }

    navigateForward() {
        console.log('Navigate forward');
        // In a real app, this would handle history
        this.showNotification('Navigate forward (Cmd/Ctrl + →)', 'info');
    }

    switchToMobileView() {
        document.body.classList.add('mobile-view');
        document.body.classList.remove('desktop-view');
    }

    switchToDesktopView() {
        document.body.classList.add('desktop-view');
        document.body.classList.remove('mobile-view');
    }

    pauseRealtimeUpdates() {
        // Pause any real-time data updates
        console.log('Pausing real-time updates');
        if (this.dashboard) {
            // Dashboard will handle its own subscription management
        }
    }

    resumeRealtimeUpdates() {
        // Resume real-time data updates
        console.log('Resuming real-time updates');
        if (this.dashboard) {
            // Dashboard will handle its own subscription management
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Color mapping
        const colors = {
            info: CONFIG.CHART_COLORS.primary,
            success: CONFIG.CHART_COLORS.success,
            warning: CONFIG.CHART_COLORS.warning,
            error: CONFIG.CHART_COLORS.danger
        };
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '12px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-out',
            background: colors[type] || colors.info,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after duration based on type
        const duration = type === 'error' ? 5000 : 3000;
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    // Utility methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(new Date(date));
    }

    formatTime(date) {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).format(new Date(date));
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Performance monitoring
    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
        return result;
    }

    // Local storage helpers
    setStorageItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error storing data:', error);
        }
    }

    getStorageItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error retrieving data:', error);
            return defaultValue;
        }
    }

    // Cleanup
    destroy() {
        if (this.dashboard) {
            this.dashboard.destroy();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.kaosCRM = new KaosCRM();
});

// Add some utility styles for completed tasks and enhanced features
const style = document.createElement('style');
style.textContent = `
    .task-title.completed {
        text-decoration: line-through;
        opacity: 0.6;
    }
    
    .task-checkbox {
        cursor: pointer;
        transition: all 0.2s ease;
        border-radius: 6px;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .task-checkbox:hover {
        transform: scale(1.1);
    }
    
    .notification {
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .mobile-view .quick-actions-grid {
        overflow-x: auto;
        padding: 0 var(--spacing-md);
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    
    .mobile-view .quick-actions-grid::-webkit-scrollbar {
        display: none;
    }
    
    .desktop-view .quick-actions-grid {
        overflow-x: visible;
        justify-content: center;
    }
    
    .mobile-view .metrics-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
    }
    
    .mobile-view .activity-tasks-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
    }
    
    .mobile-view .leads-grid {
        grid-template-columns: 1fr;
    }
    
    .activity-item,
    .task-item {
        cursor: pointer;
    }
    
    .activity-item:active,
    .task-item:active {
        transform: scale(0.98);
    }
    
    .metric-card:active {
        transform: scale(0.98);
    }
    
    .quick-action-card:active {
        transform: scale(0.95) translateY(-2px);
    }
    
    /* Loading states */
    .loading-skeleton {
        background: linear-gradient(90deg, 
            var(--bg-secondary) 25%, 
            var(--bg-tertiary) 50%, 
            var(--bg-secondary) 75%);
        background-size: 200% 100%;
        animation: loading-shimmer 1.5s infinite;
        border-radius: var(--radius-md);
    }
    
    @keyframes loading-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
    
    /* Error states */
    .error-state {
        color: var(--text-tertiary);
        text-align: center;
        padding: var(--spacing-xl);
    }
    
    .error-state i {
        font-size: var(--font-size-2xl);
        margin-bottom: var(--spacing-md);
        opacity: 0.5;
    }
    
    /* Success states */
    .success-state {
        color: var(--uber-green);
        text-align: center;
        padding: var(--spacing-xl);
    }
    
    /* Enhanced accessibility */
    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
    
    /* Focus indicators */
    .quick-action-card:focus,
    .time-frame-btn:focus,
    .nav-item:focus,
    .fab:focus {
        outline: 2px solid var(--uber-green);
        outline-offset: 2px;
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
        :root {
            --border-primary: rgba(255, 255, 255, 0.3);
            --border-secondary: rgba(255, 255, 255, 0.5);
            --text-secondary: rgba(255, 255, 255, 0.9);
            --text-tertiary: rgba(255, 255, 255, 0.8);
        }
    }
`;
document.head.appendChild(style);

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator && CONFIG.ENVIRONMENT === 'production') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
