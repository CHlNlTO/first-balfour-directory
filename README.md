# First Balfour Directory System Documentation

## Overview

The First Balfour Directory System is a comprehensive employee directory web application built with Next.js that allows users to view employee information and administrators to manage the directory through a secure admin panel. The system uses Google Sheets as a database and Google Drive for file storage.

## System Architecture

### Frontend

- **Framework**: Next.js 14 with TypeScript
- **UI Components**: Shadcn/ui with Tailwind CSS
- **State Management**: React hooks with server-side pagination
- **Authentication**: Session-based authentication for admin access

### Backend

- **API**: Next.js API routes
- **Database**: Google Sheets (3 sheets: Directory, Positions, Departments)
- **File Storage**: Google Drive
- **Authentication**: Google Service Account

### Data Flow

1. **Public Access**: Users browse the directory with search, filter, and pagination
2. **Admin Operations**: Authenticated admins can create, read, update, and delete entries
3. **Data Storage**: All data is synchronized between Google Sheets and Google Drive
4. **Real-time Updates**: Changes are immediately reflected across the system

## Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Google Cloud Project with enabled APIs
- Google Service Account credentials

## Google API Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Google Sheets API
   - Google Drive API

### 2. Create Service Account

1. Navigate to IAM & Admin > Service Accounts
2. Create a new service account
3. Download the JSON credentials file
4. Extract the `client_email` and `private_key` for environment variables

### 3. Set Up Permissions

1. Share your Google Sheet with the service account email
2. Share your Google Drive folder with the service account email
3. Grant "Editor" permissions for both

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd directory-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create `.env.local` file:

```env
# Google Sheets API Configuration
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Google Drive Configuration
GOOGLE_DRIVE_PARENT_FOLDER_ID=your_folder_id
GOOGLE_DRIVE_URL_PREFIX=https://drive.google.com/uc?id=

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Image Domains
NEXT_PUBLIC_IMAGE_DOMAINS=drive.google.com,drive.usercontent.google.com,lh3.google.com
```

### 4. Start Development Server

```bash
npm run dev
```

## Google Sheets Setup

### Sheet Structure

Create a Google Sheet with three tabs:

#### 1. Directory Sheet

| Column | Field      | Type   |
| ------ | ---------- | ------ |
| A      | ID         | Number |
| B      | First Name | Text   |
| C      | Last Name  | Text   |
| D      | Nickname   | Text   |
| E      | Position   | Text   |
| F      | Department | Text   |
| G      | Email      | Email  |
| H      | Phone      | Text   |
| I      | Photo URL  | URL    |

#### 2. Positions Sheet

| Column | Field         | Type |
| ------ | ------------- | ---- |
| A      | Position Name | Text |

#### 3. Departments Sheet

| Column | Field           | Type |
| ------ | --------------- | ---- |
| A      | Department Name | Text |

## API Documentation

### Public Endpoints

#### GET /api/google-sheets

Fetch paginated employee data with filtering and sorting.

**Query Parameters:**

- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10)
- `search`: Search term for names
- `department`: Filter by department
- `position`: Filter by position
- `sortBy`: Sort field (id, name, department, position)
- `sortOrder`: Sort direction (asc, desc)

**Response:**

