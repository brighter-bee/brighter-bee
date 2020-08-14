# Brighter Bee
  
This is a web app for professional development and professional connection for students
  
## Deployment instructions 

### Backend 

Download Natural Language Tool Kit 
from https://urler.s3-ap-southeast-2.amazonaws.com/nltk_data.zip
unzip it and place it in your home directory,
or download from command line:
```
cd ~
wget https://urler.s3-ap-southeast-2.amazonaws.com/nltk_data.zip
unzip nltk_data.zip
```

(Download this project from GitHub:)
```
git clone https://github.com/Mate-work/Project-Integration.git
cd Project-Integration
```

Set up a virtual environment 
and install the required Python packages
``` 
cd forastudent  
pip install virtualenv  
virtualenv venv --python=python3.6  
source venv/bin/activate  
pip install -r requirements.txt  
```

Run the backend server
```
python manage.py runserver  
```  
  
### Frontend  
  
Install the required JavaScript packages
```  
cd my-app  
npm install 
```

Run the front server
(Wait several seconds for the code to be compiled)
```
npm start  
```  



## User guide and main features

### Find Jobs and Save Jobs
To find a job , user can click on the ‘Find Jobs’ Panel and search for a relevant job title in the search box on the top and click on ‘Search’ button to view the response from an external Job delivery API - Adzuna.
The job ads are displayed in card format one after the other and the card contains information about the job which helps the user decide which job is to be applied by clicking on the ‘Apply’ button on the card which wll redirect the user on to the corresponding Adzuna job listing.
The user can also save any of the the search results and choose to apply later from the ‘Saved Jobs’ section, and once the user 
has applied on that particular listing, he/she can choose to delete that particular job from his deck of saved jobs by clicking on the
‘Delete’ button displayed on the bottom of the card.

### Adzuna API Integration
Adzuna is a third party job ads system which offers the developer to utilize the api end points by generating a hashed API key which can be embedded as a part of the backend system and can be leveraged to retrive data from the platform securely and once the developer chooses to unlink the api , he/she can do so by regenerating a new api key which is different from the one embedded on the system so that system is not compromised or remains vulnerable to DDos attacks.

### Find Projects
The 'Find Projects' feature uses a combination of your resume and profile skills to show relevant projects that you may be interested in applying to. Make sure you have added skills to your profile and have uploaded a resume in order to maximise the effectiveness of this feature. You may do this by clicking on your profile icon at the top and selecting 'Profile'. Here, you will be able to enter skills and upload your resume. Once you have done this, please click on the 'Find Projects' tab on the left sidebar. The top 5 projects which match your skills and resume will be displayed. By clicking the 'Apply' button, you will be able to email the mentor in charge of that particular project to express your interest.

### Add Meeting and View Meetings
Click on the Scheduled Meetings button on the sidebar to open the Scheduled Meetings page where you can view
the meetings you are invited to, launch the associated Zoom meeting and cancel the meeting.
Click on the Create Meeting button on the sidebar to open the Create Meeting page where you can specify date, time, participants,
topic and duration to schedule a Zoom meeting.
On the Scheduled Meetings page, click the 'Launch Zoom' button under the meeting you want to join the Zoom call of; or click the 'Cancel Meeting' button under the meeting you want to cancel.
On the Create Meetings page, enter the fields and click the 'Create Meeting' button.

### Zoom Meeting API
The backend utilises the Zoom API to schedule meetings on Zoom. As the current implementation utilises the BrighterBee's own Zoom account, setting up your own Zoom functionality beyond the current features will require creating a JWT App on the Zoom marketplace https://marketplace.zoom.us/docs/guides/auth/jwt/. The submitted code utilises a non premium Zoom account that is limited to 100 requests a day and only some of the Zoom API requests. More information can be found at: https://marketplace.zoom.us/docs/api-reference/introduction.

### Forum
The forum page of the website can be used to post questions, share information, seek advices about courses, campus life, part-time job, all of those related to uni life.  The forum enables you to track your posts and discussion with peers.


  
## File structure documentation
  
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


## API Documentations (Swagger)
![APIs](https://urler.s3-ap-southeast-2.amazonaws.com/api1.jpg)
![APIs](https://urler.s3-ap-southeast-2.amazonaws.com/api2.jpg)
