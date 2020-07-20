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
    desc = models.TextField()
    link = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name + " - " + self.type

    class Meta:
        verbose_name_plural = 'Opportunities'


class ForumSection(models.Model):
    name = models.CharField(max_length=100)
    desc = models.TextField()
    order = models.PositiveIntegerField()
    isDeleted = models.BooleanField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    icon = models.ImageField(upload_to='images/', default='images/avatar.jpg')

    def __str__(self):
        return "Category: " + self.name


class ForumCategory(ForumSection):
    section = models.ForeignKey(ForumSection, on_delete=models.CASCADE, related_name="BelongsForumSection")

    def __str__(self):
        return "Category: " + self.name


class Person(models.Model):
    TYPES = (
        ('S', 'Student'),
        ('A', 'Academic Mentor'),
        ('I', 'Industry Mentor'),
        ('Z', 'Organization'),
        ('O', 'Others')
    )
    type = models.TextField(choices=TYPES)
    name = models.CharField(max_length=100)
    desc = models.TextField()
    location = models.TextField()
    avatar = models.ImageField(upload_to='images/', default='images/avatar.jpg')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    skills = models.ManyToManyField(Skill, blank=True)
    opportunities = models.ManyToManyField(Opportunity, blank=True)
    forumSection = models.ManyToManyField(ForumSection, blank=True, related_name="ManagesForumSection")
    forumCategory = models.ManyToManyField(ForumCategory, blank=True, related_name="ManagesForumCategory")

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


class AbstractPost(models.Model):
    isDeleted = models.BooleanField()
    content = models.TextField()
    markdown = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    poster = models.ForeignKey(Person, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Post(AbstractPost):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(ForumCategory, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name


class Reply(AbstractPost):
    replyTo = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.replyTo.id) + " - reply"

    class Meta:
        verbose_name_plural = 'Replies'


class Course(models.Model):
    code = models.CharField(max_length=100)
    name = models.CharField(max_length=100, blank=True, null=True)
    link = models.TextField(blank=True, null=True)
    skills = models.ManyToManyField(Skill, blank=True)

    def __str__(self):
        return self.code + " " + self.name
