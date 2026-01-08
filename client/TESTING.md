# NexusCommerce Frontend - Testing & Validation Guide

## Quick Start
```bash
npm install
npm run dev
```

Visit `http://localhost:3000` - All features work with **mock data** even without a backend.

---

## Routes & Features Testing

### 1. Homepage (`/`)
- ✅ Hero section with CTA buttons
- ✅ Featured products grid (6 items)
- ✅ Trust badges section
- ✅ Responsive design (mobile, tablet, desktop)

**Test Path:**
```
http://localhost:3000/
```

---

### 2. Catalog / Shop (`/catalog`)
- ✅ Product grid (12 items per page, 3 columns)
- ✅ Filter sidebar (categories, price range)
- ✅ Search functionality (debounced)
- ✅ Sort options (newest, price-low, price-high, popular)
- ✅ Pagination (5 pages max)
- ✅ Empty state handling
- ✅ Loading skeletons
- ✅ Uses mock data by default

**Test Cases:**
```
# View all products
http://localhost:3000/catalog

# Filter by category
http://localhost:3000/catalog?category=electronics

# Search products
Type "headphones" in search bar → Shows 2 results

# Sort by price
Click "Price: Low to High" → Products sorted correctly

# Pagination
Click page 2 → Shows next 12 products
```

**Test Add to Cart from Catalog:**
1. Click on any product card
2. Click "Add to Cart" button
3. See cart counter update in header
4. Cart persists on page refresh (localStorage)

---

### 3. Shopping Cart (`/cart`)
- ✅ Display all cart items
- ✅ Show product images, names, prices
- ✅ Quantity selector (+/- buttons)
- ✅ Remove item button
- ✅ Order summary (subtotal, tax, shipping, total)
- ✅ Proceed to Checkout button
- ✅ Empty cart state
- ✅ Automatic calculations

**Test Cases:**
```
# Add multiple items to cart
1. Go to /catalog
2. Add 3 different products with different quantities
3. Go to /cart
4. Verify all items appear correctly

# Update quantities
1. Click + or - on any item
2. Verify totals update automatically
3. Verify cart persists on refresh

# Remove items
1. Click trash icon
2. Verify item removes immediately
3. Verify totals recalculate

# Empty cart
1. Remove all items
2. See empty state with "Start Shopping" button
```

---

### 4. Authentication

#### Sign In (`/auth/sign-in`)
- ✅ Email input field
- ✅ Password input field
- ✅ "Forgot password?" link
- ✅ Form validation
- ✅ Error handling (mock validation only)
- ✅ Sign up link

**Test Cases:**
```
# Valid submission (mock)
Email: test@example.com
Password: password123
Click "Sign In" → Success (redirects to home)

# Invalid inputs
Empty email → Error: "Email and password are required"
Short password → Shows error

# Sign up link
Click "Sign up" → Navigates to /auth/sign-up
```

#### Sign Up (`/auth/sign-up`)
- ✅ First name input
- ✅ Last name input
- ✅ Email input
- ✅ Password input (min 8 chars)
- ✅ Confirm password
- ✅ Form validation
- ✅ Password mismatch detection
- ✅ Sign in link

**Test Cases:**
```
# Valid submission
First: John
Last: Doe
Email: john@example.com
Password: password123
Confirm: password123
Click "Create Account" → Success

# Invalid passwords
Password: pass123 (too short)
Click "Create Account" → Error: "Password must be at least 8 characters"

# Password mismatch
Password: password123
Confirm: password456
Click "Create Account" → Error: "Passwords do not match"
```

---

### 5. Admin Dashboard (`/admin/dashboard`)
- ✅ Quick action cards (Add Product, Manage Products, etc.)
- ✅ Placeholder stats (Total Products, Low Stock, Revenue)
- ✅ Navigation links

**Test Path:**
```
http://localhost:3000/admin/dashboard
```

---

### 6. Admin - Add Product (`/admin/products/new`)
- ✅ Product form with fields
- ✅ Form validation
- ✅ Submit handling

**Test Path:**
```
http://localhost:3000/admin/products/new
```

---

## Component Testing

### Header
```
Tests:
□ Logo clicks to home
□ Navigation links work (/catalog, /cart, /auth/sign-in)
□ Theme toggle (light/dark mode) switches
□ Cart counter shows correct item count
□ Mobile menu opens/closes
□ Search input appears on large screens
```

### Product Card
```
Tests:
□ Image displays with fallback
□ Product name, description visible
□ Price shows correct formatting
□ Sale badge appears if discount exists
□ Stock badge shows correct status
□ Rating displays if available
□ "Add to Cart" button works
□ Wishlist button clickable
□ Link to product detail works
```

### Cart Item
```
Tests:
□ Product image displays
□ Product name shows
□ Variants display if present
□ Price formats correctly
□ Quantity selector works (+/-)
□ Remove button deletes item
□ Updates totals automatically
```

