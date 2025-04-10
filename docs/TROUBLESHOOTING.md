# 404 ENTERPRISE Troubleshooting Guide

This document provides solutions for common issues you might encounter while working with 404 ENTERPRISE.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Login Problems](#login-problems)
- [Database Connection Issues](#database-connection-issues)
- [Frontend Issues](#frontend-issues)
- [Backend Issues](#backend-issues)
- [API Request Problems](#api-request-problems)
- [Performance Issues](#performance-issues)
- [Common Error Messages](#common-error-messages)
- [Reporting Bugs](#reporting-bugs)
- [Authentication Issues](#authentication-issues)
- [Password Issues](#password-issues)
- [User Management](#user-management)
- [System Issues](#system-issues)
- [Best Practices](#best-practices)

## Installation Issues

### Node.js Version Compatibility

**Issue**: Installation fails with errors about incompatible Node.js version.

**Solution**:
1. Check your Node.js version: `node -v`
2. Ensure you have Node.js v14.x or later installed
3. If needed, install a compatible version using nvm:
   ```bash
   nvm install 14
   nvm use 14
   ```

### NPM Dependencies Installation Fails

**Issue**: `npm install` fails with errors.

**Solution**:
1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules directory and package-lock.json:
   ```bash
   rm -rf node_modules
   rm package-lock.json
   ```
3. Try installation again: `npm install`
4. If specific packages fail, try installing them individually

### Environment Variables Not Set

**Issue**: Application starts but shows configuration errors.

**Solution**:
1. Ensure you've created proper .env files in both frontend and backend directories
2. Copy from example files: `cp .env.example .env`
3. Update values in .env files to match your environment
4. Restart the application after changing environment variables

## Login Problems

### Can't Login with Correct Credentials

**Issue**: Login fails even with correct email and password.

**Solution**:
1. Check if MongoDB is running: `mongod --version`
2. Verify database connection in backend logs
3. Check if the user exists in the database
4. Reset the user's password in the database:
   ```javascript
   // In MongoDB shell
   use 404enterprise
   db.users.updateOne(
     { email: "user@example.com" },
     { $set: { password: "$2a$10$X/YZwZ..." } }
   )
   ```
5. Clear browser cookies and local storage, then try again

### JWT Token Issues

**Issue**: Getting logged out frequently or "Unauthorized" errors.

**Solution**:
1. Check JWT_SECRET in backend .env file
2. Ensure the token expiration is set appropriately in backend auth config
3. Check for CORS issues in browser console
4. Clear browser cookies and local storage

## Database Connection Issues

### MongoDB Connection Failed

**Issue**: Backend shows "Unable to connect to MongoDB" error.

**Solution**:
1. Ensure MongoDB is installed and running:
   ```bash
   # Start MongoDB
   mongod --dbpath /path/to/data/db
   ```
2. Check MongoDB connection string in backend .env file
3. Verify network connectivity to MongoDB server
4. Check MongoDB logs for errors:
   ```bash
   cat /var/log/mongodb/mongod.log
   ```

### Mongoose Schema Validation Errors

**Issue**: Database operations fail with validation errors.

**Solution**:
1. Check the data you're trying to save against the schema requirements
2. Verify required fields are present
3. Ensure data types match schema definitions
4. Look for any custom validators that might be failing

## Frontend Issues

### Application Not Loading

**Issue**: Blank screen or loading spinner that never completes.

**Solution**:
1. Check browser console for JavaScript errors
2. Ensure backend API is running and accessible
3. Verify API URLs in frontend environment config
4. Check for CORS issues in browser console
5. Try hard refresh: `Ctrl+F5` or `Cmd+Shift+R`

### React Component Errors

**Issue**: UI components crashing with red error screens.

**Solution**:
1. Check browser console for detailed error messages
2. Look for undefined props or state in component data
3. Check for missing dependencies in useEffect hooks
4. Verify that all required props are passed to components
5. Clear browser cache and reload

### Styling and Layout Issues

**Issue**: UI elements are misaligned or unstyled.

**Solution**:
1. Ensure Material-UI theme provider is properly set up
2. Check for CSS conflicts in browser inspector
3. Verify responsive breakpoints for different screen sizes
4. Check if the correct theme (light/dark) is applied
5. Test in different browsers to identify browser-specific issues

## Backend Issues

### Server Won't Start

**Issue**: Backend server fails to start with errors.

**Solution**:
1. Check if the port is already in use:
   ```bash
   lsof -i :5000
   ```
2. Kill any process using the same port:
   ```bash
   kill -9 <PID>
   ```
3. Check for syntax errors in backend code
4. Verify all required environment variables are set
5. Check logs for specific error messages

### API Routes Not Working

**Issue**: API endpoints return 404 errors.

**Solution**:
1. Ensure routes are properly registered in the Express app
2. Check for typos in route paths
3. Verify controller functions are correctly defined and exported
4. Test the route with a tool like Postman
5. Check Express middleware configuration

## API Request Problems

### CORS Errors

**Issue**: Browser shows Cross-Origin Resource Sharing (CORS) errors.

**Solution**:
1. Check CORS configuration in backend:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```
2. Ensure the frontend URL is correctly set in backend .env
3. Check if credentials are being included in requests
4. Verify that the correct headers are being sent and received

### Authentication Errors

**Issue**: API requests fail with 401 Unauthorized.

**Solution**:
1. Check if JWT token is included in request headers
2. Verify token hasn't expired
3. Ensure the token is valid and properly signed
4. Check authentication middleware for issues
5. Try logging out and back in to get a fresh token

## Performance Issues

### Slow Application Loading

**Issue**: Application takes a long time to load initially.

**Solution**:
1. Implement code splitting for React components
2. Optimize bundle size with tools like `webpack-bundle-analyzer`
3. Minimize and compress static assets
4. Implement lazy loading for routes and components
5. Consider server-side rendering for initial load

### Slow API Responses

**Issue**: API requests take too long to complete.

**Solution**:
1. Add database indexes for frequently queried fields
2. Implement caching for expensive operations
3. Optimize database queries to fetch only needed data
4. Use pagination for large data sets
5. Profile backend performance to identify bottlenecks

### Memory Leaks

**Issue**: Application becomes slower over time or crashes.

**Solution**:
1. Check for memory leaks in React components
2. Ensure event listeners are cleaned up in useEffect cleanup functions
3. Monitor backend memory usage
4. Implement proper garbage collection practices
5. Consider implementing a monitoring tool like Sentry

## Currency-Related Issues

### Currency Displays as USD Instead of DZD

**Issue**: Some parts of the application display USD instead of DZD.

**Solution**:
1. Check the formatting in the component:
   ```typescript
   // Incorrect
   new Intl.NumberFormat('en-US', {
     style: 'currency',
     currency: 'USD',
   }).format(amount)

   // Correct
   new Intl.NumberFormat('fr-DZ', {
     style: 'currency',
     currency: 'DZD',
   }).format(amount)
   ```
2. Update any hardcoded currency symbols from $ to DZD
3. Verify the locale settings in your application

### Currency Conversion Issues

**Issue**: Values are not correctly converted or displayed.

**Solution**:
1. Ensure all monetary values are stored in DZD
2. Check for any currency conversion functions that might be using incorrect rates
3. Verify decimal precision is appropriate for DZD (2 decimal places)

## Common Error Messages

### "Cannot read property 'X' of undefined"

**Issue**: JavaScript error when trying to access property of undefined object.

**Solution**:
1. Use optional chaining (`?.`) for potentially undefined objects
2. Add null checks before accessing properties
3. Provide default values with `||` or nullish coalescing (`??`)
4. Check where the object should be defined and why it's undefined

### "Network Error"

**Issue**: Frontend fails to connect to backend API.

**Solution**:
1. Check if backend server is running
2. Verify API URL is correct in frontend config
3. Check for network connectivity issues
4. Ensure there are no CORS issues
5. Try with a different network connection

### "Invalid JWT Token"

**Issue**: Authentication fails with token-related errors.

**Solution**:
1. Clear browser storage and log in again
2. Check if token is correctly stored and sent in requests
3. Verify JWT_SECRET is consistent across environments
4. Check for token expiration
5. Ensure token is correctly formatted in authorization header

## Authentication Issues

### Invalid Username Format
**Problem**: Username does not match required format.
**Solution**:
1. Check username format:
   - Superadmin: SA00000
   - Admin: UA00001
   - User: U00002
2. Ensure correct prefix
3. Verify number sequence
4. Contact admin if needed

### Login Failure
**Problem**: Unable to log in to the system.
**Solution**:
1. Verify username format
2. Check password requirements:
   - Minimum 8 characters
   - At least one number
   - At least one lowercase letter
   - At least one uppercase letter
   - At least one special character
3. Ensure account is authorized
4. Contact admin if issues persist

### Account Authorization
**Problem**: Account not authorized to access system.
**Solution**:
1. Check registration status
2. Contact system admin
3. Provide username details
4. Wait for authorization

### Account Lockout
**Problem**: Account locked due to multiple failed attempts.
**Solution**:
1. Wait for lockout period
2. Contact system admin
3. Request account unlock
4. Reset password if needed

## Password Issues

### Password Reset
**Problem**: Unable to reset password.
**Solution**:
1. Click forgot password
2. Enter username
3. Check email for reset link
4. Follow reset instructions
5. Set new password

### Password Requirements
**Problem**: Password does not meet requirements.
**Solution**:
1. Check password requirements:
   - Minimum 8 characters
   - At least one number
   - At least one lowercase letter
   - At least one uppercase letter
   - At least one special character
2. Create new password
3. Save changes
4. Test login

## User Management

### Profile Updates
**Problem**: Unable to update profile information.
**Solution**:
1. Check required fields
2. Verify data format
3. Save changes
4. Refresh page
5. Contact admin if needed

### Role Changes
**Problem**: Role not updated correctly.
**Solution**:
1. Contact system admin
2. Provide username
3. Request role change
4. Verify changes
5. Test access

## System Issues

### Database Connection
**Problem**: Unable to connect to database.
**Solution**:
1. Check MongoDB status
2. Verify connection string
3. Check network connection
4. Restart application
5. Contact admin if needed

### API Errors
**Problem**: API requests failing.
**Solution**:
1. Check API status
2. Verify endpoint URL
3. Check request format
4. Review error message
5. Contact admin if needed

## Common Error Messages

### Authentication Errors
- "Invalid username format"
  - Check username format
  - Verify prefix and number
  - Contact admin if needed

- "Invalid credentials"
  - Check username and password
  - Verify account authorization
  - Reset password if needed

- "Account not authorized"
  - Contact system admin
  - Provide username
  - Wait for authorization

### Validation Errors
- "Password too weak"
  - Check password requirements
  - Create stronger password
  - Save changes

- "Username already exists"
  - Choose different username
  - Contact admin if needed
  - Follow format guidelines

## Best Practices

### Prevention
- Use correct username format
- Create strong passwords
- Keep credentials secure
- Log out when done

### Resolution
- Check error messages
- Follow troubleshooting steps
- Contact admin if needed
- Document solutions

### Maintenance
- Update profile regularly
- Change password periodically
- Review account activity
- Report issues promptly

## Reporting Bugs

If you've tried the solutions above and still encounter issues, please report the bug following these steps:

1. Check existing issues on the repository to avoid duplicates
2. Create a new issue with a clear title and description
3. Include steps to reproduce the problem
4. Add error messages, screenshots, or console logs
5. Provide information about your environment (OS, browser, versions)
6. Tag the issue appropriately

Use the bug report template when creating a new issue on GitHub.

---

If you need further assistance, please create an issue on the [GitHub repository](https://github.com/imouatsi/Stock_HR) with detailed information about your problem.