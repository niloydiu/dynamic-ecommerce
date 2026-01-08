# NexusCommerce Frontend - Quick Start Guide

## Installation

```bash
# Clone or download the project
cd nexus-commerce-frontend

# Install dependencies
npm install

# Create .env.local (optional - will use defaults)
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:4000" > .env.local
```

## Development

```bash
# Start development server
npm run dev

# Open in browser
# http://localhost:3000
```

**Works immediately without backend!** All features use mock data by default.

---

## What's Working

### ✅ Full Features (No Backend Needed)
- 🛍️ Product catalog with filtering, search, sorting
- 🛒 Shopping cart with persistence
- 👤 Authentication scaffolding
- 🌓 Dark/light mode
- 📱 Responsive design

### 📦 Ready for Backend
- 📊 Admin dashboard
- 💬 Comments & reviews
- ⭐ Ratings system
- 🏪 Inventory tracking

---

## Routes

```
/                 → Homepage with hero & featured products
/catalog          → Product catalog with filters
/cart             → Shopping cart
/auth/sign-in     → Sign in form
/auth/sign-up     → Sign up form
/admin/dashboard  → Admin dashboard
/admin/products/new → Add product form
```

---

## Quick Tests

### Test 1: Add to Cart
1. Visit http://localhost:3000/
2. Scroll to featured products
3. Click "Add to Cart" on any product
4. See counter increase in header
5. Click cart icon to view items

### Test 2: Filter Products
1. Go to http://localhost:3000/catalog
2. Click "Electronics" category
3. See filtered products
4. Try price slider
5. Try searching for "keyboard"

### Test 3: Dark Mode
1. Click moon icon in header
2. Page switches to dark theme
3. Refresh - theme persists

### Test 4: Responsive
1. Open DevTools (F12)
2. Click device toolbar (mobile icon)
3. Switch between mobile/tablet/desktop
4. Layout adapts correctly

---

## File Structure

```
app/
├── page.tsx              # Homepage
├── layout.tsx            # Root layout with Header/Footer
├── catalog/
│   └── page.tsx          # Catalog listing
├── cart/
│   └── page.tsx          # Shopping cart
├── auth/
│   ├── sign-in/
│   └── sign-up/
└── admin/
    ├── dashboard/
    └── products/
        └── new/

components/
├── global/
│   ├── header.tsx
│   └── footer.tsx
├── ui/                   # 50+ shadcn components
└── theme-provider.tsx

modules/
├── catalog/              # Product module
├── cart/                 # Shopping cart
├── auth/                 # Authentication
├── engagement/           # Comments, reactions
├── inventory/            # Stock management
└── admin/                # Admin functions

lib/
└── utils.ts              # Utility functions

public/                   # Images & assets
```

---

## Common Tasks

### Change API URL
Edit `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://your-api.com
```

### Add New Product to Mock Data
Edit `modules/catalog/actions.server.ts`:
```typescript
const MOCK_PRODUCTS: Product[] = [
  // ... existing products
  {
    id: "13",
    name: "Your Product",
    // ... other fields
  }
]
```

### Customize Colors
Edit `app/globals.css`:
```css
@theme {
  --color-primary: #your-color;
  --color-secondary: #your-color;
}
```

---

## Troubleshooting

### Q: Products not showing?
**A:** Check browser console. If no errors, mock data should show. If backend connected, verify `NEXT_PUBLIC_API_BASE_URL` is correct.

### Q: Cart not persisting?
**A:** Clear localStorage: Open DevTools → Application → localStorage → Delete all entries

### Q: Dark mode not working?
**A:** Ensure `next-themes` is installed: `npm install next-themes`

### Q: Images not loading?
**A:** Check image paths in `/public` folder. Use `/image-name.jpg` format.

---

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Run on different port
PORT=3001 npm start
```

---

## Environment Variables

```bash
# Required
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Optional
NEXT_PUBLIC_DEFAULT_THEME=light
```

---

## Dependencies

Key packages:
- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **next-themes** - Dark mode
- **Lucide Icons** - Icons
- **shadcn/ui** - Components

See `package.json` for complete list.

---

## Next Steps

1. ✅ Install & run locally
2. ✅ Test all routes in browser
3. ✅ Review TESTING.md for detailed tests
4. ✅ Connect to backend API
5. ✅ Implement real authentication
6. ✅ Add payment processing
7. ✅ Deploy to production

---

## Support

Need help?
1. Read TESTING.md for common issues
2. Check AUDIT_REPORT.md for technical details
3. Review README.md in each module
4. Check component TypeScript types

---

**Happy coding! 🚀**
