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


class Person(models.Model):
    TYPES = (
        ('S', 'Student'),
        ('p', 'Professional'),
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
    isOriginal = models.BooleanField()
    content = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    poster = models.ForeignKey(Person, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Post(AbstractPost):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Reply(AbstractPost):
    replyTo = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.replyTo.id) + " - reply"

    class Meta:
        verbose_name_plural = 'Replies'
