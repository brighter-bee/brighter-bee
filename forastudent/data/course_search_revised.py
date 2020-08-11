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


'''Part 2: Extract Courses for a particular Skill'''

skill_list = ['Accessibility',
'Accounting',
'Accounting software',
'Advertising and promotion',
'After effects',
'Agile project management',
'Agile software development',
'Allyship',
'Amazon web services',
'Analog photography',
'Android development',
'Angular',
'Anti racism',
'Apis',
'Architectural design',
'Architectural photography',
'Architectural visualization',
'Art composition',
'Artificial intelligence',
'Asset management',
'Audio editing',
'Audio engineering',
'Audio equipment',
'Audio for video',
'Audio mastering',
'Audio mixing',
'Audio post production',
'Audio recording',
'Augmented reality',
'Autocad',
'Automotive design',
'Azure',
'B-B marketing',
'B-C marketing',
'Back end web development',
'Big data',
'BIM',
'Black and white photography',
'Blender',
'Brand design',
'Brand management',
'Business analysis',
'Business analytics',
'Business intelligence',
'Business strategy',
'C',
'C sharp',
'C++',
'Camtasia',
'Career management',
'Character animation',
'Cinema 4d',
'Cinematography',
'Civil engineering',
'Client operating systems',
'Cloud administration',
'Cloud development',
'Cloud foundations',
'Cloud platforms',
'Cloud security',
'Cloud services',
'Cloud storage',
'CNC and CAM',
'Coaching and mentoring',
'Color correction',
'Color theory',
'Comic book illustration',
'Communication',
'Compensation and benefits',
'Compositing',
'Computational design',
'Computer skills',
'Concept art',
'Construction',
'Construction management',
'Contact centers',
'Content management systems',
'Content marketing',
'Content strategy',
'Conversion marketing',
'Corporate finance',
'Corporate training',
'Creativity',
'Crisis management',
'CRM administration',
'CRM software',
'Cross platform development',
'Cryptocurrency',
'Cryptography',
'CSS',
'Customer service management',
'Customer service',
'D animation',
'D drafting and drawing',
'D lighting',
'D materials',
'D modeling',
'D particles and dynamics',
'D printing',
'D scanning',
'D sculpting',
'D textures',
'D tracking',
'Data analysis',
'Data centers',
'Data engineering',
'Data governance',
'Data modeling',
'Data privacy',
'Data resource management',
'Data science careers',
'Data visualization',
'Database administration',
'Database development',
'Decision making',
'Design business',
'Design patterns',
'Design thinking',
'Desktop databases',
'Devices',
'Devops foundations',
'Devops tools',
'Diagramming',
'Digital audio workstations',
'Digital painting',
'Digital publishing',
'Diversity and inclusion',
'Document management',
'Drawing',
'Dreamweaver',
'E commerce development',
'E learning software',
'Eclipse',
'Educational technology',
'Electrical engineering',
'Email',
'Email marketing',
'Enterprise architecture',
'Enterprise content management',
'Enterprise marketing',
'Entrepreneurship',
'Ethics and law',
'Event planning',
'Excel',
'Executive leadership',
'Express.js',
'Fashion design',
'Filmmaking',
'Flask',
'Forms',
'Freelancing',
'Front end web development',
'Full stack web development',
'Game development',
'Gis',
'Git',
'Glyphs app',
'Go',
'Google analytics',
'Hadoop',
'HDR photography',
'Help desk',
'Higher education',
'Hiring and interviewing',
'HR administration',
'HR software',
'HR strategy',
'HTML',
'Identity and access management',
'Illustration',
'Illustrator',
'Image editing',
'Incident response',
'Income tax',
'Indesign',
'Infographics',
'Information architecture',
'Instructional design',
'Interaction design',
'Interactive web content',
'Interior design',
'Internet of things',
'iOS',
'iOS development',
'IT automation',
'IT service management',
'Java',
'Javascript',
'Javascript frameworks',
'Job searching',
'K-1  education',
'Keying',
'Kotlin',
'Landscape photography',
'Layout and composition',
'Lead generation',
'Leadership skills',
'Learning and development',
'Lightroom',
'Linkedin',
'Linux',
'Live music performance',
'Logo design',
'Machine learning',
'Macro photography',
'Malware analysis',
'Management skills',
'Manufacturing',
'Marketing automation',
'Marketing strategy',
'Mathematica',
'Mechanical engineering',
'Meeting skills',
'MEP',
'Messaging',
'Microsoft development',
'Microsoft office',
'Microsoft project',
'Microsoft teams',
'Microsoft word',
'Minitab',
'Mobile application security',
'Mobile device management',
'Mobile games',
'Mobile marketing',
'Mobile photography',
'Mobile web design',
'Mongodb',
'Motion graphics',
'Motion typography',
'Multidevice design',
'Music business',
'Music composition',
'Music lessons',
'Music production',
'Music remixing',
'Music theory',
'Network administration',
'Network security',
'Night photography',
'Node.js',
'Nonprofit management',
'Note taking',
'NPM',
'Object oriented programming',
'Operating system distribution',
'Operations management',
'Organizational leadership',
'Outlook',
'Painting',
'Pay per click marketing',
'Pdf management',
'Penetration testing',
'Personal branding',
'Personal effectiveness',
'Personal finance',
'Personal productivity software',
'Photo business',
'Photo compositing',
'Photo restoration',
'Photo sharing',
'Photography gear',
'Photography lighting',
'Photography printing',
'Photojournalism',
'Photoshop',
'PHP',
'Podcasting',
'Portrait photography',
'Poster design',
'Power bi',
'Powerpoint',
'Premiere pro',
'Presentations',
'Previz',
'Print production',
'Privacy',
'Product and industrial design',
'Product management',
'Product photography',
'Programming foundations',
'Programming languages',
'Project leadership',
'Project management skills',
'Project management software',
'Prototyping',
'Public relations',
'Public speaking',
'Python',
'R',
'Raw processing',
'React.js',
'Real time',
'Real time scripting',
'Recording studio setup',
'Recruiting',
'Remote work',
'Rendering',
'Responsive web design',
'Retouching',
'Revit',
'Revit lt',
'Revit mep',
'Rhino',
'Rigging',
'Sales management',
'Sales metrics',
'Sales skills',
'SAP',
'SAS',
'Scala',
'Screencasting',
'Script writing',
'Search engine marketing (SEM)',
'Search engine optimization (SEO)',
'Security awareness',
'Security careers',
'Security management and policy',
'Security testing',
'Server administration',
'Service metrics',
'Shiny',
'Shooting video',
'Simulation',
'Small business finance',
'Small business management',
'Small business marketing',
'Small business sales',
'Social media marketing',
'Social selling',
'Software administration',
'Software architecture',
'Software deployment',
'Software design',
'Software development security',
'Software development tools',
'Software quality assurance',
'Software support',
'Software testing',
'Solidworks',
'Songwriting',
'Sound design',
'Spark',
'Spreadsheets',
'SPSS',
'SQL',
'SQLite',
'Stata',
'Statistics',
'Storyboarding',
'Street photography',
'Structural engineering',
'Student success skills',
'Supply chain management',
'Sustainability',
'Synthesis',
'Tableau',
'Talent management',
'Teaching',
'Teams and collaboration',
'Time lapse photography',
'Time management',
'Travel photography',
'Typography',
'Upgrade and maintenance',
'Usability',
'User interface prototyping',
'User research',
'UX design',
'Version control',
'Video color grading',
'Video conferencing',
'Video editing',
'Video gear',
'Video lighting',
'Video post production',
'Video pre production',
'Video production',
'Virtual instruments',
'Virtual reality',
'Virtualization',
'Visual effects',
'Visualization',
'Vue.js',
'Vulnerability management',
'Web application security',
'Web design business',
'Web development tools',
'Web marketing analytics',
'Web standards',
'Web typography',
'Webpack',
'Website graphics',
'Wedding photography',
'Windows server',
'Wireframing',
'Word processing',
'Wordpress',
'Writing',
'Zoom']

