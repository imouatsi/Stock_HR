# 🔰 Beginner's Guide to 404 ENTERPRISE

Welcome to the Stock & HR Management System! This guide is designed to help absolute beginners understand, install, and use the system. We'll go through each step in detail, with clear explanations.

## 📖 What is 404 ENTERPRISE?

404 ENTERPRISE is a comprehensive application that helps businesses in Algeria:
- Track inventory and stock levels
- Manage employee information and HR processes
- Create and track contracts
- Generate invoices and manage accounting
- View business metrics through a comprehensive dashboard
- Handle financial statements and reporting
- Manage suppliers and purchase orders

Think of it as your business's digital command center where you can manage everything in one place.

## 💻 Before You Begin

### What You Need

1. **A Computer** with:
   - Windows 10/11, macOS 10.15+, or a Linux distribution
   - At least 4GB RAM (8GB recommended)
   - At least 10GB free disk space

2. **Internet Connection**
   - For downloading the software and dependencies
   - For accessing the application if deployed to a server

3. **Basic Computer Skills**
   - Typing and using a keyboard/mouse
   - Opening terminal/command prompt
   - Navigating file systems
   - Copy and paste operations

## 🚶‍♀️ Step 1: Understanding the Components

The system consists of two main parts:

1. **Frontend**: What you see in your browser (the user interface)
2. **Backend**: The server that handles data storage and business logic

Think of the frontend as the dashboard of a car, and the backend as the engine. You interact with the dashboard, but the engine does all the heavy lifting.

## 🚶‍♂️ Step 2: Installing Prerequisites

### Installing Node.js

Node.js is the engine that powers our application.

#### On Windows:
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the "LTS" (Long Term Support) version
3. Run the installer
4. Follow the prompts, accepting the defaults
5. When complete, open Command Prompt
6. Type `node -v` and press Enter
7. If you see a version number (like v14.17.0), it's installed correctly!

#### On macOS:
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the "LTS" version for macOS
3. Run the installer package
4. Follow the installation wizard
5. When complete, open Terminal
6. Type `node -v` and press Enter
7. If you see a version number, it's installed correctly!

#### On Linux (Ubuntu/Debian):
1. Open Terminal
2. Run `sudo apt update`
3. Run `sudo apt install nodejs npm`
4. Verify with `node -v`

### Installing MongoDB

MongoDB is where our data is stored.

