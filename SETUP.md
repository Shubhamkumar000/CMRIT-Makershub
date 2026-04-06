# CMRIT MakerSpace - Full Stack Setup

This guide will help you set up and run the complete CMRIT MakerSpace Event Booking System with both frontend and backend.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (installed locally or MongoDB Atlas)
- npm or yarn

## Quick Start

### 1. Setup Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start MongoDB (if using local installation):
```bash
# For Windows
mongod

# For macOS/Linux
sudo systemctl start mongod
```

4. Seed the database with initial data:
```bash
npm run seed
```

5. Start the backend server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

### 2. Setup Frontend

1. Open a new terminal window

2. Navigate to the root directory:
```bash
cd event-setup-hub-main
```

3. Install frontend dependencies:
```bash
npm install
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Default Credentials

### Admin Login
- Username: `admin`
- Password: `cmrit@maker2024`

### Student Registration
- Use the registration form to create student accounts
- CMRIT students get discounted rates

## Features

### Frontend Features
- Equipment booking (3D printing, laser cutting, etc.)
- Student and admin authentication
- PDF invoice generation
- Responsive design with Tailwind CSS
- Real-time notifications

### Backend Features
- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- JWT authentication
- Input validation and security
- Rate limiting and CORS protection

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login
- `GET /api/auth/profile` - Get user profile

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings` - Get all bookings (admin)

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Inventory
- `GET /api/inventory` - Get all inventory
- `POST /api/inventory` - Add item (admin)
- `PUT /api/inventory/:id` - Update item (admin)
- `POST /api/inventory/:id/book` - Book equipment

### Tickets
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/my-tickets` - Get user tickets
- `GET /api/tickets` - Get all tickets (admin)
- `PATCH /api/tickets/:id/status` - Update ticket status (admin)

## Development

### Running Both Servers Simultaneously

For development, you can run both servers in parallel:

**Backend Terminal:**
```bash
cd backend
npm run dev
```

**Frontend Terminal:**
```bash
npm run dev
```

### Environment Variables

Backend `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cmrit-makerspace
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### Database Schema

The application uses the following collections:
- `users` - Student and admin accounts
- `bookings` - Equipment bookings
- `events` - Campus events
- `inventory` - Hardware equipment
- `tickets` - Issue reports
- `notifications` - User notifications

## Production Deployment

1. **Backend:**
   - Set `NODE_ENV=production`
   - Use MongoDB Atlas for database
   - Configure strong JWT secret
   - Set up proper CORS origins

2. **Frontend:**
   - Build with `npm run build`
   - Deploy to static hosting service
   - Update API base URL to production backend

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify MongoDB Atlas IP whitelist (if using cloud)

2. **CORS Errors**
   - Check backend CORS configuration
   - Ensure frontend URL is whitelisted

3. **Authentication Issues**
   - Verify JWT secret is set
   - Check token storage in browser

4. **Port Conflicts**
   - Change ports in `.env` (backend) and `vite.config.ts` (frontend)

### Logs

- Backend logs show in terminal
- Frontend logs in browser dev tools
- Database operations logged in backend console

## Support

For issues:
1. Check terminal logs
2. Verify MongoDB connection
3. Check network requests in browser dev tools
4. Ensure both servers are running

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- React Router
- React Query
- jsPDF

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Express Validator
