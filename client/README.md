# NexusCommerce Frontend

A modern, feature-rich e-commerce frontend built with Next.js 16, TypeScript, and Tailwind CSS.

## Overview

This is a production-ready e-commerce platform with a modular architecture supporting products, shopping carts, user authentication, and admin features.

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand
- **UI Components:** shadcn/ui
- **Icons:** Lucide Icons
- **Animations:** Framer Motion

## Project Structure

```
/app                    # Next.js app router pages
/components
  /global             # Header, Footer, Layout components
  /ui                 # Atomic UI components (shadcn)
/modules                # Feature modules
  /catalog            # Product browsing & searching
  /cart               # Shopping cart management
  /auth               # User authentication
  /engagement         # Comments, ratings, wishlist
  /inventory          # Stock & variant tracking
  /admin              # Store management
/lib                    # Utilities & helpers
  - utils.ts          # Common functions
  - api.ts           # API client (placeholder)
/public                 # Static assets
```

## Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## Features

### Implemented

- ✅ Product catalog with filtering and search
- ✅ Shopping cart with optimistic updates
- ✅ User authentication (sign in / sign up)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Admin dashboard scaffold

### Scaffolded (Ready for backend integration)

- 📋 Comments & ratings system
- ❤️ Wishlist functionality
- 📦 Inventory & variant management
- 🛠️ Admin CRUD operations

## Module Architecture

Each module follows this pattern:

1. **types.ts** - TypeScript interfaces
2. **actions.server.ts** - Next.js Server Actions for API calls
3. **store.ts** - Zustand store for client state
4. **hooks.ts** - Custom React hooks
5. **components/** - React components
6. **page.tsx** - Next.js pages

### Example: Adding to Cart

```tsx
import { useAddToCart } from "@/modules/cart/hooks"

export function ProductCard({ product }) {
  const { addToCart } = useAddToCart()

  return (
    <button onClick={() => addToCart(product, 1)}>
      Add to Cart
    </button>
  )
}
```

## API Integration

The frontend connects to a NestJS backend at `http://localhost:4000`.

### Expected Endpoints

#### Catalog Module
- `GET /catalog/products` - List products
- `GET /catalog/products/:slug` - Get product
- `GET /catalog/categories` - List categories
- `POST /catalog/products/:id/stock` - Validate stock

#### Auth Module
- `POST /auth/sign-in` - Sign in
- `POST /auth/sign-up` - Register
- `POST /auth/sign-out` - Sign out
- `GET /auth/session` - Get current session

#### Cart Module
- `POST /catalog/products/:id/stock` - Check stock

#### Engagement Module
- `GET /engagement/comments` - Get comments
- `POST /engagement/comments` - Add comment
- `POST /engagement/wishlist` - Add to wishlist

## Error Handling

All server actions include try-catch with user-friendly error messages:

```tsx
const result = await getProducts({ category: "electronics" })

if (result.error) {
  console.error(result.error.message)
}

if (result.data) {
  setProducts(result.data.products)
}
```

## State Management

### Zustand Stores

Each module has a Zustand store for client-side state:

- `useCatalogStore` - Products, filters, pagination
- `useCartStore` - Cart items, totals
- `useAuthStore` - User, authentication
- `useEngagementStore` - Comments, wishlist
- `useInventoryStore` - Stock information

Stores persist to localStorage for session continuity.

## UI Components

### Custom E-commerce Components

- `<ProductCard />` - Product display with image, price, rating
- `<ProductGrid />` - Responsive grid layout
- `<PriceDisplay />` - Formatted price with discount
- `<StockBadge />` - In-stock / low-stock indicators
- `<QuantitySelector />` - Increment/decrement input
- `<ProductRating />` - Star rating display
- `<CartSummary />` - Order totals and checkout

### Design System

- Color tokens defined in CSS variables
- Consistent spacing scale (4px base)
- Responsive typography
- Smooth transitions & animations

## Development

### Adding a New Module

1. Create folder: `/modules/feature-name/`
2. Add files: `types.ts`, `actions.server.ts`, `store.ts`, `hooks.ts`
3. Create `components/` subdirectory
4. Export hooks from `hooks.ts`
5. Create page in `/app/feature-name/page.tsx`

### Running Tests

```bash
npm run test
npm run test:watch
```

### Building

```bash
npm run build
npm start
```

## Deployment

Deploy to Vercel with one click:

```bash
vercel deploy
```

Environment variables are configured in the Vercel dashboard.

## Error Handling Strategy

1. **Type Validation** - TypeScript ensures type safety
2. **Server Actions** - All API calls wrapped with error handling
3. **User Feedback** - Toast notifications for user actions
4. **Fallback States** - Empty, loading, and error states for all async operations
5. **Optimistic Updates** - Cart updates without waiting for server

## Performance

- Next.js Image Optimization
- Code splitting per route
- Zustand for minimal re-renders
- Debounced search input
- Lazy-loaded product images

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Create a feature branch
2. Follow the module architecture
3. Test in development before pushing
4. Create a pull request

## License

MIT

## Support

For issues or questions, create a GitHub issue or contact support@nexuscommerce.com.

---

**Built with v0 and ❤️**
