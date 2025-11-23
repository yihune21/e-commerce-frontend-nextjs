# ShopHub - E-Commerce Frontend

A modern, responsive e-commerce frontend built with Next.js 16, React 19, TypeScript, and Tailwind CSS. This application integrates with a Go backend API.

## Features

- **Modern UI/UX**: Responsive design with dark mode support
- **Authentication**: Login, register, forgot password, and password reset with OTP
- **Product Management**: Browse products, search functionality, and product details
- **Shopping Cart**: Add to cart, update quantities, and persistent cart storage
- **Admin Panel**: Product and category management (admin-only)
- **User Profile**: View profile and update password
- **State Management**: Zustand for global state (auth, cart)
- **Form Validation**: React Hook Form for robust form handling
- **API Integration**: Axios with interceptors for token refresh

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Icons**: Lucide React

## Project Structure

```
e-commerce-frontend/
├── app/                      # Next.js app directory
│   ├── auth/                 # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── products/             # Product listing page
│   ├── cart/                 # Shopping cart page
│   ├── admin/                # Admin panel
│   ├── profile/              # User profile page
│   ├── layout.tsx            # Root layout with header/footer
│   └── page.tsx              # Homepage
├── components/               # React components
│   ├── ui/                   # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── Header.tsx            # Navigation header
│   ├── Footer.tsx            # Footer component
│   └── ProductCard.tsx       # Product card component
├── lib/                      # Utilities and configurations
│   ├── api.ts                # API client and endpoints
│   └── config.ts             # App configuration
└── stores/                   # Zustand stores
    ├── authStore.ts          # Authentication state
    └── cartStore.ts          # Shopping cart state
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Go backend API running (see backend documentation)

### Installation

1. Clone the repository:
```bash
cd e-commerce-frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your backend API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Backend API Integration

This frontend integrates with the following backend endpoints:

### Authentication
- `POST /v1/user` - Register new user
- `GET /v1/login` - Login (Basic Auth)
- `POST /v1/logout` - Logout
- `POST /v1/refreshToken` - Refresh access token
- `PATCH /v1/update-password` - Update password
- `POST /v1/send-otp` - Request password reset OTP
- `POST /v1/verify-otp` - Verify OTP and reset password

### Products
- `GET /v1/product` - Get products (optional name filter)
- `POST /v1/product` - Create product (admin only)
- `PATCH /v1/product-price` - Update product price (admin only)
- `PATCH /v1/product-image` - Update product image (admin only)
- `DELETE /v1/product` - Delete product (admin only)

### Categories
- `POST /v1/category` - Create category (admin only)
- `PATCH /v1/category` - Update category (admin only)

### Cart
- `POST /v1/cart` - Add item to cart

### Admin
- `POST /v1/admin` - Create admin user (admin only)
- `POST /v1/delete-user` - Delete user (admin only)

## Key Features

### Authentication Flow
- JWT-based authentication with access and refresh tokens
- Automatic token refresh on 401 responses
- Persistent auth state using Zustand with localStorage

### Cart Management
- Client-side cart state with Zustand
- Persistent cart using localStorage
- Real-time cart updates and totals

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile navigation
- Grid layouts that adapt to screen sizes
- Dark mode support throughout

### Admin Features
- Protected admin routes
- Product CRUD operations
- Category management
- User management

## Deployment

### Build for Production

```bash
pnpm build
pnpm start
```

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8080` |

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License
