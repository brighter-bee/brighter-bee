from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'


class Skill(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name + " - " + self.category.name


class Opportunity(models.Model):
    TYPES = (
        ('J', 'Job'),
        ('G', 'Graduate'),
        ('I', 'Internship'),
        ('R', 'Research'),
        ('O', 'Others')
    )
    type = models.TextField(choices=TYPES)
    name = models.CharField(max_length=100)
    company_name = models.TextField()
    location = models.TextField()
    desc = models.TextField()
    link = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    skills = models.ManyToManyField(Skill, blank=True)

    def __str__(self):
        return self.name + " - " + self.type

    class Meta:
        verbose_name_plural = 'Opportunities'


class Person(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    TYPES = (
        ('S', 'Student'),
        ('A', 'Academic Mentor'),
        ('I', 'Industry Mentor'),
        ('Z', 'Organization'),
        ('O', 'Others')
    )
    type = models.TextField(choices=TYPES, blank=True, null=True)
    name = models.CharField(max_length=100)
    desc = models.TextField(blank=True, null=True)
    location = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='images/', default='images/avatar.jpg', blank=True, null=True)
    resume = models.FileField(upload_to='resume/', blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    skills = models.ManyToManyField(Skill, blank=True)
    opportunities = models.ManyToManyField(Opportunity, blank=True)

    def __str__(self):
        return self.name + " - " + self.user.username

    def username(self):
        return self.user.username


class Meeting(models.Model):
    name = models.CharField(max_length=100)
    number = models.TextField()
    time = models.DateTimeField()
    participants = models.ManyToManyField(Person)

    def __str__(self):
        return self.name + " - " + self.number


class Course(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    link = models.TextField(blank=True, null=True)
    skills = models.ManyToManyField(Skill, blank=True)

    def __str__(self):
        return self.name


class Project(models.Model):
    name = models.CharField(max_length=1000)
    desc = models.TextField(blank=True, null=True)
    start_date = models.DateTimeField(blank=True, null=True)
    duration = models.CharField(max_length=200, blank=True, null=True)
    skills = models.ManyToManyField(Skill, blank=True)
    email = models.EmailField(blank=True)

    def __str__(self):
        return self.name


class ForumSection(models.Model):
    name = models.CharField(max_length=100)
    desc = models.TextField()
    order = models.PositiveIntegerField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    isDeleted = models.BooleanField(default=False)
    icon = models.ImageField(upload_to='images/', default='images/avatar.jpg')

    def __str__(self):
        return "Section: " + self.name


class ForumCategory(models.Model):
    name = models.CharField(max_length=100)
    desc = models.TextField()
    order = models.PositiveIntegerField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    isDeleted = models.BooleanField(default=False)
    section = models.ForeignKey(ForumSection, on_delete=models.CASCADE, related_name="BelongsToOneForumSection")

    def __str__(self):
        return "Category: " + self.name

    class Meta:
        verbose_name_plural = 'Forum Categories'


class Post(models.Model):
    title = models.CharField(max_length=50)
    markdown = models.CharField(max_length=500, null=True, blank=True)
    content = models.CharField(max_length=1000)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    isDeleted = models.BooleanField(default=False)
    poster = models.ForeignKey(Person, on_delete=models.CASCADE)
    # poster = models.ForeignKey(Person, on_delete=models.CASCADE)
    # category = models.ForeignKey(ForumCategory, on_delete=models.CASCADE, null=True, blank=True, db_column='category_id')
    category = models.ForeignKey(ForumCategory, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.title


class Reply(models.Model):
    markdown = models.TextField(null=True, blank=True)
    content = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)
    isDeleted = models.BooleanField(default=False)
    parent_id = models.IntegerField(default=0)
    replyTo_id = models.IntegerField(default=0)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    poster = models.ForeignKey(Person, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.poster.id) + " - reply"

    class Meta:
        verbose_name_plural = 'Replies'
