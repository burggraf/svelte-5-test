# PocketBase Setup Documentation

## Task 16: Initialize PocketBase and Create Collections

### Setup Completed

1. **PocketBase Server Started**
   - PocketBase is running at: http://127.0.0.1:8090
   - REST API: http://127.0.0.1:8090/api/
   - Admin Dashboard: http://127.0.0.1:8090/_/

2. **Superuser Account**
   - To create a superuser account, open the admin dashboard URL provided in the console output
   - Or run: `pocketbase superuser upsert admin@example.com your-password`

3. **Users Collection Configuration**
   - The PocketBase users collection needs to be configured for avatar uploads
   - Navigate to Collections → users → Schema
   - Configure the "avatar" field (or create if not exists):
     - Type: File
     - Max Select: 1
     - Max Size: 5242880 (5MB)
     - Mime Types: image/jpeg, image/png, image/gif, image/webp

4. **File Serving Configuration**
   - Go to Settings → Files
   - Ensure "Max file size" is at least 5MB
   - File serving is enabled by default

5. **Testing the Complete Flow**
   - Start PocketBase: `pocketbase serve`
   - Start dev server: `npm run dev`
   - Navigate to http://localhost:5173
   - Register a new user account
   - Login with the account
   - Upload an avatar from the user dropdown menu
   - Verify avatar appears in the sidebar
   - Logout and login again to verify avatar persists

6. **CORS Configuration for Production**
   - For production deployment, configure CORS in PocketBase:
   - Go to Settings → Application → CORS
   - Add your production domain(s)

### Running PocketBase

To start PocketBase in the future:

```bash
pocketbase serve
```

The PocketBase data is stored in the `pb_data/` directory (which is gitignored).

### Notes

- This is a manual infrastructure setup task
- No git commit is required for this task
- PocketBase should be running whenever you're developing or testing the application
- The admin dashboard provides full control over collections, users, and settings
