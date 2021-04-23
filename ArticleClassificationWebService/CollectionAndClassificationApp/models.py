from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=400)
    category = models.CharField(max_length=50)
    date = models.DateField('pub date')
    text = models.TextField()