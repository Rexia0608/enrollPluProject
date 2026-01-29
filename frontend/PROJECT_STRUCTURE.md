# Project Structure Documentation

## Overview
Dashboard application with role-based access (Admin, Faculty, Student)

## Directory Structure

```
dashboard/
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── vite.config.js
│
├── public/
│   └── img/
│
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    │
    ├── assets/
    │
    ├── components/
    │   ├── admin/
    │   │   ├── AdminOverview.jsx
    │   │   ├── CourseManagement.jsx
    │   │   ├── EnrollmentControl.jsx
    │   │   ├── EnrollmentControlCard.jsx
    │   │   ├── MaintenanceModeCard.jsx
    │   │   ├── RecentActivityCard.jsx
    │   │   └── UserManagement.jsx
    │   │
    │   ├── faculty/
    │   │   ├── DocumentReview.jsx
    │   │   ├── DocumentReviewCard.jsx
    │   │   ├── FacultyNotificationsCard.jsx
    │   │   ├── FacultyOverview.jsx
    │   │   ├── PaymentValidation.jsx
    │   │   ├── ReviewQueueCard.jsx
    │   │   └── StudentDetails.jsx
    │   │
    │   ├── layout/
    │   │   ├── AppHeader.jsx
    │   │   ├── DashboardContainer.jsx
    │   │   ├── MobileNav.jsx
    │   │   └── Sidebar.jsx
    │   │
    │   ├── student/
    │   │   ├── StudentDocuments.jsx
    │   │   └── StudentStatus.jsx
    │   │
    │   └── ui/
    │       ├── Card.jsx
    │       ├── ConfirmDialog.jsx
    │       ├── DataTable.jsx
    │       ├── EmptyState.jsx
    │       ├── Input.jsx
    │       ├── LoadingState.jsx
    │       ├── Modal.jsx
    │       ├── PrimaryButton.jsx
    │       ├── SecondaryButton.jsx
    │       ├── Select.jsx
    │       ├── StatCard.jsx
    │       └── StatusBadge.jsx
    │
    ├── context/
    │   └── AuthContext.jsx
    │
    ├── pages/
    │   ├── AdminDashboard.jsx
    │   ├── FacultyDashboard.jsx
    │   ├── LoginPage.jsx
    │   ├── MaintenancePage.jsx
    │   ├── NotFound.jsx
    │   ├── RegisterPage.jsx
    │   ├── StudentDashboard.jsx
    │   └── UnauthorizedPage.jsx
    │
    ├── routes/
    │   └── ProtectedRotues.jsx
    │
    ├── utils/
    │   ├── signInValidation.jsx
    │   └── signUpValidation.jsx
    │
    └── view/
        └── views.jsx
```

## Folder Breakdown

### Root Level Files
- **eslint.config.js** - ESLint configuration
- **index.html** - Main HTML file
- **package.json** - Project dependencies and scripts
- **README.md** - Project documentation
- **vite.config.js** - Vite bundler configuration

### public/
- Static assets (images, etc.)

### src/
Main source code directory

#### components/
Reusable React components organized by feature/role

- **admin/** - Admin-specific components
- **faculty/** - Faculty-specific components
- **layout/** - Layout components (Header, Sidebar, Navigation)
- **student/** - Student-specific components
- **ui/** - Reusable UI components (Button, Card, Dialog, etc.)

#### context/
React Context for state management
- **AuthContext.jsx** - Authentication state

#### pages/
Page-level components representing routes
- Dashboard pages for each role
- Authentication pages (Login, Register)
- Error pages (NotFound, Unauthorized)
- Maintenance page

#### routes/
Route configuration
- **ProtectedRotues.jsx** - Protected route wrapper

#### utils/
Utility functions
- **signInValidation.jsx** - Sign in validation logic
- **signUpValidation.jsx** - Sign up validation logic

#### view/
View configuration/management
- **views.jsx** - View definitions