```json
{
  "data": [
    {
      "id": "1",
      "firstName": "Juan",
      "lastName": "Dela Cruz",
      "nickName": "Cardo",
      "position": "Developer",
      "department": "IT",
      "email": "juan@firstbalfour.com",
      "phone": "9123456789",
      "url": "https://drive.google.com/uc?id=file_id",
      "metadata": {
        "value": "1",
        "row": 2,
        "column": 1,
        "cell": "A2"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /api/google-sheets/positions

Fetch all available positions.

**Response:**

```json
[
  {
    "name": "Developer",
    "metadata": {
      "value": "Developer",
      "row": 2,
      "column": 1,
      "cell": "A2"
    }
  },
  {
    "name": "Manager",
    "metadata": {
      "value": "Manager",
      "row": 3,
      "column": 1,
      "cell": "A3"
    }
  }
]
```

#### GET /api/google-sheets/departments

Fetch all available departments.

**Response:**

```json
[
  {
    "name": "IT",
    "metadata": {
      "value": "IT",
      "row": 2,
      "column": 1,
      "cell": "A2"
    }
  },
  {
    "name": "HR",
    "metadata": {
      "value": "HR",
      "row": 3,
      "column": 1,
      "cell": "A3"
    }
  }
]
```

### Admin Endpoints

#### POST /api/login

Authenticate admin user.

**Request Body:**

```json
{
  "username": "admin",
  "password": "your_password"
}
```

**Response:**

```json
{
  "response": true
}
```

#### POST /api/google-sheets

Add new employee record.

**Request Body:**

```json
{
  "id": "5",
  "firstName": "Maria",
  "lastName": "Santos",
  "nickName": "Ria",
  "position": "Designer",
  "department": "Marketing",
  "email": "maria@firstbalfour.com",
  "phone": "9987654321",
  "url": "https://drive.google.com/uc?id=new_file_id",
  "metadata": {
    "value": "5",
    "row": 6,
    "column": 1,
    "cell": "A6"
  }
}
```

**Response:**

```json
{
  "id": "5",
  "firstName": "Maria",
  "lastName": "Santos",
  "nickName": "Ria",
  "position": "Designer",
  "department": "Marketing",
  "email": "maria@firstbalfour.com",
  "phone": "9987654321",
  "url": "https://drive.google.com/uc?id=new_file_id"
}
```

#### PATCH /api/google-sheets

Update existing employee record.

**Request Body:**

```json
{
  "id": "1",
  "firstName": "Juan Carlos",
  "lastName": "Dela Cruz",
  "nickName": "JC",
  "position": "Senior Developer",
  "department": "IT",
  "email": "juan.carlos@firstbalfour.com",
  "phone": "9123456789",
  "url": "https://drive.google.com/uc?id=updated_file_id",
  "metadata": {
    "value": "1",
    "row": 2,
    "column": 1,
    "cell": "A2"
  }
}
```

**Response:**

```json
{
  "id": "1",
  "firstName": "Juan Carlos",
  "lastName": "Dela Cruz",
  "nickName": "JC",
  "position": "Senior Developer",
  "department": "IT",
  "email": "juan.carlos@firstbalfour.com",
  "phone": "9123456789",
  "url": "https://drive.google.com/uc?id=updated_file_id"
}
```

#### DELETE /api/google-sheets

Delete employee record.

**Request Body:**

```json
{
  "id": "1",
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "nickName": "Cardo",
  "position": "Developer",
  "department": "IT",
  "email": "juan@firstbalfour.com",
  "phone": "9123456789",
  "url": "file_id_to_archive",
  "metadata": {
    "value": "1",
    "row": 2,
    "column": 1,
    "cell": "A2"
  }
}
```

**Response:**

```json
{
  "success": true
}
```

#### POST /api/google-drive

Upload employee photo to Google Drive (Form Data).

**Request Body (multipart/form-data):**

```
id: "1"
firstName: "Juan"
lastName: "Dela Cruz"
nickName: "Cardo"
position: "Developer"
department: "IT"
email: "juan@firstbalfour.com"
phone: "9123456789"
profile: [File object]
url: ""
metadata: {"value":"1","row":2,"column":1,"cell":"A2"}
```

**Response:**

```json
{
  "id": "1",
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "nickName": "Cardo",
  "position": "Developer",
  "department": "IT",
  "email": "juan@firstbalfour.com",
  "phone": "9123456789",
  "url": "https://drive.google.com/uc?id=new_uploaded_file_id"
}
```

#### PATCH /api/google-drive

Update employee photo in Google Drive (Form Data).

**Request Body (multipart/form-data):**

```
id: "1"
firstName: "Juan"
lastName: "Dela Cruz"
nickName: "Cardo"
position: "Developer"
department: "IT"
email: "juan@firstbalfour.com"
phone: "9123456789"
profile: [File object]
url: "https://drive.google.com/uc?id=existing_file_id"
metadata: {"value":"1","row":2,"column":1,"cell":"A2"}
```

**Response:**

```json
{
  "id": "1",
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "nickName": "Cardo",
  "position": "Developer",
  "department": "IT",
  "email": "juan@firstbalfour.com",
  "phone": "9123456789",
  "url": "https://drive.google.com/uc?id=updated_file_id"
}
```

#### DELETE /api/google-drive

Archive employee photo in Google Drive.

**Request Body:**

```json
{
  "id": "1",
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "url": "file_id_to_archive"
}
```

**Response:**

```json
{
  "id": "1",
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "url": "file_id_to_archive"
}
```

## User Guide

### Browsing the Directory

1. **Search**: Use the search bar to find employees by name
2. **Filter**: Filter by department or position using dropdown menus
3. **Sort**: Sort results by ID, name, department, or position
4. **View Details**: Click on employee cards to view contact information
5. **Copy Information**: Click copy buttons to copy name, email, or phone

### Navigation

- **Pagination**: Use pagination controls to navigate through results
- **Page Size**: Adjust number of cards displayed per page
- **Reset Filters**: Clear all filters and search terms

## Admin Guide

### Accessing Admin Panel

1. Navigate to `/admin`
2. Login with admin credentials
3. Access will be redirected to login page if not authenticated

### Managing Employees

#### Adding New Employee

1. Click "Add Person" button
2. Fill in all required fields:
   - First Name and Last Name (required)
   - Nickname (optional)
   - Position and Department (required, select from dropdown)
   - Email (required, must be valid format)
   - Phone (optional, format: 09XXXXXXXXX)
   - Profile Photo (optional, image files only, max 10MB)
3. Click "Add person" to save

#### Editing Employee

1. Find employee in the directory table
2. Click the edit (pencil) icon
3. Modify desired fields
4. Click "Update person" to save changes

#### Deleting Employee

1. Find employee in the directory table
2. Click the delete (trash) icon
3. Confirm deletion in the dialog

#### Reordering Employees

1. Use drag-and-drop to reorder employees
2. Or specify target index for precise positioning
3. Click "Save" to apply changes

### Admin Features

- **Preview Mode**: View the directory as public users see it
- **Directory Mode**: Manage employee records with full CRUD operations
- **Search and Filter**: Same functionality as public view with additional management tools
- **Bulk Operations**: Reorder multiple employees efficiently

### Data Management

- All changes are immediately synchronized with Google Sheets
- Photos are stored in Google Drive with automatic URL generation
- Deleted photos are archived rather than permanently removed
- ID numbers are automatically managed and sequential

## Tech Stack

### Frontend

- Next.js 14
- TypeScript
- React Hook Form
- Tailwind CSS
- Shadcn/ui Components
- Framer Motion (for animations)
- Lucide React (icons)

### Backend

- Next.js API Routes
- Google APIs (Sheets & Drive)
- Zod (validation)
- Multer (file uploads)

### Development Tools

- ESLint
- PostCSS
- Tailwind CSS

## Deployment

The application is designed to be deployed on Vercel with the following considerations:

1. **Environment Variables**: Set all required environment variables in your deployment platform
2. **Google APIs**: Ensure service account has proper permissions
3. **Image Domains**: Configure Next.js image domains for Google Drive URLs
4. **HTTPS**: Required for production deployment

## Security Features

- **Admin Authentication**: Session-based authentication with credentials stored in environment variables
- **Input Validation**: Comprehensive form validation using Zod schemas
- **File Upload Security**: Image file type and size restrictions
- **API Security**: Server-side validation for all API endpoints
- **Google Service Account**: Secure API access without exposing user credentials
