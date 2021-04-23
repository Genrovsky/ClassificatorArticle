import os
import lxml.etree as ET
from CollectionAndClassificationApp.models import Article
from ArticleClassificationWebService import settings
from django.db.models import Q

articleDir = "articles"
delimeter = "\\"

def parseArticleFromXml(nameXmlFile):
    articleDict = {}
    rootOfTree = ET.parse(nameXmlFile)
    articleDict["title"] = rootOfTree.find(".//title").text
    articleDict["category"] = rootOfTree.find(".//category").text.lower()
    articleDict["date"] = rootOfTree.find(".//date").text
    articleDict["text"] = rootOfTree.find(".//text").text
    return articleDict

def saveArticleDictInDB(articleDict):
    articleObject = Article()
    articleObject.title = articleDict["title"]
    articleObject.category = articleDict["category"]
    articleObject.date = articleDict["date"]
    articleObject.text = articleDict["text"]

    articleObject.save()

def setDBToDefaultTexts():
    Article.objects.all().delete()
    filesNames = os.listdir(settings.BASE_DIR + delimeter + articleDir)

    for fileName in filesNames:
        saveArticleDictInDB(parseArticleFromXml(settings.BASE_DIR + delimeter + articleDir + delimeter + fileName))

    print("Исходные статьи загружены в базу данных. Статьи добавленные до загрузки были удалены.")

def getArticleById(id):
    articleDict = {}
    try:
        articleObject = Article.objects.get(pk=id)

        articleDict["title"] = articleObject.title
        articleDict["category"] = articleObject.category
        articleDict["date"] = str(articleObject.date)
        articleDict["text"] = articleObject.text

        return articleDict

    except Article.DoesNotExist:
        return False

def updateArticle(id, articleDict):
    articleForUpdate = Article.objects.filter(pk=id)
    if articleForUpdate.exists():
        articleForUpdate.update(title = articleDict["title"],
                                category = articleDict["category"],
                                date = articleDict["date"],
                                text = articleDict["text"])
        return True
    else:
        return False

def addArticle(articleDict):
    articleObject = Article()

    articleObject.title = articleDict["title"]
    articleObject.category = articleDict["category"]
    articleObject.date = articleDict["date"]
    articleObject.text = articleDict["text"]

    articleObject.save()

    return True

def deleteArticleById(id):
    articleForDelete = Article.objects.filter(pk=id)
    if articleForDelete.exists():
        articleForDelete.delete()
        return True
    else:
        return False

def getAllArticles():
    articlesQuery = Article.objects.all()
    return articlesQuery

def getArticlesByCategory(category):
    articlesQuery = Article.objects.filter(category = category)
    return articlesQuery

def getArticlesByDate(leftDate, rightDate):
    articlesQuery = Article.objects.filter(date__range=(leftDate, rightDate))
    return articlesQuery

def searchArticles(searchline):
    qForSearch = Q()
    
    words = searchline.split()
    for word in words:
        qForSearch = qForSearch | Q(title__icontains = word) | Q(text__icontains = word)

    articlesQuery = Article.objects.filter(qForSearch)
    return articlesQuery

def getPageOfArticlesQuery(page, articlesQuery):
    countArticlesOnPage = 50
    articlesDict = {}
    articlesDict["articles"] = []
    articlesDict["countArticlesOnPage"] = countArticlesOnPage
    articlesQuery = articlesQuery.order_by("-pk")
    lenOfArticlesQuery = len(articlesQuery)
    articlesDict["len"] = lenOfArticlesQuery

    leftArticle = countArticlesOnPage * (page - 1)
    rightArticle = countArticlesOnPage * page

    if (leftArticle < lenOfArticlesQuery):
        if (rightArticle > lenOfArticlesQuery):
            rightArticle = lenOfArticlesQuery
    else:
        return False

    articlesQuery = articlesQuery[leftArticle: rightArticle]

    for articleObject in articlesQuery:
        articleDict = {}
        articleDict["id"] = articleObject.pk
        articleDict["title"] = articleObject.title
        articleDict["category"] = articleObject.category
        articleDict["date"] = str(articleObject.date)
        articlesDict["articles"].append(articleDict)

    return articlesDict
