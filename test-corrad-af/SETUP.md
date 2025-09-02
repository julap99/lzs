# corradAF Setup Guide

This guide will help you set up the corradAF framework template for your new project.

## 🚀 Quick Setup

### 1. Environment Configuration

Create a `.env` file in your project root with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
AUTH_ORIGIN="http://localhost:3000"

# Application
NUXT_SECRET_KEY="your-nuxt-secret-key-for-session-encryption"
APP_NAME="Your Application Name"
APP_URL="http://localhost:3000"

# Email Configuration (Optional)
MAIL_HOST="smtp.example.com"
MAIL_PORT="587"
MAIL_USERNAME="your-email@example.com"
MAIL_PASSWORD="your-email-password"
MAIL_FROM_ADDRESS="noreply@yourapp.com"
MAIL_FROM_NAME="Your App Name"

# Development
NODE_ENV="development"
NUXT_HOST="localhost"
NUXT_PORT="3000"
```

### 2. Database Setup

corradAF uses Prisma as the ORM. Follow these steps:

1. **Configure your database URL** in the `.env` file
2. **Run database setup**:
   ```bash
   yarn prisma
   # This runs: npx prisma db pull && npx prisma generate && nuxt dev
   ```

### 3. First Run

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

## 🔧 Development Tools Access

After setup, you can access these development tools:

- **User Management**: `/devtool/user-management/user`
- **Menu Editor**: `/devtool/menu-editor`
- **API Editor**: `/devtool/api-editor`
- **Content Editor**: `/devtool/content-editor`
- **Code Playground**: `/devtool/code-playground`
- **ORM Tools**: `/devtool/orm`
- **Configuration**: `/devtool/config`

## 🎨 Customization

### Update Branding

1. **App Name**: Update in `.env` file (`APP_NAME`)
2. **Colors**: Modify `tailwind.config.js`
3. **Logo**: Replace files in `public/` directory
4. **Favicon**: Replace `public/favicon.ico`

### Navigation Structure

Edit the navigation configuration in `navigation/` directory to customize menus.

### Authentication

The authentication system is ready to use with:
- User registration at `/register`
- Login at `/login`
- Password recovery at `/forgot-password`

## 📦 Production Deployment

### Environment Variables

Ensure these production environment variables are set:

```env
NODE_ENV="production"
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
AUTH_ORIGIN="https://yourdomain.com"
NUXT_SECRET_KEY="your-production-secret-key"
```

### Build Commands

```bash
# Build for production
yarn build

# Preview production build locally
yarn preview
```

## 🛠️ Extending the Framework

### Adding New Development Tools

1. Create new page in `pages/devtool/your-tool/`
2. Add navigation entry
3. Implement functionality

### Custom Components

Add your custom components in `components/` directory following the existing structure.

### API Endpoints

Create server routes in `server/api/` directory.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**: Verify DATABASE_URL in `.env`
2. **Authentication Problems**: Check JWT_SECRET configuration
3. **Build Errors**: Ensure all dependencies are installed with `yarn install`
4. **Port Conflicts**: Change NUXT_PORT in `.env` file

### Getting Help

- Check the main README.md for detailed documentation
- Review existing development tools for implementation examples
- Create issues in the repository for bugs or feature requests

## 📝 Next Steps

After setup:

1. Customize the dashboard welcome page with your project branding
2. Set up your project-specific features
3. Configure authentication and user roles
4. Start building your application features

Happy coding with corradAF! 🚀 