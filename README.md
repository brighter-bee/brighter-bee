# Installation guide

This is a web app for professional development and professional connection for a student

## Backend

```
cd forastudent
pip install virtualenv
virtualenv venv --python=python3.6
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata fixtures.json
python manage.py loaddata fixtures2.json
python manage.py runserver
```

## Frontend

```
cd my-app
npm install
npm start
```

# Files structure

## Backend

### forastudent/data/category_skill_course.xlsx


### forastudent/data/course_revised.xlsx


### forastudent/data/course_search.py


### forastudent/data/course_search_revised.py


### forastudent/data/data.xlsx


### forastudent/data/testing_code_skill_recommendation.py


### 


### forastudent/db.sqlite3
This is our database

### forastudent/fixtures.json
This is our initial data to populate a new database

### 


### forastudent/forastudent/settings.py


### forastudent/forastudent/urls.py


### 


### forastudent/manage.py


### 


### forastudent/media/images/


### forastudent/media/resume/


### 


### forastudent/person/admin.py


### forastudent/person/api_views.py


### forastudent/person/apps.py


### forastudent/person/createMeeting.py


### forastudent/person/forum_view.py


### forastudent/person/migrations/__init__.py


### forastudent/person/models.py


### forastudent/person/project_view.py


### forastudent/person/serializers.py


### forastudent/person/skill_view.py


### forastudent/person/tests.py


### forastudent/person/views.py


### forastudent/requirements.txt


## Frontend

### my-app/src/App.css


### my-app/src/App.js


### my-app/src/App.test.js


### my-app/src/MentorCard.js


### my-app/src/Mentors.js


### my-app/src/NewProject.js


### my-app/src/Profile.js


### my-app/src/Skills.js


### my-app/src/addMeeting.js


### my-app/src/app-route.js


### my-app/src/findJobs.js


### my-app/src/findProjects.js


### my-app/src/forum.js


### my-app/src/forum_button.js


### my-app/src/home.js


### my-app/src/index.css


### my-app/src/index.js


### my-app/src/jobCard.js


### my-app/src/login.js


### my-app/src/logo.svg


### my-app/src/meetings.js


### my-app/src/post_form.js


### my-app/src/posts_and_detail.js


### my-app/src/reply_list.js


### my-app/src/serviceWorker.js


### my-app/src/setupTests.js


### my-app/src/signup.js


### my-app/src/skillRecommend.js
