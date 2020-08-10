'''
Extract skills and associated learning courses for a particular category from LinkedIn
Developed by: Sahil Punchhi for COMP9323: Software as a Service Project
version 1.0
'''

import os
from bs4 import BeautifulSoup
from urllib.request import urlopen
import time
from fuzzywuzzy import fuzz
import csv
from collections import defaultdict

path = '/Users/sahilpunchhi/Desktop'
os.chdir(path)

start_time = time.time()


'''Part 1: Extract Skills for a particular Category'''

categories = ['Business Analysis and Strategy',
              'Business Software and Tools',
              'Career Development 5',
              'Customer Service 3',
              'Finance and Accounting',
              'Human Resources 3',
              'Leadership and Management',
              'Marketing 2',
              'Professional Development',
              'Project Management',
              'Sales 3',
              'Small Business and Entrepreneurship',
              'Training and Education',
              'AEC',
              'Animation and Illustration',
              'Audio and Music',
              'Graphic Design',
              'Motion Graphics and VFX',
              'Photography 2',
              'Product and Manufacturing',
              'User Experience',
              'Video 2',
              'Visualization and Real-Time',
              'Web Design',
              'Cloud Computing 5',
              'Data Science',
              'Database Management',
              'DevOps',
              'IT Help Desk 5',
              'Mobile Development',
              'Network and System Administration',
              'Security 3',
              'Software Development',
              'Web Development']

topic = "https://www.linkedin.com/learning/topics/{category_name}?u=2087740"

category_skill = defaultdict(list)
for category in categories:
    category_ = category.replace(" ", "-").lower()
    url = topic.format(category_name=category_)
    try:
        page = urlopen(url)
        page = page.read()
        soup = BeautifulSoup(page, 'lxml')
        # print(soup.prettify())
        skills = soup.findAll("a", class_="pill pill-list__pill")
        skills = [skill.text.strip() for skill in skills]
        if len(skills) == 0:
            print(category)
        # make some changes because of the way url is setup
        category = category.replace("3", "").replace("5", "").replace("7", "").replace("2", "").strip()
        category_skill[category] = skills
    except:
        print(category)

# add software skills separately

category_skill["Software-Technology"] = [
'Java',
'JavaScript',
'Power BI',
'Python',
'SQL',
'SQLite',
'Tableau',
'Windows Server',
'WordPress',
'Linux',
'Azure',
'Amazon web services',
'PHP',
'iOS',
'CSS',
'HTML',
'React.js',
'Node.js',
'MongoDB',
'Express.js',
'Vue.js',
'Webpack',
'NPM',
'Angular',
'C',
'C++',
'Go',
'R',
'git',
'scala',
'Spark',
'hadoop',
'kotlin',
'Eclipse'
]

category_skill["Software-Creative"] = ['After Effects',
'AutoCAD',
'Blender',
'Illustrator',
'InDesign',
'Lightroom',
'Photoshop',
'Premiere Pro',
'Revit',
'Revit LT',
'Revit MEP',
'SOLIDWORKS',
'Dreamweaver',
'Rhino',
'Glyphs App',
'Cinema 4D',
'3',
                                       ]

category_skill["Software-Business"] = ['Excel',
'Microsoft Word',
'Outlook',
'Camtasia',
'Google Analytics',
'LinkedIn',
'Microsoft Office',
'Microsoft Project',
'Microsoft Teams',
'Minitab',
'Power BI',
'PowerPoint',
'Zoom',
'SAS',
'SAP',
'SPSS',
'Stata',
'Mathematica',
'Shiny'
]

category_skill['Business Analysis and Strategy'].append('business-intelligence-2')

category_skill['Marketing'].append('business-intelligence-2')
category_skill['Marketing'].append('search-engine-marketing-sem')

category_skill['Professional Development'].append('writing-7')
category_skill['Small Business and Entrepreneurship'].append('freelancing-3')

category_skill['AEC'].append('gis-7')
category_skill['AEC'].append('Civil Engineering 3')
category_skill['AEC'].append('Architectural Design 2')
category_skill['AEC'].append('MEP 3')
category_skill['AEC'].append('Construction 3')

category_skill['Audio and Music'].append('Songwriting 2')
category_skill['Audio and Music'].append('Music Theory 2')

category_skill['Product and Manufacturing'].append('Manufacturing 3')

category_skill['Data Science'].append('business-intelligence-2')
category_skill['Data Science'].append('GIS 7')
category_skill['Data Science'].append('artificial-intelligence-ai')

category_skill['Network and System Administration'].append('Enterprise Content Management 3')
category_skill['Software Development'].append('Programming Foundations 3')


'''Part 2: Extract Courses for a particular Skill'''

# skill dictionary where key is skill name and value is a list of upto 5 elements containing course name,
# course link, % match with skill name list is populated in descending order of % match with skill name
skill_dict = defaultdict(list)

course_link = "https://www.linkedin.com/learning/topics/{skill_name}?u=2087740"
course_link2 = "https://www.linkedin.com/learning/search?keywords={skill_name}&u=2087740"
# failure list for the incorrect urls
url_failure_list = []

# failure list for the skills which don't have any courses
skill_failure_list = []

for category, skill_list in category_skill.items():
    for skill in skill_list:
        try:
            skill_ = skill.replace(" ", "-").lower()
            try:
                url = course_link.format(skill_name=skill_)
                page = urlopen(url)
                page = page.read()
                soup = BeautifulSoup(page, 'lxml')
            except:
                url = course_link2.format(skill_name=skill_)
                page = urlopen(url)
                page = page.read()
                soup = BeautifulSoup(page, 'lxml')
            # print(soup.prettify())
            course_list = []
            for course in soup.find_all('a', href=True):
                if course['href'].startswith("https://www.linkedin.com/learning/"):
                    if not course['href'].startswith("https://www.linkedin.com/learning/topics/"):
                        # extract course name from course url
                        left = 'https://www.linkedin.com/learning/'
                        right = '?'

                        course_name = course['href'][course['href'].index(left) + len(left):course['href'].index(right)]
                        course_name = course_name.replace("-", " ").replace("/", " - ").capitalize()

                        if course_name not in course_list:
                            course_list.append(course_name)
                            # calculate fuzzy ratio to find similarity
                            Ratio = fuzz.partial_ratio(course_name.lower(), skill.lower())
                            skill_1 = skill.replace("-", " ").replace("2", " ").replace("3", " ").replace("5", " ").replace("7", " ").strip().capitalize()
                            skill_dict[skill_1].append((category, course_name, course['href'], Ratio))
                            # sort according to descending values of ratio and take top 5 courses
                            skill_dict[skill_1] = sorted(skill_dict[skill_1], key=lambda tup: tup[3], reverse=True)[:5]
            if len(course_list) < 1:
                print("--------FAILURE-------- " + category, skill)
                skill_failure_list.append((category, skill))
            print("success " + category, skill)
        except:
            print("---------URL FAILURE--------- " + category, skill)
            url_failure_list.append((category, skill))

# print(skill_dict)
skill_course_list = []
for key, value in skill_dict.items():
    for course in value:
        skill_course_list.append([key, course[0], course[1], course[2], course[3]])

# print(skill_course_list)

print("\nURL failure list")
for item in url_failure_list:
    print(item)

print("\nSKILL failure list")
for item in skill_failure_list:
    print(item)

with open("category_skill_course.csv", "w") as f:
    wr = csv.writer(f)
    wr.writerows(skill_course_list)
