# Food Delivery Frontend

A beautiful, modern frontend for the food delivery system built with Next.js, React, and Tailwind CSS.

## Features

- 🏠 **Home Page** - Browse all available restaurants
- 🍽️ **Restaurant Details** - View menu items and add to cart
- 🛒 **Shopping Cart** - Manage cart items and checkout
- 📦 **Order Tracking** - Real-time order status updates
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ⚡ **Fast & Responsive** - Built with Next.js for optimal performance

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend services running (see Backend_README.md)

### Installation

```bash
cd frontend
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Backend Integration

The frontend connects to the following backend services:

- **Restaurant Service** (Port 8080) - Restaurant and menu data
- **Order Service** (Port 8090) - Order placement

### API Endpoints Used

- `GET http://localhost:8080/restaurants` - Get all restaurants
- `GET http://localhost:8080/restaurants/{id}` - Get restaurant details
- `GET http://localhost:8080/restaurants/{id}/menu` - Get restaurant menu
- `POST http://localhost:8090/orders` - Place an order

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── cart/              # Cart page
│   ├── restaurant/[id]/   # Restaurant detail page
│   └── order/[id]/        # Order tracking page
├── components/            # Reusable components
│   ├── Header.tsx
│   ├── RestaurantCard.tsx
│   ├── MenuItemCard.tsx
│   └── OrderStatusBadge.tsx
├── contexts/              # React contexts
│   └── CartContext.tsx   # Cart state management
├── lib/                  # Utilities
│   └── api.ts            # API service layer
└── types/                # TypeScript types
    └── index.ts
```

## Features in Detail

### Restaurant Browsing
- View all available restaurants
- See restaurant ratings and locations
- Click to view detailed menu

### Menu & Cart
- Browse menu items with prices
- Add/remove items from cart
- Update quantities
- View cart total

### Order Placement
- Place orders with selected items
- Automatic order ID generation
- Redirect to order tracking

### Order Tracking
- Real-time order status updates
- Status badges with icons
- Delivery partner information
- Order history

## Notes

- **Order Tracking**: Currently uses simulated status updates since the backend doesn't expose a `GET /orders/{id}` endpoint. In production, you would add this endpoint to fetch real-time order status or use WebSockets for live updates.

## Technologies Used

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icon library

## Future Enhancements

- [ ] Add user authentication
- [ ] Implement real-time order tracking via WebSocket
- [ ] Add order history page
- [ ] Implement search and filters
- [ ] Add restaurant reviews and ratings
- [ ] Implement payment integration UI
- [ ] Add delivery tracking map
- [ ] Implement favorites/wishlist
