# Installation guide

This is a web app for professional development and professional connection for a student

## Frontend

### Prerequisites

Download and setup node using link https://nodejs.org/en/

```
cd my-app
npm install
npm start
```

## Backend

```
cd forastudent
pip install virtualenv
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata fixtures.json
python manage.py runserver
```

Add your API endpoints in person/api_views.py
(See docs - Django REST Framework)
Add url paths in forastudent/urls.py
(See docs - Django)
Access these endpoints in React

Send me message at 0405086261 if I am not on Slack
