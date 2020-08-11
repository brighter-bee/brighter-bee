from django.core import serializers
from django.db.models import Count
from django.http import HttpResponse
from .models import Project, Person
from django.views.decorators.http import require_http_methods
import requests
import time
import datetime as dt
import json
# Create your views here.
import numpy as np 
import pandas as pd
import PyPDF2
import io
import nltk
from nltk.corpus import stopwords 
from nltk.tokenize import word_tokenize 

stop_words = set(stopwords.words('english'))

def extractData(pdf_file, page):

	pdfReader = PyPDF2.PdfFileReader(pdf_file)
	pageObj = pdfReader.getPage(page)
	data = pageObj.extractText()
	return data

def getPageCount(pdf_file):

	pdfReader = PyPDF2.PdfFileReader(pdf_file)
	pages = pdfReader.numPages
	return pages


@require_http_methods(["GET"])
def recommend_project(request, person_id):

	#NLP LOGIC STARTS HERE 
	projs = requests.get('http://localhost:8000/api/project/')
	projs = projs.json()
	projs = pd.DataFrame.from_records(projs)

	user = requests.get("http://localhost:8000/api/v2/persons?user={}".format(person_id))
	user = user.json()
	user = pd.DataFrame.from_records(user)

	pdfFile = requests.get(user['resume'][0])
	pdfFile = io.BytesIO(pdfFile.content)
	numPages = getPageCount(pdfFile)

	resume_desc = []

	for i in range(numPages):
		text = extractData(pdfFile, i)
		resume_desc.append(text)

	for i in range(len(resume_desc)):
		resume_desc[i] = resume_desc[i].split()

	resume_desc = [item for sublist in resume_desc for item in sublist]

	common_skills = []
	similarity_score = []
	for index, row in projs.iterrows():
		common_skill_count =  sum(x == y for x, y in zip(user['skills'][0], row['skills']))
		common_skills.append(common_skill_count)

		proj_desc = word_tokenize(row['desc'])
		proj_desc = [word.lower() for word in proj_desc]
		proj_desc = [w for w in proj_desc if w not in stop_words and w not in (',','.','(',')','[',']')]

		resume_desc = [word.lower() for word in resume_desc]
		resume_desc = [w for w in resume_desc if w not in stop_words and w not in (',','.','(',')','[',']')]

		similarity = len(set(proj_desc) & set(resume_desc)) / float(len(set(proj_desc) | set(resume_desc))) * 100
		similarity_score.append(similarity)

	projs['common_skills'] = common_skills
	projs['similarity_score'] = similarity_score

	#map skill id to skill name
	skills = requests.get("http://localhost:8000/api/v2/skills")
	skills = skills.json()
	skills = pd.DataFrame.from_records(skills)

	for index, row in projs.iterrows(): 
		skill_name = []
		for s in row['skills']:
			skill_name_temp = skills[(skills['id']==s)]['name'].astype('str').values
			skill_name.append(skill_name_temp[0])
		skill_name = ', '.join(skill_name)
		projs.set_value(index,'skills', skill_name)

	#format date
	projs['start_date'] = projs['start_date'].str[:10]



	#limit description to 50 words
	new_desc_arr = []
	for index, row in projs.iterrows(): 
		desc_arr = row['desc'].split() 
		desc_arr = desc_arr[:50]
		new_desc = ' '.join(desc_arr)
		new_desc = new_desc+'...'
		new_desc_arr.append(new_desc)

	projs['short_desc'] = new_desc_arr

	projs = projs.sort_values(['common_skills', 'similarity_score'], ascending=False)

	#get top 5 projects 
	projs = projs.head(5)

	projs = projs.to_json(orient = 'records')
	projs = json.loads(projs)
	projs = json.dumps(projs)


	return HttpResponse(projs)

