# corradAF - Corrad Application Framework

Welcome to **corradAF**, a comprehensive Nuxt.js template designed for rapid application development. This framework provides a solid foundation with essential development tools, authentication system, and modern UI components.

## 🚀 Features

- **🔐 Complete Authentication System** - Login, Register, Password Recovery, Logout
- **👥 User Management** - User and role management with CRUD operations
- **🛠️ Development Tools Suite** - Comprehensive set of dev tools for rapid development
- **🎨 Modern UI Components** - Built with TailwindCSS and custom components
- **📱 Responsive Design** - Mobile-first approach with modern UX patterns
- **🔧 API Management** - Built-in API endpoint design and testing tools
- **📝 Content Management** - Dynamic content and template management
- **🎯 Menu Configuration** - Easy navigation structure management
- **💻 Code Playground** - In-browser code testing and prototyping
- **🗄️ ORM Integration** - Database schema management tools
- **⚙️ Configuration Management** - System settings and environment setup

## 🛠️ Development Tools Included

### User Management
- User CRUD operations
- Role-based access control
- Permission management

### Menu Editor
- Dynamic navigation configuration
- Hierarchical menu structure
- Permission-based menu visibility

### API Editor
- Design and test API endpoints
- Interactive API documentation
- Request/response testing

### Content Editor
- Dynamic content management
- Template editing
- Content versioning

### Code Playground
- Real-time code testing
- Multiple language support
- Instant preview

### ORM Tools
- Database schema management
- Query builder interface
- Migration tools

### Configuration
- Environment variable management
- System settings
- Feature toggles

## 📋 Prerequisites

- Node.js 18+ 
- Yarn (preferred) or npm
- Database (PostgreSQL/MySQL recommended)

## 🚀 Quick Start

### 1. Clone the Template

```bash
git clone https://git.sena.my/corrad-software/corrad-af-2024.git your-project-name
cd your-project-name
```

### 2. Install Dependencies

```bash
# Using yarn (recommended)
yarn install

# Or using npm
npm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit your environment variables
nano .env
```

Configure your database connection and other environment variables in the `.env` file.

### 4. Database Setup

```bash
# Run database migrations and generate Prisma client
yarn prisma

# Or manually
npx prisma db pull && npx prisma generate
```

### 5. Start Development Server

```bash
yarn dev
```

Your application will be available at `http://localhost:3000`

## 📁 Project Structure

```
├── assets/          # Static assets (images, styles)
├── components/      # Vue components
├── composables/     # Vue composables
├── layouts/         # Application layouts
├── middleware/      # Route middleware
├── navigation/      # Navigation configuration
├── pages/           # Application pages
│   ├── devtool/     # Development tools
│   ├── dashboard/   # Main dashboard
│   ├── login/       # Authentication pages
│   ├── register/    # User registration
│   └── ...
├── plugins/         # Nuxt plugins
├── prisma/          # Database schema and migrations
├── public/          # Public static files
├── server/          # Server-side API
├── stores/          # Pinia stores
└── templates/       # Template files
```

## 🔧 Configuration

### Database
Configure your database connection in the `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

### Authentication
Set up JWT secrets and authentication settings:

```env
JWT_SECRET="your-super-secret-jwt-key"
AUTH_ORIGIN="http://localhost:3000"
```

## 🎨 Customization

### Theme Configuration
Customize colors, fonts, and spacing in:
- `tailwind.config.js` - TailwindCSS configuration
- `app.config.js` - Application-specific settings

### Adding New Development Tools
1. Create a new page in `pages/devtool/your-tool/`
2. Add navigation entry in the navigation configuration
3. Implement your tool's functionality

## 📖 Documentation

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [FormKit Documentation](https://formkit.com/)

## 🚀 Deployment

### Build for Production

```bash
yarn build
```

### Preview Production Build

```bash
yarn preview
```

### Environment Variables for Production

Ensure all environment variables are properly set in your production environment:

- `DATABASE_URL`
- `JWT_SECRET`
- `AUTH_ORIGIN`
- `NUXT_SECRET_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review the development tools included in the framework

---

**Built with ❤️ using Nuxt 3, TailwindCSS, and modern web technologies.**
