# CMRIT MakerSpace Backend

Backend API for the CMRIT MakerSpace Event Booking System using Node.js, Express, and MongoDB with Mongoose.

## Features

- **Authentication**: JWT-based authentication for students and admins
- **Booking Management**: Equipment booking system with invoice generation
- **Event Management**: Campus event creation and management
- **Inventory Management**: Hardware equipment tracking
- **Ticket System**: Issue reporting and tracking
- **Notifications**: Real-time notification system

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Express Validator for input validation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (installed locally or MongoDB Atlas)
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (already created) with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cmrit-makerspace
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. Make sure MongoDB is running on your system or update the `MONGODB_URI` to point to your MongoDB Atlas cluster.

5. Seed the database with initial data:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - User login (student/admin)
- `POST /api/auth/admin-login` - Admin login with hardcoded credentials
- `GET /api/auth/profile` - Get current user profile

### Bookings
- `POST /api/bookings` - Create new booking (student only)
- `GET /api/bookings/my-bookings` - Get user's bookings (student only)
- `GET /api/bookings` - Get all bookings (admin only)
- `PATCH /api/bookings/:id/status` - Update booking status (admin only)

### Events
- `GET /api/events` - Get all events (public)
- `POST /api/events` - Create new event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

### Inventory
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/category/:category` - Get items by category
- `POST /api/inventory` - Add new inventory item (admin only)
- `PUT /api/inventory/:id` - Update inventory item (admin only)
- `DELETE /api/inventory/:id` - Delete inventory item (admin only)
- `POST /api/inventory/:id/book` - Book equipment (reduce available count)

### Tickets
- `POST /api/tickets` - Create new ticket (student only)
- `GET /api/tickets/my-tickets` - Get user's tickets (student only)
- `GET /api/tickets` - Get all tickets (admin only)
- `PATCH /api/tickets/:id/status` - Update ticket status (admin only)
- `DELETE /api/tickets/:id` - Delete ticket (admin only)

### Notifications
- `GET /api/notifications` - Get user's notifications
- `PATCH /api/notifications/mark-read` - Mark all notifications as read
- `GET /api/notifications/unread-count` - Get unread notification count
- `DELETE /api/notifications/:id` - Delete notification

## Default Admin Credentials

- Username: `admin`
- Password: `cmrit@maker2024`

## Database Schema

### Users
- name, email, password, role (student/admin)
- phone, usn, branch, isCmritStudent

### Bookings
- invoiceNumber, userId, serviceName, fee, date
- status, paymentStatus, isCmritStudent, usn, branch

### Events
- title, description, date, time, venue
- organizer, status, maxAttendees, currentAttendees

### Inventory
- name, description, fee, cmritFee, quantity, available
- image, category, status

### Tickets
- userId, userName, userEmail, equipment, title, description
- status, assignedTo, priority

### Notifications
- userId, message, ticketId, read, type

## Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Request rate limiting
- Input validation with express-validator
- CORS configuration
- Helmet for security headers

## Development

The backend is configured to work with the frontend running on `http://localhost:5173`. Make sure to update the CORS origin if your frontend runs on a different port or domain.

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a strong, random `JWT_SECRET`
3. Use MongoDB Atlas for production database
4. Configure proper CORS origins
5. Set up proper logging and monitoring
