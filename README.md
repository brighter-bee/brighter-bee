# Brighter Bee

## Installation guide  
  
This is a web app for professional development and professional connection for students
  
### Backend 

```
cd ~
wget https://urler.s3-ap-southeast-2.amazonaws.com/nltk_data.zip
unzip nltk_data.zip
```

```
git clone https://github.com/Mate-work/Project-Integration.git
```

``` 
cd forastudent  
pip install virtualenv  
virtualenv venv --python=python3.6  
source venv/bin/activate  
pip install -r requirements.txt  
python manage.py migrate  
python manage.py loaddata fixtures.json  
python manage.py runserver  
```  
  
### Frontend  
  
```  
cd my-app  
npm install  
npm start  
```  
  
## Files structure  
  
### Backend  

 **forastudent/data/**
Data used to construct data fixtures

**forastudent/db.sqlite3**  
Database  
  
**forastudent/fixtures.json**  
Data fixtures (initial data) to populate a new database  
  
**forastudent/forastudent/settings.py**  
Django settings file
  
**forastudent/forastudent/urls.py**  
URL mappings file
  
**forastudent/manage.py**
Django runner file  
 
**forastudent/media/**  
User-uploaded files directory
  
**forastudent/person/admin.py**  
Admin settings file
  
**forastudent/person/api_views.py**  
General APIs
   
**forastudent/person/createMeeting.py**  
Meetings management APIs
  
**forastudent/person/forum_view.py**  
Forum APIs

**forastudent/person/project_view.py**  
Project recommendation APIs (with NLP)

**forastudent/person/skill_view.py**  
Skill recommendation APIs

![APIs](https://urler.s3-ap-southeast-2.amazonaws.com/api1.jpg)
![APIs](https://urler.s3-ap-southeast-2.amazonaws.com/api2.jpg)
  
**forastudent/person/migrations/**
Database migration files directory
  
**forastudent/person/models.py**  
Object Relational Mappings file
  
**forastudent/person/serializers.py**  
Object serializers file
  
**forastudent/requirements.txt**  
Packages and dependencies requirements file
  
  
### Frontend  

**my-app/src/App.js
my-app/src/index.js**
App root

**my-app/src/app-route.js** 
Browser router

 **my-app/src/signup.js**   
**my-app/src/login.js**
User authentication pages

**my-app/src/home.js**
Home page

**my-app/src/skillRecommend.js**
Skill and course recommendation page

**my-app/src/Profile.js  
my-app/src/Skills.js**
User profile page (with skill management)

**my-app/src/MentorCard.js  
my-app/src/Mentors.js** 
Find mentors page

**my-app/src/NewProject.js 
my-app/src/findProjects.js**
Add and file projects pages
  
**my-app/src/addMeeting.js
my-app/src/meetings.js**  
Schedule and list meetings pages
 
**my-app/src/findJobs.js 
my-app/src/jobCard.js**  
Find and list saved jobs pages
  
**my-app/src/forum.js  
my-app/src/forum_button.js  
my-app/src/post_form.js  
my-app/src/posts_and_detail.js  
my-app/src/reply_list.js**  
Forum pages
