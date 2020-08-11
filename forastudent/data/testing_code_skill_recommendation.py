flag = True
from collections import defaultdict


def recommend_skill_algo(user, user_skill_dict, category_skill_dict, project_skill_dict, count_skill_frequency):

    no_of_skill_project = defaultdict(int)
    no_of_skill_category = defaultdict(int)
    no_of_skill_short_of_project = defaultdict(int)

    result = ""

    for skill in user_skill_dict[user]:
        for key, value in project_skill_dict.items():
            if skill in value:
                no_of_skill_project[key] += 1
        for key, value in category_skill_dict.items():
            if skill in value:
                no_of_skill_category[key] += 1

    for key, value in no_of_skill_project.items():
        no_of_skill_short_of_project[key] = len(project_skill_dict[key]) - value

    # list of skills which are only short by 2 in the project
    skills = []
    t = 0;
    s = None

    no_of_skill_short_of_project = {k: v for k, v in
                                    sorted(no_of_skill_short_of_project.items(), key=lambda item: item[1]) if
                                    v != 0}

    if len(no_of_skill_short_of_project) > 0:
        s, t = next(iter(no_of_skill_short_of_project.items()))
        print(s,t)

    no_of_skill_category = {k: v for k, v in
                            sorted(no_of_skill_category.items(), reverse=True, key=lambda item: item[1])}

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

    # in all other cases (selects category which has maximum skills)

    if result == "":
        for key in no_of_skill_category.keys():
            possible_skills_dict = {}
            for skill in category_skill_dict[key]:
                if skill not in user_skill_dict[user]:
                    possible_skills_dict[skill] = count_skill_frequency[skill]
            possible_skills_dict = {k: v for k, v in
                                    sorted(possible_skills_dict.items(), reverse=True, key=lambda item: item[1])}
            if len(possible_skills_dict) > 0:
                m, n = next(iter(possible_skills_dict.items()))
                result = m
                break

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


    if flag:
        print(no_of_skill_project)
        print(no_of_skill_category)
        print(no_of_skill_short_of_project)
        print("result is", result)


    return result



person_id = 1
user_skill_dict = {1: [10], 2: [2, 3, 4], 3: [1,2,3,4,6,8], 4: [5,6,7,8,1,2]}
category_skill_dict = {1: [1,2,3,8, 6], 2: [4,7, 5], 3: [10,11,12]}
project_skill_dict = {1: [7,4], 2: [2, 3]}

skill_user_dict = {1: [1, 3, 4], 2: [1, 2, 3, 4], 3: [1, 2, 3], 4: [2, 3], 5: [4], 6: [3, 4], 7: [4], 8: [1,3,4], 10: [1] }
count_skill_frequency = defaultdict(int)
for key, value in skill_user_dict.items():
    count_skill_frequency[key] = len(value)

print(count_skill_frequency)

recommended_skill = recommend_skill_algo(person_id, user_skill_dict, category_skill_dict, project_skill_dict, count_skill_frequency)