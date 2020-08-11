
from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection
from collections import defaultdict
from django.views.decorators.http import require_http_methods
import random
# Create your views here.

flag = False # print flag

# Skill Recommendation View in Flask
user_skill_dict = defaultdict(list)
project_skill_dict = defaultdict(list)
category_skill_dict = defaultdict(list)

@require_http_methods(["GET"])
def recommend_skill(request, person_id):

    # user id is same as person id

    data = {
        'recommended_skill': "",
        'course_list': []
    }

    ########### for testing purposes #########
    with connection.cursor() as cursor:
        cursor.execute('''SELECT * FROM person_person a''')
        rows = cursor.fetchall()
    for row in rows:
        if flag:
            print(row)
    with connection.cursor() as cursor:
        cursor.execute('''SELECT * FROM person_skill a''')
        rows = cursor.fetchall()
    for row in rows:
        if flag:
            print(row)
    with connection.cursor() as cursor:
        cursor.execute('''SELECT * FROM person_project a''')
        rows = cursor.fetchall()
    for row in rows:
        if flag:
            print(row)
    with connection.cursor() as cursor:
        cursor.execute('''SELECT * FROM person_person_skills a''')
        rows = cursor.fetchall()
    for row in rows:
        if flag:
            print(row)
    with connection.cursor() as cursor:
        cursor.execute('''SELECT * FROM person_project_skills a''')
        rows = cursor.fetchall()
    for row in rows:
        if flag:
            print(row)
    ########################################

    # dictionary for skills of each user
    # key here is user id and value here is list of skill ids for that user
    def user_skill():
        my_user_skill_dict = defaultdict(list)
        with connection.cursor() as cursor:
            cursor.execute('''SELECT a.id, b.skill_id FROM person_person a
                            LEFT JOIN person_person_skills b on a.id=b.person_id
                           ''')
            rows = cursor.fetchall()
        for row in rows:
            my_user_skill_dict[row[0]].append(row[1])
        return my_user_skill_dict

    # dictionary for how many people possess a particular Skill
    # key here is skill id and value here is list of person id
    def user_skill_reverse():
        my_user_skill_dict_reverse = defaultdict(list)
        with connection.cursor() as cursor:
            cursor.execute('''SELECT a.id, b.skill_id FROM person_person a
                            LEFT JOIN person_person_skills b on a.id=b.person_id
                           ''')
            rows = cursor.fetchall()
        for row in rows:
            my_user_skill_dict_reverse[row[1]].append(row[0])
        return my_user_skill_dict_reverse

    # dictionary for category and associated skills
    # key here is category id and value here is list of skill id beloging to that category
    def category_skill():
        my_category_skill_dict = defaultdict(list)
        with connection.cursor() as cursor:
            cursor.execute('''SELECT a.id, a.category_id FROM person_skill a''')
            rows = cursor.fetchall()
        for row in rows:
            my_category_skill_dict[row[1]].append(row[0])
        return my_category_skill_dict

    # dictionary for project and associated skills
    # key here is project id and value here is list of skill id beloging to that project
    def project_skill():
        my_project_skill_dict = defaultdict(list)
        with connection.cursor() as cursor:
            cursor.execute('''SELECT a.project_id, a.skill_id FROM person_project_skills a''')
            rows = cursor.fetchall()
        for row in rows:
            my_project_skill_dict[row[0]].append(row[1])
        return my_project_skill_dict


    user_skill_dict = user_skill()
    category_skill_dict = category_skill()
    project_skill_dict = project_skill()
    skill_user_dict = user_skill_reverse() # reverse of user skill dict

    count_skill_frequency = defaultdict(int)
    for key, value in skill_user_dict.items():
        count_skill_frequency[key] = len(value)

    if flag:
        print(user_skill_dict)
        print(category_skill_dict)
        print(project_skill_dict)

    # skill recommendation algorithm
    def recommend_skill_algo(user, user_skill_dict, category_skill_dict, project_skill_dict, count_skill_frequency):

        try:
            no_of_skill_project = defaultdict(int)
            no_of_skill_category = defaultdict(int)
            no_of_skill_short_of_project = defaultdict(int)

            result = ""

            for skill in user_skill_dict[user]:
                for key, value in project_skill_dict.items():
                    if skill in value:
                        no_of_skill_project[key] += 1
                for key,value in category_skill_dict.items():
                    if skill in value:
                        no_of_skill_category[key] += 1

            for key,value in no_of_skill_project.items():
                no_of_skill_short_of_project[key] = len(project_skill_dict[key])-value

            # list of skills which are only short by 2 in the project
            skills = []
            t = 0; s = None

            no_of_skill_short_of_project = {k: v for k, v in sorted(no_of_skill_short_of_project.items(), key=lambda item: item[1]) if v != 0}

            if len(no_of_skill_short_of_project) > 0:
                s,t = next(iter(no_of_skill_short_of_project.items()))

            no_of_skill_category = {k: v for k, v in sorted(no_of_skill_category.items(), reverse=True, key=lambda item: item[1])}

            # if short of only 1 skill in the project
            if t == 1:
                project = s
                for skill in project_skill_dict[s]:
                    if skill not in user_skill_dict[user]:
                        result = skill
                        break


            # if short of 2 skills in the project then selects the skill of that category for which user already has maximum skills
            elif t == 2:
                project = s
                for skill in project_skill_dict[s]:
                    if skill not in user_skill_dict[user]:
                        skills.append(skill)

                for key in no_of_skill_category.keys():
                    for skill in skills:
                        if skill in category_skill_dict[key]:
                            result = skill
                            break

            # in all other cases (selects skill from that category which has maximum user's skills)
            # also suggest the skill which most number of users already have
            if result == "":
                for key in no_of_skill_category.keys():
                    possible_skills_dict = {}
                    for skill in category_skill_dict[key]:
                        if skill not in user_skill_dict[user]:
                            possible_skills_dict[skill] = count_skill_frequency[skill] # check for frequency of that skill
                    possible_skills_dict = {k: v for k, v in sorted(possible_skills_dict.items(), reverse=True, key=lambda item: item[1])}
                    if len(possible_skills_dict) > 0:
                        m,n = next(iter(possible_skills_dict.items())) # suggests skill which has maximum frequency
                        result = m
                        break

            # if still can't find suitable skill then goes with t=3 (short of 3 or more skills in a project) and so on
            if result=="":
                possible_skills_dict = {}
                if s:
                    for skill in project_skill_dict[s]:
                        if skill not in user_skill_dict[user]:
                            possible_skills_dict[skill] = count_skill_frequency[skill]
                            possible_skills_dict = {k: v for k, v in
                                            sorted(possible_skills_dict.items(), reverse=True, key=lambda item: item[1])}
                    if len(possible_skills_dict) > 0:
                        m, n = next(iter(possible_skills_dict.items()))
                        result = m


            with connection.cursor() as cursor:
                cursor.execute('''SELECT a.name FROM person_skill a WHERE a.id = %s''', [result])
                row = cursor.fetchone()
                recommended_skill = row[0]

            if flag:
                print(no_of_skill_project)
                print(no_of_skill_category)
                print(no_of_skill_short_of_project)
                print("result is", result)
                print(recommended_skill)

            return recommended_skill

        # if no skill then suggests inter-personal skill
        except:
            recommended_skill = random.choice(["Teams and collaboration", "Leadership skills", "Personal effectiveness", "Time management", "Microsoft teams"])
            return recommended_skill


    recommended_skill = recommend_skill_algo(person_id, user_skill_dict, category_skill_dict, project_skill_dict, count_skill_frequency)

    course_list = []
    with connection.cursor() as cursor:
        cursor.execute('''SELECT b.name, b.link
                          FROM person_course_skills a
                          LEFT JOIN person_course b on a.course_id = b.id
                          WHERE a.skill_id = (select c.id from person_skill c where c.name = %s)''', [recommended_skill])
        rows = cursor.fetchall()


    for row in rows:
        course_data = {
            'course_name': row[0],
            'course_link': row[1]}

        data['course_list'].append(course_data)

    return JsonResponse({
        'recommended_skill': recommended_skill,
        'course_list': data['course_list']
    })
