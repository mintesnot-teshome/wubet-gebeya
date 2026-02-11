# Wubet Gebeya 🛒

A modern, full-stack e-commerce platform built with Laravel and React. Wubet Gebeya (ውበት ገበያ) means "Beautiful Marketplace" in Amharic, offering a seamless shopping experience with a robust backend and an elegant, responsive frontend.

## ✨ Features

- 🛍️ **Product Browsing**: Browse products with search, filtering, and detailed product views
- 🛒 **Shopping Cart**: Add items to cart, update quantities, and manage cart items
- 💳 **Checkout System**: Secure checkout with order summary and tax calculation
- 📦 **Order Management**: Track orders and view order history
- 👤 **User Authentication**: Secure user registration and login system
- 🔐 **Admin Dashboard**: Manage products, categories, and inventory
- 🔍 **Search & Suggestions**: Real-time search with autocomplete suggestions
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🎨 **Modern UI**: Beautiful interface with Chakra UI and Radix UI components

## 🚀 Tech Stack

### Backend
- **Laravel 12** - PHP web application framework
- **PHP 8.2+** - Server-side programming language
- **SQLite/MySQL** - Database (SQLite by default)
- **Inertia.js** - Modern monolith architecture
- **Laravel Sanctum** - API authentication

### Frontend
- **React 19** - JavaScript library for building user interfaces
- **TypeScript** - Type-safe JavaScript
- **Inertia.js React** - Server-side routing with client-side navigation
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Chakra UI** - Component library
- **Radix UI** - Unstyled, accessible components
- **Redux** - State management
- **Framer Motion** - Animation library

### Development Tools
- **Pest** - Testing framework for PHP
- **ESLint** - JavaScript linter
- **Prettier** - Code formatter
- **TypeScript** - Type checking

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP** >= 8.2
- **Composer** - PHP dependency manager
- **Node.js** >= 18.x
- **npm** or **yarn** - Node package manager
- **SQLite** (or MySQL/PostgreSQL if preferred)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mintesnot-teshome/wubet-gebeya.git
cd wubet-gebeya
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node Dependencies

```bash
npm install
```

### 4. Environment Setup

Copy the example environment file and generate application key:

```bash
cp .env.example .env
php artisan key:generate
```

### 5. Configure Database

The application uses SQLite by default. Create the database file:

```bash
touch database/database.sqlite
```

Or edit `.env` to use MySQL/PostgreSQL:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 6. Run Database Migrations

```bash
php artisan migrate
```

### 7. (Optional) Seed Database

```bash
php artisan db:seed
```

## 🚀 Running the Application

### Development Mode

The easiest way to run the application in development is using the composer script:

```bash
composer dev
```

This will start:
- Laravel development server (http://localhost:8000)
- Queue worker
- Vite dev server with hot module replacement

Alternatively, you can run services separately in different terminals:

```bash
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - Vite dev server
npm run dev

# Terminal 3 - Queue worker (if needed)
php artisan queue:listen
```

### Production Build

Build assets for production:

```bash
npm run build
```

For SSR (Server-Side Rendering):

```bash
npm run build:ssr
composer dev:ssr
```

## 🛠️ Available Scripts

### PHP/Laravel Scripts

```bash
# Run development servers
composer dev

# Run with SSR
composer dev:ssr

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Seed database
php artisan db:seed

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run tests
php artisan test
# or
./vendor/bin/pest

# Code formatting (Laravel Pint)
./vendor/bin/pint
```

### Node/Frontend Scripts

```bash
# Development server with HMR
npm run dev

# Build for production
npm run build

# Build for SSR
npm run build:ssr

# Type checking
npm run types

# Linting
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## 📁 Project Structure

```
wubet-gebeya/
├── app/                    # Laravel application code
│   ├── Http/              # Controllers, Middleware
│   ├── Models/            # Eloquent models
│   └── Providers/         # Service providers
├── bootstrap/             # Laravel bootstrap files
├── config/                # Configuration files
├── database/              # Migrations, seeders, factories
│   ├── migrations/        # Database migrations
│   └── seeders/           # Database seeders
├── public/                # Public assets
├── resources/             # Frontend resources
│   ├── css/              # Global styles
│   ├── js/               # React application
│   │   ├── components/   # Reusable components
│   │   ├── layouts/      # Layout components
│   │   ├── pages/        # Page components
│   │   ├── Redux/        # Redux store
│   │   ├── services/     # API services
│   │   └── types/        # TypeScript types
│   └── views/            # Blade templates
├── routes/                # Application routes
│   ├── web.php           # Web routes
│   ├── api.php           # API routes
│   ├── auth.php          # Authentication routes
│   └── settings.php      # Settings routes
├── storage/               # Storage files
├── tests/                 # Test files
├── .env.example           # Example environment file
├── composer.json          # PHP dependencies
├── package.json           # Node dependencies
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## 🗄️ Database Schema

The application includes the following main tables:

- **users** - User accounts and authentication
- **products** - Product catalog with pricing and details
- **cart_items** - Shopping cart items
- **orders** - Customer orders
- **order_items** - Items in each order
- **sessions** - User sessions
- **cache** - Application cache
- **jobs** - Queue jobs

## 🔐 Authentication

The application uses Laravel's built-in authentication system with Inertia.js:

- Registration at `/signup`
- Login at `/login`
- Password reset functionality
- Protected routes with authentication middleware

## 🌐 API Endpoints

### Public Endpoints
- `GET /` - Home page
- `GET /products` - Product listing
- `GET /products/{id}` - Product details
- `GET /search` - Search products
- `GET /search/suggestions` - Search suggestions

### Authenticated Endpoints
- `GET /cart` - View cart
- `POST /cart/add` - Add to cart
- `PUT /cart/update/{id}` - Update cart item
- `DELETE /cart/remove/{id}` - Remove from cart
- `DELETE /cart/clear` - Clear cart
- `GET /checkout` - Checkout page
- `POST /orders` - Create order
- `GET /orders` - Order history
- `GET /orders/{order}` - Order details

### Admin Endpoints
- `GET /admin/dashboard` - Admin dashboard
- Resource routes for product management

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/ProductTest.php

# Run with coverage
php artisan test --coverage
```

## 🎨 Code Style

The project uses:
- **Laravel Pint** for PHP code formatting
- **Prettier** for JavaScript/TypeScript formatting
- **ESLint** for JavaScript/TypeScript linting

Format code:

```bash
# PHP
./vendor/bin/pint

# JavaScript/TypeScript
npm run format
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Mintesnot Teshome - [GitHub](https://github.com/mintesnot-teshome)

## 🙏 Acknowledgments

- Laravel Framework
- React Team
- Inertia.js Team
- All contributors and open-source projects used in this application

---

Made with ❤️ by Mintesnot Teshome
