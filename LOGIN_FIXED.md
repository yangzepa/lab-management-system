# Login Issue Fixed

## Problem
Login was completely broken after database reset. All login attempts failed with "Invalid username or password".

## Root Causes
1. **`enabled` field was NULL** - The users table `enabled` column (type: bit(1)) was not set, preventing authentication
2. **Invalid BCrypt hash** - The password hash in data.sql didn't match any actual password

## Solution Applied
1. Fixed the `enabled` field:
   ```sql
   UPDATE users SET enabled = b'1' WHERE username = 'admin';
   ```

2. Generated fresh BCrypt hash for password "admin":
   ```bash
   python3 -c "import bcrypt; print(bcrypt.hashpw(b'admin', bcrypt.gensalt(rounds=10)).decode('utf-8'))"
   ```
   Result: `$2b$10$nwv5WiQ2dKKfDKpDEo2IIOXyG2IN.oWBKVrBkezWkH3joIIR0TJSK`

3. Updated database with working hash:
   ```sql
   UPDATE users SET password = '$2b$10$nwv5WiQ2dKKfDKpDEo2IIOXyG2IN.oWBKVrBkezWkH3joIIR0TJSK' WHERE username = 'admin';
   ```

4. Updated `data.sql` file with correct hash for all users

## Current Login Credentials
**Username:** `admin`
**Password:** `admin`

All researcher accounts also use password: `admin`
- park / admin
- choi / admin
- hwang / admin
- kim.b / admin
- kang / admin
- kim.k / admin

## Verified Working Features
✅ Login with admin/admin
✅ JWT token generation
✅ Public API endpoints (researchers, projects)
✅ Image upload via /files/**
✅ Notice CRUD operations
✅ Role-based access control

## Files Modified
1. `/Users/yangzepa/Documents/labwebpage/src/main/resources/data.sql` - Updated BCrypt hashes

## Next Steps
The system is now fully operational. You can:
1. Login to the admin panel at http://localhost:3000/login
2. Create and manage notices with image attachments
3. View and edit researchers, projects, and tasks
4. All previously implemented features are working correctly

## Important Note
The database now has the correct password hashes. If you reload data.sql in the future, all accounts will have password: `admin`
