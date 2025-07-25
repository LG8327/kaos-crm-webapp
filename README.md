# KAOS CRM Web Application

A modern web-based CRM solution for territory management, lead tracking, and sales analytics. This Next.js application complements the existing iOS app by providing web access to the same core business logic and features.

**🔄 Updated**: Environment variables configured for production deployment

## 🌟 Features

### Territory Management
- **Interactive Territory Mapping**: Visual territory boundaries with map integration
- **Territory Assignment**: Assign sales representatives to specific geographic areas
- **Boundary Drawing**: Define custom territory boundaries with GPS coordinates
- **Territory Analytics**: Performance metrics per territory

### Lead Management
- **Comprehensive Lead Tracking**: Full lead lifecycle management
- **Contact Management**: Store and organize customer information
- **Lead Activities**: Track calls, emails, meetings, and notes
- **Lead Prioritization**: High, medium, low priority classifications
- **Status Pipeline**: New → Contacted → Qualified → Proposal → Closed (Won/Lost)

### Dashboard & Analytics
- **Real-time Dashboard**: Key performance indicators and metrics
- **Sales Reports**: Customizable reporting and analytics
- **Performance Tracking**: Conversion rates, revenue tracking
- **Team Management**: User roles and permissions

### Integration Ready
- **Database Sync**: Supabase integration for real-time data sync
- **API Support**: RESTful API for third-party integrations  
- **Cross Platform**: Shares business logic with iOS app
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🚀 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel/Netlify ready
- **Maps**: Mapbox/Google Maps integration (planned)

## 📁 Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── dashboard/    # Dashboard and analytics
│   ├── territories/  # Territory management
│   ├── leads/        # Lead tracking and management
│   ├── auth/         # Authentication pages
│   └── globals.css   # Global styles
├── components/       # Reusable UI components
├── lib/             # Utility functions and configurations
├── types/           # TypeScript type definitions
├── hooks/           # Custom React hooks
└── styles/          # Additional styling
```

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

## 📱 Shared Business Logic

This web app shares core business logic with the iOS Swift app:

### Data Models
- **User**: Authentication and role management
- **Territory**: Geographic boundaries and assignments  
- **Lead**: Customer information and tracking
- **Meeting**: Scheduled appointments and calls
- **LeadActivity**: Notes, tasks, and interactions
- **Promotion**: Marketing campaigns and offers

### API Compatibility
- RESTful endpoints compatible with iOS app
- Real-time sync via Supabase
- Consistent data validation and business rules
- Shared authentication system

## 🔧 Configuration

### Tailwind CSS Theme
Custom color scheme matching the iOS app:
- Primary: Blue shades for main actions
- Secondary: Gray shades for secondary elements
- Success: Green for positive states
- Warning: Orange/Yellow for alerts
- Error: Red for error states

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured (`@/` for `src/`)
- Strong typing for all data models
- Comprehensive interface definitions

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Manual Deployment
```bash
# Build the application
npm run build

# Serve static files from `out/` directory
```

## 🤝 Integration with iOS App

### Shared Features
- **Authentication**: Same user accounts and permissions
- **Data Sync**: Real-time synchronization via Supabase
- **Business Logic**: Consistent validation and workflows
- **API Endpoints**: Compatible REST API design

### Complementary Features
- **Web Access**: Desktop/laptop productivity
- **Bulk Operations**: Easy data import/export
- **Reporting**: Advanced analytics and dashboard
- **Admin Panel**: User and system management

## 📊 Performance

- **Fast Loading**: Optimized with Next.js SSR/SSG
- **Responsive**: Mobile-first design approach
- **SEO Optimized**: Meta tags and structured data
- **Type Safe**: Full TypeScript coverage
- **Error Handling**: Comprehensive error boundaries

## 🔒 Security

- **Authentication**: Secure user authentication via Supabase
- **Authorization**: Role-based access control
- **Data Validation**: Server-side and client-side validation
- **HTTPS**: Secure data transmission
- **Environment Variables**: Sensitive data protection

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Basic project structure
- ✅ Dashboard with key metrics
- ✅ Territory list and management
- ✅ TypeScript interfaces
- 🔄 Lead management interface

### Phase 2 (Next)
- 🔄 Interactive map integration
- 🔄 Supabase database integration
- 🔄 Authentication system
- 🔄 Real-time data sync

### Phase 3 (Future)
- 📋 Advanced reporting and analytics
- 📋 Bulk import/export functionality
- 📋 Mobile app PWA features
- 📋 Third-party integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software for KAOS CRM system.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Contact the development team

---

**Note**: This web application is designed to work seamlessly with the existing iOS KAOS CRM app, sharing the same database and business logic while providing web-based access to core CRM functionality.
