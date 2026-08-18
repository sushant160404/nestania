# Nestania Admin Panel

Complete admin dashboard for managing the Nestania e-commerce platform.

## 🚀 Access Admin Panel

Navigate to: **http://localhost:3000/admin**

## 🔐 Demo Credentials

```
Email: admin@nestania.com
Password: admin123
```

## 📋 Features

### ✅ Implemented

1. **Authentication**
   - Secure login page
   - Session management
   - Logout functionality

2. **Dashboard**
   - Revenue overview with trend indicators
   - Total orders count
   - Customer statistics
   - Pending orders tracking
   - Recent orders table
   - Quick action cards

3. **Orders Management**
   - View all orders
   - Search by order number or customer name
   - Filter by order status
   - Update order status (Mark as Shipped/Delivered)
   - Export orders functionality
   - Detailed order information

4. **Responsive Design**
   - Mobile-friendly sidebar
   - Collapsible navigation
   - Touch-optimized controls

### 🚧 Coming Soon

- Products Management (Add/Edit/Delete products)
- Customers Management (View customer profiles)
- Reviews Management (Moderate and respond)
- Analytics Dashboard (Sales charts, trends)
- Settings (Store configuration, notifications)

## 🎨 Design

The admin panel follows the same design system as the main store:
- **Colors:** Warm earth tones (#8A5A36, #FAF8F5)
- **Typography:** Serif for headings, sans-serif for content
- **Components:** Consistent with the main Nestania brand

## 📱 Screenshots

### Login Page
- Clean, minimal design
- Email and password fields
- Remember me option
- Demo credentials displayed

### Dashboard
- 4 key metric cards with trend indicators
- Recent orders table
- Quick action shortcuts

### Orders Management
- Searchable and filterable orders list
- Status badges with color coding
- Quick action buttons (View, Ship, Deliver)

## 🔧 Technical Details

### Authentication Flow

```typescript
// Check if logged in
const authToken = localStorage.getItem('admin_auth');

// Login
localStorage.setItem('admin_auth', 'authenticated');
localStorage.setItem('admin_email', email);

// Logout
localStorage.removeItem('admin_auth');
localStorage.removeItem('admin_email');
```

### Routing

Admin panel is accessible at `/admin` route. The main App.tsx checks the pathname:

```typescript
const isAdminRoute = window.location.pathname.startsWith('/admin');
if (isAdminRoute) {
  return <AdminApp />;
}
```

### API Integration

Orders are fetched from the existing API:

```typescript
// Get all orders
const res = await fetch('/api/orders');
const orders = await res.json();
```

## 🛠️ Development

### Adding New Pages

1. Create page component in `src/pages/admin/`
2. Add route case in `AdminApp.tsx`:

```typescript
case 'newpage':
  return <NewPage />;
```

3. Add menu item in `AdminLayout.tsx`:

```typescript
{ id: 'newpage', label: 'New Page', icon: IconComponent }
```

### Customizing Dashboard Stats

Edit `DashboardPage.tsx` to modify the stats cards:

```typescript
<StatCard
  title="Your Metric"
  value={value}
  change={percentChange}
  icon={<Icon />}
  color="bg-color-100"
/>
```

## 🔒 Security Notes

⚠️ **Important:** The current implementation uses basic localStorage authentication for demo purposes.

### For Production:

1. **Replace with JWT tokens:**
   ```typescript
   // Server generates JWT
   const token = jwt.sign({ email, role: 'admin' }, SECRET_KEY);
   
   // Client stores and sends with requests
   localStorage.setItem('admin_token', token);
   fetch('/api/admin/...', {
     headers: { Authorization: `Bearer ${token}` }
   });
   ```

2. **Add server-side authentication:**
   ```typescript
   // Protect admin routes
   app.use('/api/admin/*', authenticateAdmin);
   ```

3. **Use HTTPS in production**

4. **Implement proper password hashing** (bcrypt)

5. **Add CSRF protection**

6. **Implement rate limiting**

## 📊 Status Badges

Orders have color-coded status badges:

| Status | Color | Description |
|--------|-------|-------------|
| Ordered | Blue | Order placed |
| Confirmed | Purple | Payment confirmed |
| Shipped | Indigo | Order dispatched |
| Out for Delivery | Cyan | En route to customer |
| Delivered | Green | Successfully delivered |
| Cancelled | Red | Order cancelled |

## 🎯 Quick Actions

Dashboard provides quick access to:
- Manage Products
- Process Orders
- View Analytics

## 💡 Tips

1. **Keyboard Shortcuts:** Use Tab to navigate between fields on login
2. **Mobile Access:** Tap the menu icon to open sidebar
3. **Search:** Real-time search in orders management
4. **Filters:** Combine search with status filters for precise results

## 🐛 Troubleshooting

**Can't login:**
- Make sure you're using the correct credentials
- Check browser console for errors
- Clear localStorage and try again

**Orders not loading:**
- Ensure the backend server is running
- Check `/api/orders` endpoint is accessible
- Verify MongoDB connection

**Sidebar won't close on mobile:**
- Click outside the sidebar or the X button
- Refresh the page if stuck

## 📞 Support

For issues or questions about the admin panel:
- Check the main `SETUP.md` for general setup
- Review `database/README.md` for database issues
- Check browser console for errors
