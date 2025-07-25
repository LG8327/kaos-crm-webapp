# KAOS CRM - Role-Based Authorization Flow

## 🔐 **Authentication & Authorization Overview**

The KAOS CRM system implements a comprehensive role-based access control (RBAC) system with territory-based data filtering for sales representatives.

## 👥 **User Roles & Permissions**

### **Admin Role**
- **Access**: Everything
- **Pages**: Dashboard, Leads, Territories, Management, Admin, Settings
- **Permissions**:
  - View all territories and leads
  - Manage users and roles
  - Full admin access
- **Default Landing**: `/admin` page

### **Manager Role**  
- **Access**: Team management and oversight
- **Pages**: Dashboard, Leads, Territories, Management, Settings
- **Permissions**:
  - View all territories and leads
  - Manage team performance
  - Territory assignment oversight
  - NO user/role management
- **Default Landing**: `/management` page

### **Sales Rep Role**
- **Access**: Limited to assigned territories
- **Pages**: Dashboard, Leads, Territories, Settings
- **Permissions**:
  - View ONLY assigned territories
  - View ONLY leads in assigned territories
  - NO management or admin access
- **Default Landing**: `/leads` page

### **HR Role**
- **Access**: User management + operational view
- **Pages**: Dashboard, Leads, Territories, Admin, Settings  
- **Permissions**:
  - View all territories and leads
  - Manage users and roles
  - Full admin access
- **Default Landing**: `/admin` page

## 🔄 **Authentication Flow**

### **1. Login Process**
```
User enters credentials → Supabase Auth → Fetch user profile → Create session → Redirect by role
```

### **2. Session Management**
- **Storage**: localStorage for persistence
- **Data Stored**: User profile, role, territories, tokens
- **Auto-refresh**: Supabase handles token refresh

### **3. Role-Based Redirect**
- **Admin/HR**: → `/admin` (User management)
- **Manager**: → `/management` (Team oversight) 
- **Sales Rep**: → `/leads` (Their main workflow)

## 🗺️ **Territory-Based Data Filtering**

### **Sales Rep Restrictions**
```typescript
// Sales reps only see their assigned territories
const territories = await authService.getFilteredTerritories();
// Returns: territories WHERE user_id = currentUser.id

// Sales reps only see leads in their territories  
const leads = await authService.getFilteredLeads();
// Returns: leads WHERE territory_id IN (user's assigned territories)
```

### **Manager/Admin Access**
```typescript
// Managers and admins see everything
const territories = await authService.getFilteredTerritories();
// Returns: ALL territories (no filtering)

const leads = await authService.getFilteredLeads();
// Returns: ALL leads (no filtering)
```

## 🎯 **Page Access Control**

### **Navigation Visibility**
```typescript
// Each role sees different navigation tabs
const visibleTabs = ROLE_PERMISSIONS[userRole].pages;

// Examples:
// Admin: ['dashboard', 'leads', 'territories', 'management', 'admin', 'settings']
// Manager: ['dashboard', 'leads', 'territories', 'management', 'settings']  
// Sales Rep: ['dashboard', 'leads', 'territories', 'settings']
```

### **Page Protection**
```typescript
// Every protected page checks authorization
if (!authService.canAccessPage(pageId)) {
  redirect('/dashboard'); // or appropriate default
}
```

## 📊 **Data Access Examples**

### **Territory View for Sales Rep**
```typescript
// Sales rep "john@kaos.com" assigned to territories T1, T3
const territories = await authService.getFilteredTerritories();
// SQL: SELECT * FROM territories WHERE id IN ('T1', 'T3')

// Map shows only T1 and T3 boundaries
<TerritoryMap territories={filteredTerritories} />
```

### **Lead Management for Sales Rep**
```typescript
// Shows only leads in assigned territories
const leads = await authService.getFilteredLeads();
// SQL: SELECT * FROM leads WHERE territory_id IN ('T1', 'T3')

// Lead count: "You have 23 leads" (only in T1, T3)
```

### **Manager Override**
```typescript
// Manager sees everything
const allTerritories = await authService.getFilteredTerritories();
// SQL: SELECT * FROM territories (no WHERE clause)

const allLeads = await authService.getFilteredLeads();  
// SQL: SELECT * FROM leads (no WHERE clause)
```

## 🚀 **Implementation Guide**

### **1. Update Database Schema**
```sql
-- Add territory assignments to users table
ALTER TABLE users ADD COLUMN assigned_territories TEXT[];

-- Example user records:
INSERT INTO users (email, role, assigned_territories) VALUES
('admin@kaos.com', 'admin', NULL),
('manager@kaos.com', 'manager', NULL),
('sales1@kaos.com', 'sales_rep', ARRAY['T1', 'T3']),
('sales2@kaos.com', 'sales_rep', ARRAY['T2', 'T4']);
```

### **2. Login Component Integration**
```typescript
// Update LoginView to use new auth service
import { authService } from '../lib/auth-service';

const handleLogin = async () => {
  const result = await authService.signIn(email, password);
  
  if (result.success) {
    // Redirect based on role
    const redirectPath = authService.getDefaultRedirectPath();
    router.push(redirectPath);
  }
};
```

### **3. Page Protection**
```typescript
// Add to each protected page
useEffect(() => {
  const user = authService.getCurrentUser();
  
  if (!user) {
    router.push('/');
    return;
  }
  
  if (!authService.canAccessPage('management')) {
    router.push('/dashboard');
    return;
  }
}, []);
```

### **4. Data Filtering Implementation**
```typescript
// In territory components
const loadTerritories = async () => {
  const { data, error } = await authService.getFilteredTerritories();
  setTerritories(data || []);
};

// In lead components  
const loadLeads = async () => {
  const { data, error } = await authService.getFilteredLeads();
  setLeads(data || []);
};
```

## 📱 **User Experience by Role**

### **Sales Rep Experience**
1. **Login** → Redirected to `/leads`
2. **Navigation**: Dashboard | Leads | Territories | Settings
3. **Territories Page**: Shows only assigned territories on map
4. **Leads Page**: Shows only leads in assigned territories
5. **Dashboard**: Shows metrics for assigned territories only

### **Manager Experience**  
1. **Login** → Redirected to `/management`
2. **Navigation**: Dashboard | Leads | Territories | Management | Settings
3. **Management Page**: Team oversight, territory assignments, performance
4. **All Data**: Can view all territories and leads
5. **No Admin**: Cannot manage users or system settings

### **Admin Experience**
1. **Login** → Redirected to `/admin`
2. **Navigation**: All tabs including Admin
3. **Full Access**: Can view and manage everything
4. **Admin Page**: User management, role assignments, system config

## 🔒 **Security Features**

- **Frontend Route Protection**: Pages check authorization before rendering
- **Backend Data Filtering**: Database queries filtered by role/territory
- **Session Validation**: Tokens validated on each request
- **Role Verification**: Server-side role checks for sensitive operations
- **Territory Isolation**: Sales reps cannot access other territories' data

This system ensures that each user sees only the data and functions appropriate for their role while maintaining a seamless user experience.
