````md
# 🚀 Planora - Frontend

**Planora** is a secure, modern event management platform built with Next.js. It allows users to discover, create, and manage events, while providing a seamless interface for payments and participant management.

## 🔗 Deployment Links

- **Live Application:** https://planora.udayhasan.dev
- **Backend API:** https://api-planora.udayhasan.dev

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Context API
- **Form Handling:** React Hook Form & Zod
- **Deployment:** VPS

---

## ✨ Key Features

- **Dynamic Homepage:** Hero section, Upcoming Events slider, and Category filters.
- **Advanced Filtering:** Search events by title or organizer and filter by visibility and pricing.
- **Comprehensive Dashboard:**
  - **My Events:** Manage hosted events and participants.
  - **Invitations:** Accept or decline invitations.
  - **Reviews:** Manage event feedback and ratings.
- **Secure Authentication:** JWT-based authentication with protected routes.
- **Payment Integration:** Seamless payment workflow for paid events.
- **Responsive Design:** Optimized for Mobile, Tablet, and Desktop devices.

---

## 📁 Project Structure

```bash
src/
├── app/
├── components/
├── context/
├── hooks/
├── lib/
├── services/
├── types/
└── utils/
```
````

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/uday-hasan/PH-L2-A5-FRONTEND.git
cd PH-L2-A5-FRONTEND
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL="BACKEND_URL"

```

### 4. Start the development server

```bash
bun run dev
```

### 5. Open in browser

```txt
http://localhost:3000
```

---

## 📦 Available Scripts

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

---

## 🔐 Authentication Flow

- User logs in or registers.
- Backend returns JWT token.
- Token is securely stored and attached to authenticated requests.
- Protected routes and dashboard features require valid authentication.

---

## 💳 Payment Workflow

- Users can join paid events through Stripe checkout.
- Successful payments automatically update participation status.
- Hosts can monitor participant payment status from the dashboard.

---

## 📱 Responsive Support

Planora is fully responsive and optimized for:

- Mobile Devices
- Tablets
- Desktop Screens

---

```

```