# skill dictionary where key is skill name and value is a list of upto 5 elements containing course name,
# course link, % match with skill name list is populated in descending order of % match with skill name
skill_dict = defaultdict(list)

course_link = "https://www.linkedin.com/learning/topics/{skill_name}?u=2087740"
course_link2 = "https://www.linkedin.com/learning/search?keywords={skill_name}&u=2087740"
# failure list for the incorrect urls
url_failure_list = []

# failure list for the skills which don't have any courses
skill_failure_list = []


for skill in skill_list:
    try:
        skill_ = skill.replace(" ", "-").lower()
        try:
            url = course_link2.format(skill_name=skill_)
            page = urlopen(url)
            page = page.read()
            soup = BeautifulSoup(page, 'lxml')
        except:
            url = course_link.format(skill_name=skill_)
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
                    if course_name.find("/") == -1:
                        course_name = course_name.replace("-", " ").capitalize()

                        if course_name not in course_list:
                            course_list.append(course_name)
                            # calculate fuzzy ratio to find similarity
                            Ratio = fuzz.partial_ratio(course_name.lower(), skill.lower())
                            skill_dict[skill].append((course_name, course['href'], Ratio))
                            # sort according to descending values of ratio and take top 5 courses
                            skill_dict[skill] = sorted(skill_dict[skill], key=lambda tup: tup[2], reverse=True)[:5]
        if len(course_list) < 1:
            print("--------FAILURE-------- " + skill)
            skill_failure_list.append(skill)
        print("success " + skill)
    except:
        print("---------URL FAILURE--------- " + skill)
        url_failure_list.append(skill)

# print(skill_dict)
skill_course_list = []
for key, value in skill_dict.items():
    for course in value:
        skill_course_list.append([key, course[0], course[1], course[2]])

# print(skill_course_list)

print("\nURL failure list")
for item in url_failure_list:
    print(item)

print("\nSKILL failure list")
for item in skill_failure_list:
    print(item)

with open("skill_course_revised.csv", "w") as f:
    wr = csv.writer(f)
    wr.writerows(skill_course_list)

# URL failure list
# success B-B marketing
# success B-C marketing
# C sharp
# Audio editing
# D lighting
# D scanning
# D textures
# Data centers
# Data modeling
# Image editing
# IT automation
# Mobile device management
# Powerpoint
# Recording studio setup
# Rigging
# Simulation
# Wireframing