
# Django Backend Setup

This is the Django backend for the Profile Lounge application.

## Setup Instructions

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

3. Install the requirements:
   ```
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Create a superuser (for admin access):
   ```
   python manage.py createsuperuser
   ```

6. Start the development server:
   ```
   python manage.py runserver
   ```

The server will start at http://localhost:8000/

## API Endpoints

- Register: POST `/api/register/`
- Login: POST `/api/login/`
- Logout: POST `/api/logout/`
- Get current user: GET `/api/user/`
- Profile management: `/api/profile/`

## Admin Interface

The Django admin interface is available at http://localhost:8000/admin/ where you can manage users and profiles.