### Filter Sidebar
```
Tests:
□ Categories load correctly (5 categories)
□ Category checkbox selection works
□ Price slider works
□ Min/max price inputs work
□ Clear Filters button resets everything
□ Mobile toggle works
```

---

## Data Flow Testing

### Mock Data Flow
```
Request → API Timeout/Not Found
  ↓
Falls back to MOCK_PRODUCTS (12 items)
  ↓
All filtering/sorting applied to mock data
  ↓
Data displays in UI
```

### Cart State (Zustand)
```
Add to Cart
  ↓
Update store immediately (optimistic update)
  ↓
Save to localStorage
  ↓
Persist on page refresh
```

### Auth State
```
Sign In/Sign Up
  ↓
Update auth store
  ↓
Save to localStorage
  ↓
Show in header (Sign In → user menu)
```

---

## Error Handling Tests

### Network Errors
```
# Disable backend API
1. Stop any running backend server
2. Go to /catalog
3. Should display mock data with message:
   "Using mock data - Backend server is not available"
4. All features work normally
```

### Invalid Input
```
# Cart validation
1. Try adding quantity > available stock
2. Should show error or disable button

# Search validation
1. Search for non-existent product
2. Should show empty state gracefully

# Auth validation
1. Submit form with missing fields
2. Should show field-specific errors
```

---

## Performance Testing

### Page Load Times
```
Homepage: Should load < 2 seconds
Catalog: Should load < 3 seconds (with 12 products)
Cart: Should load instantly (localStorage data)
Auth: Should load < 1 second
```

### Lighthouse Checks
```
npm run build
npm run start

Then use Chrome DevTools Lighthouse:
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90
```

---

## Responsive Design Testing

### Mobile (320px - 640px)
```
□ Header: Mobile menu visible, search hidden
□ Catalog: Single column grid
□ Filters: Collapsible sidebar
□ Cart: Full width items
□ Forms: Full width inputs
```

### Tablet (641px - 1024px)
```
□ Header: Navigation visible
□ Catalog: 2 column grid
□ Filters: Side-by-side with products
□ Cart: 2/3 items + 1/3 summary
```

### Desktop (1025px+)
```
□ Header: All features visible
□ Catalog: 3 column grid
□ Filters: Left sidebar
□ Cart: 2/3 items + 1/3 sticky summary
```

---

## Dark Mode Testing

```
1. Click moon icon in header
2. Page should switch to dark theme
3. All colors should be readable
4. Theme persists on page refresh
5. System preference respected if not set
```

---

## Curl Testing (Backend Integration)

Once you have a backend running at `http://localhost:4000`:

```bash
# Get all products
curl http://localhost:4000/catalog/products

# Get categories
curl http://localhost:4000/catalog/categories

# Sign in
curl -X POST http://localhost:4000/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Validate stock
curl -X POST http://localhost:4000/catalog/products/1/stock \
  -H "Content-Type: application/json" \
  -d '{"quantity":5}'
```

---

## Common Issues & Fixes

### Issue: Cart not persisting
```
Solution: Clear localStorage and refresh
localStorage.clear()
```

### Issue: Images not loading
```
Solution: Images use /public folder references
Check that image files exist in /public directory
```

### Issue: Theme not toggling
```
Solution: Ensure next-themes is installed
npm install next-themes
```

### Issue: Forms not submitting
```
Solution: Check browser console for errors
Ensure all required fields are filled
Mock auth doesn't validate email format strictly
```

---

## Checklist for Production

- [ ] All routes load without errors
- [ ] Cart persists across sessions
- [ ] Auth state persists (localStorage)
- [ ] Dark mode works correctly
- [ ] Mobile responsive on all screen sizes
- [ ] Images load properly
- [ ] No console errors
- [ ] Search/filter work smoothly
- [ ] Pagination works correctly
- [ ] Forms validate properly
- [ ] Backend API integration ready
- [ ] Environment variables set

---

## Backend Integration Checklist

When connecting to a real backend:

1. **Update Environment Variable**
   ```
   NEXT_PUBLIC_API_BASE_URL=http://your-backend-url
   ```

2. **Ensure Backend Endpoints Match**
   - `GET /catalog/products` - returns ProductListResponse
   - `GET /catalog/categories` - returns Category[]
   - `POST /auth/sign-in` - returns Session
   - `POST /auth/sign-up` - returns Session
   - `POST /catalog/products/{id}/stock` - validates stock

3. **Test API Calls**
   - All requests have 5-second timeouts
   - Fallback to mock data on network errors
   - Error messages display to user

---

## Support

For issues or questions:
1. Check browser console for errors
2. Verify network requests in DevTools
3. Ensure all dependencies installed: `npm install`
4. Check .env.local for correct API_BASE_URL
5. Review TESTING.md for known issues

Happy Testing! 🚀
