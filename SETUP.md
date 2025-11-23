# Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Backend API
Create `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Update the URL to match your Go backend server address.

### 3. Start Development Server
```bash
pnpm dev
```

Visit http://localhost:3000

## Backend Integration Notes

### Authentication
The frontend expects your Go backend to return the following structure on successful login:

```json
{
  "accessToken": "jwt-token-here",
  "refreshToken": "refresh-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user" // or "admin"
  }
}
```

### CORS Configuration
Your Go backend needs to allow CORS requests from http://localhost:3000 (development) and your production domain.

Example Go CORS configuration:
```go
// Add this middleware to your Go backend
app.Use(func(c *fiber.Ctx) error {
    c.Set("Access-Control-Allow-Origin", "http://localhost:3000")
    c.Set("Access-Control-Allow-Credentials", "true")
    c.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    c.Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")

    if c.Method() == "OPTIONS" {
        return c.SendStatus(200)
    }

    return c.Next()
})
```

### API Response Format
Ensure your backend returns consistent error messages:

Success:
```json
{
  "data": { ... }
}
```

Error:
```json
{
  "message": "Error description here"
}
```

## Testing the Integration

### 1. Test User Registration
1. Go to http://localhost:3000/auth/register
2. Fill in the form
3. Check that the request is sent to `POST http://localhost:8080/v1/user`

### 2. Test Login
1. Go to http://localhost:3000/auth/login
2. Enter credentials
3. On success, you should be redirected to the homepage
4. Check that auth token is stored in localStorage

### 3. Test Products
1. Go to http://localhost:3000/products
2. Products should load from `GET http://localhost:8080/v1/product`

### 4. Test Cart
1. Add a product to cart
2. View cart at http://localhost:3000/cart
3. Cart state is stored locally (Zustand + localStorage)

### 5. Test Admin Panel
1. Login as admin user (role: "admin")
2. Visit http://localhost:3000/admin
3. Try creating a product or category

## Common Issues

### Issue: CORS errors
**Solution**: Ensure your Go backend has proper CORS headers configured

### Issue: 401 Unauthorized on every request
**Solution**: Check that tokens are being stored in localStorage and sent in Authorization header

### Issue: Token refresh not working
**Solution**: Verify your backend's `/v1/refreshToken` endpoint returns a new accessToken

### Issue: Products not loading
**Solution**:
1. Check backend is running on the correct port
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check browser console for errors

## Development Tips

### Viewing API Requests
Open browser DevTools > Network tab to monitor all API requests and responses

### State Management
- Auth state: Check `localStorage` for `auth-storage`
- Cart state: Check `localStorage` for `cart-storage`

### Testing Different User Roles
1. Register a normal user (default role: "user")
2. Create an admin user via backend or use the `/v1/admin` endpoint
3. Login with different accounts to test role-based features

## Production Deployment

### Environment Variables
In production, update `.env.local` or set in your hosting platform:
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### Build and Deploy
```bash
pnpm build
pnpm start
```

Or deploy to Vercel/Netlify/etc. and set environment variables in their dashboards.

## Next Steps

1. Test all API endpoints with your Go backend
2. Customize styling and branding
3. Add more features (reviews, ratings, wishlist, etc.)
4. Implement actual checkout/payment integration
5. Add product images and categories from backend
6. Set up analytics and monitoring

## Need Help?

- Check browser console for errors
- Verify backend API is running and accessible
- Test backend endpoints with Postman/Thunder Client first
- Ensure request/response formats match what the frontend expects