#### On Windows:
1. Go to [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Download the MSI installer
3. Run the installer
4. Choose "Complete" installation
5. Check "Install MongoDB as a Service"
6. Click Install
7. After installation, MongoDB will start automatically

#### On macOS:
1. If you have Homebrew, open Terminal and run:
   ```
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```
2. Without Homebrew, follow the manual installation guide on MongoDB's website

#### On Linux (Ubuntu/Debian):
1. Follow the [official MongoDB installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

## 🚶‍♀️ Step 3: Getting the Code

### Option A: Using Git (Recommended for Developers)

1. Install Git if you don't have it:
   - Windows: Download from [git-scm.com](https://git-scm.com/)
   - macOS: It comes with Xcode Command Line Tools or use Homebrew: `brew install git`
   - Linux: `sudo apt install git`

2. Open Terminal/Command Prompt
3. Navigate to where you want to store the project
   ```
   # On Windows
   cd C:\Projects

   # On macOS/Linux
   cd ~/Projects
   ```
4. Clone the repository:
   ```
   git clone https://github.com/imouatsi/Stock_HR.git
   ```
5. Move into the project folder:
   ```
   cd Stock_HR
   ```

### Option B: Downloading ZIP (Easiest for Beginners)

1. Go to the project repository on GitHub
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to your desired location
5. Open Terminal/Command Prompt and navigate to the extracted folder

## 🚶‍♂️ Step 4: Installation

Now that you have the code, let's install everything needed to run the application.

### Step 4.1: Installing Root Dependencies

1. In Terminal/Command Prompt, make sure you're in the main project folder
2. Run:
   ```
   npm install
   ```
3. Wait for the installation to complete (it might take several minutes)

### Step 4.2: Setting Up the Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install frontend dependencies:
   ```
   npm install
   ```
3. Create environment configuration:
   ```
   # On Windows
   copy .env.example .env

   # On macOS/Linux
   cp .env.example .env
   ```

### Step 4.3: Setting Up the Backend

1. Navigate to the backend directory:
   ```
   # If you're in the frontend directory
   cd ../backend

   # If you're in the root directory
   cd backend
   ```
2. Install backend dependencies:
   ```
   npm install
   ```
3. Create environment configuration:
   ```
   # On Windows
   copy .env.example .env

   # On macOS/Linux
   cp .env.example .env
   ```

### Step 4.4: Configure Environment Files

1. Open the `.env` file in the frontend directory with a text editor
   - Set `REACT_APP_API_URL` to `http://localhost:5000/api`

2. Open the `.env` file in the backend directory with a text editor
   - Set `PORT` to `5000`
   - Set `MONGODB_URI` to `mongodb://localhost:27017/404enterprise`
   - Set `JWT_SECRET` to any random string (e.g., `my_super_secret_key`)
   - Set `NODE_ENV` to `development`

## 🚶‍♀️ Step 5: Starting the Application

### Step 5.1: Ensure MongoDB is Running

#### On Windows:
1. MongoDB should be running as a service if you installed it that way
2. To verify: Open Command Prompt and run:
   ```
   sc query MongoDB
   ```
3. If it shows "RUNNING", it's good to go!

#### On macOS:
```
brew services list
```
Look for mongodb-community and check if it's started

#### On Linux:
```
sudo systemctl status mongod
```

### Step 5.2: Start the Backend Server

1. In Terminal/Command Prompt, navigate to the backend directory
2. Run:
   ```
   npm run dev
   ```
3. You should see a message like "Server running on port 5000"

### Step 5.3: Start the Frontend Server

1. Open a new Terminal/Command Prompt window (keep the backend one running!)
2. Navigate to the frontend directory
3. Run:
   ```
   npm start
   ```
4. A browser window should automatically open showing the application
5. If it doesn't open automatically, go to http://localhost:3000 in your browser

## 🚶‍♂️ Step 6: Using the Application

### First-Time Login

When you first start the application, you'll need to create an account:

1. Click on "Register" on the login page
2. Fill in your details:
   - First Name
   - Last Name
   - Email
   - Password (at least 6 characters)
   - Select a role (Admin is recommended for testing)
3. Click "Sign Up"
4. You'll be automatically logged in and directed to the Dashboard

### Navigating the Dashboard

The Dashboard shows:
- Key metrics at the top (users, inventory, contracts, invoices)
- Recent activities in the middle
- Quick actions on the right

### Using the Sidebar Navigation

The sidebar on the left contains links to all major sections:
1. **Dashboard**: Overview of your business
2. **Inventory**: Manage stock and items
3. **Contracts**: Create and manage contracts
4. **Invoices**: Generate and track invoices
5. **Users**: Manage system users (admin only)
6. **Settings**: Configure application settings

### Changing Languages

1. In the top-right corner, find the language selector
2. Choose between English (EN), French (FR), or Arabic (AR)
3. The interface will update immediately with the selected language

### Dark/Light Mode

1. In the top-right corner, find the theme toggle
2. Click to switch between dark and light modes

## 📱 Basic Tasks

### Adding Inventory Items
1. Go to Inventory from the sidebar
2. Click "Add Item" button
3. Fill in the item details
4. Click "Save"

### Creating a Contract
1. Go to Contracts from the sidebar
2. Click "Generate Contract" button
3. Fill in the contract details
4. Click "Preview" to review
5. Click "Generate" to create the contract

### Creating an Invoice
1. Go to Invoices from the sidebar
2. Click "Add Invoice" button
3. Select a client
4. Add line items with descriptions and amounts
5. Set payment terms
6. Click "Generate Invoice"

### Adding a User
1. Go to Users from the sidebar
2. Click "Add User" button
3. Fill in the user details and set permissions
4. Click "Save"

## ❓ Troubleshooting

### Common Issue 1: Application Won't Start
- **Symptom**: Error message when running `npm start`
- **Solution**:
  1. Ensure Node.js is installed properly
  2. Delete the `node_modules` folder and run `npm install` again
  3. Check there are no other applications using port 3000

### Common Issue 2: Can't Connect to Backend
- **Symptom**: Frontend loads but shows "Cannot connect to server"
- **Solution**:
  1. Check the backend terminal - is it running without errors?
  2. Verify MongoDB is running
  3. Check firewall settings aren't blocking connections
  4. Verify the REACT_APP_API_URL in frontend .env file is correct

### Common Issue 3: MongoDB Connection Errors
- **Symptom**: Backend shows "MongoDB connection error"
- **Solution**:
  1. Verify MongoDB service is running
  2. Check the connection string in backend .env file
  3. Try connecting with MongoDB Compass to verify server access

## 🆘 Getting More Help

If you encounter issues not covered here:
1. Check the full documentation in the docs folder
2. Look for error messages in the terminal windows
3. Search for the error message online
4. Reach out to support or create an issue on GitHub

Remember: Everyone was a beginner once! Don't hesitate to ask for help when needed.

## Getting Started

### System Requirements
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Git

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/stock-hr.git
cd stock-hr
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stock_hr
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

4. Start the application
```bash
npm start
```

## User Authentication

### Username Format
- Superadmin: SA00000
- Admin: UA00001
- User: U00002

### Registration
1. Fill in the registration form
2. Choose a strong password
3. Submit the form
4. Wait for admin authorization

### Login
1. Enter your username
2. Enter your password
3. Click login
4. Access your dashboard

### Password Requirements
- Minimum 8 characters
- At least one number
- At least one lowercase letter
- At least one uppercase letter
- At least one special character

## User Roles

### Superadmin
- Full system access
- Manage all users
- Configure system settings
- Access all features

### Admin
- Manage regular users
- Authorize new users
- View system reports
- Access admin features

### User
- View personal profile
- Update own information
- Access assigned features
- Submit requests

## Common Tasks

### Update Profile
1. Go to profile page
2. Edit information
3. Save changes
4. Verify updates

### Change Password
1. Go to settings
2. Enter current password
3. Enter new password
4. Confirm new password
5. Save changes

### Request Authorization
1. Register account
2. Contact admin
3. Wait for approval
4. Receive notification

## Troubleshooting

### Login Issues
- Check username format
- Verify password
- Ensure account is authorized
- Contact admin if needed

### Authorization Issues
- Check email for notification
- Contact admin for status
- Verify account details
- Follow up if delayed

### Password Reset
1. Click forgot password
2. Enter username
3. Check email
4. Follow reset link
5. Set new password

## Best Practices

### Security
- Use strong passwords
- Don't share credentials
- Log out when done
- Report suspicious activity

### Account Management
- Keep profile updated
- Use secure passwords
- Enable notifications
- Review account activity

### System Usage
- Follow guidelines
- Save work regularly
- Use help resources
- Report issues promptly

---

Now you're ready to use 404 ENTERPRISE! As you get more comfortable, explore more features and functionalities.

## 💰 Currency

404 ENTERPRISE uses the Algerian Dinar (DZD) as the default currency throughout the application. All financial transactions, invoices, and reports will display amounts in DZD.