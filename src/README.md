# Category Spinner

A sophisticated web application featuring an admin panel for managing categories and an interactive spinner wheel game with beautiful glassmorphic design and smooth animations.

## Features

- **Authentication System**
  - Email/password registration and login
  - OTP-based email verification
  - JWT token management
  - Auto-logout on token expiry

- **Admin Panel**
  - Create, read, update, and delete categories (max 8)
  - Rich text descriptions
  - Custom color picker
  - Image upload with drag-and-drop
  - Real-time validation

- **Interactive Spinner Game**
  - Physics-based rotation animation
  - Sound effects during spinning
  - Celebration animations on win
  - Game statistics tracking
  - Responsive touch controls

- **UI/UX**
  - Glassmorphism design throughout
  - Smooth page transitions
  - Accessible keyboard navigation
  - Support for reduced motion preferences
  - High contrast mode support
  - Loading states with skeletons

## Tech Stack

- **Frontend:** React 18, TypeScript, React Router v6
- **Styling:** Tailwind CSS v4 with custom animations
- **State Management:** React Hooks & Context API
- **Storage:** localStorage with simple encryption
- **Sound:** Web Audio API
- **Build Tool:** Vite

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Demo Credentials

For testing purposes, you can register with any email/password combination. OTP codes will be logged to the console.

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication forms
│   ├── admin/          # Admin panel components
│   ├── game/           # Spinner game components
│   ├── layout/         # Layout components
│   └── ui/             # Reusable UI components
├── context/            # React contexts
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript types
├── utils/              # Utilities
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Features in Detail

### Authentication Flow

1. User registers with email, password, and name
2. OTP is generated and logged to console (for demo)
3. User verifies OTP within 10 minutes
4. JWT token is created and stored
5. User can login with credentials
6. Token is validated on each request

### Category Management

- Maximum 8 categories enforced
- Unique category names
- Drag-and-drop image upload
- Client-side image compression
- Real-time form validation
- Optimistic UI updates

### Spinner Game

- Categories displayed as wheel segments
- Smooth acceleration/deceleration animation
- Random spin outcome
- Sound effects on spin and win
- Results display with statistics
- Responsive design for mobile

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- High contrast mode support
- Reduced motion preferences respected
- Screen reader compatible

## Performance

- Lazy component loading with React Router
- Optimized SVG rendering
- Memoized expensive computations
- Efficient animation frame management
- Client-side image compression
- Minimal bundle size

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Security

- Input sanitization
- XSS protection
- Secure token storage
- Password hashing (client-side for demo)
- CORS ready
- Environment variable support

## Known Limitations

- Client-side only authentication (use backend in production)
- localStorage-based persistence (use database in production)
- No rate limiting (implement on backend)
- Basic encryption (use bcrypt in production)

## Future Enhancements

- Backend API integration
- Database persistence
- User profiles and stats
- Sharing functionality
- Leaderboard
- Social features
- Mobile app versions

## License

MIT
