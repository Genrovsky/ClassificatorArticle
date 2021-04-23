from CollectionAndClassificationApp import collection
from CollectionAndClassificationApp import validation
from CollectionAndClassificationApp import classification
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.html import escape
from datetime import datetime
import json

response415 = "this content type is wrong"
response405 = "forbidden method"
response404 = "page not found"
response400 = "bad request"
response200 = "success"

secretAccessKey = "awefIOWf1"

@csrf_exempt
def dbToDefault(request):
    if request.method == "POST":
        if request.content_type != "application/json":
            return HttpResponse(response415, status=415)
        
        flagNext = True
        secretDict = validation.secretJsonValidation(request.body)
        if not secretDict:
            flagNext = False

        if flagNext and secretAccessKey != secretDict["secret"]:
            flagNext = False

        if flagNext:
            collection.setDBToDefaultTexts()
            return HttpResponse(response200)
        else:
            return HttpResponse(response400, status=400)
    else:
        return HttpResponse(response405, status=405)

@csrf_exempt
def fitAndSaveModel(request):
    if request.method == "POST":
        if request.content_type != "application/json":
            return HttpResponse(response415, status=415)

        flagNext = True
        secretDict = validation.secretJsonValidation(request.body)
        if not secretDict:
            flagNext = False

        if flagNext and secretAccessKey != secretDict["secret"]:
            flagNext = False

        if flagNext:
            classification.fitAndSaveModel()
            return HttpResponse(response200)
        else:
            return HttpResponse(response400, status=400)
    else:
        return HttpResponse(response405, status=405)

@csrf_exempt
def textClassification(request):
    if request.method == "POST":
        if request.content_type != "application/json":
            return HttpResponse(response415, status=415)

        textDict = validation.classifiyTextValidation(request.body)
        if textDict:
            categoryDict = classification.textClassify(textDict["text"])
            return HttpResponse(json.dumps(categoryDict), content_type="application/json")
        else:
            return HttpResponse(response400, status=400)
    else:
        return HttpResponse(response405, status=405)

@csrf_exempt
def operationsOnArticle(request, id):
    requiredMethods = ["GET", "DELETE", "PUT"]
    if request.method == "GET":
        articleDict = collection.getArticleById(id)
        if articleDict:
            articleDict["title"] = escape(articleDict["title"])
            articleDict["text"] = escape(articleDict["text"])
            return HttpResponse(json.dumps(articleDict), content_type="application/json")
        else:
            return HttpResponse(response404, status=404)

    if request.method == "DELETE":
        deleteResult = collection.deleteArticleById(id)
        if deleteResult:
            return HttpResponse(response200)
        else:
            return HttpResponse(response400, status=400)

    if request.method == "PUT":
        if request.content_type != "application/json":
            return HttpResponse(response415, status=415)

        articleDict = validation.articleValidation(request.body)
        if articleDict:
            updateResult = collection.updateArticle(id, articleDict)
            if updateResult:
                return HttpResponse(response200)
            else:
                return HttpResponse(response400, status=400)
        else:
            return HttpResponse(response400, status=400)

    if not (request.method in requiredMethods):
        return HttpResponse(response405, status=405)

@csrf_exempt
def addArticle(request):
    if request.method == "POST":
        if request.content_type != "application/json":
            return HttpResponse(response415, status=415)

        articleDict = validation.articleValidation(request.body)
        if articleDict:
            collection.addArticle(articleDict)
            return HttpResponse(response200)
        else:
            return HttpResponse(response400, status=400)
    else:
        return HttpResponse(response405, status=405)
        
@csrf_exempt
def getArticlesOnPage(request, page):
    if request.method == "GET":
        page = int(page)
        if validation.pageValidation(page):
            articlesDict = collection.getPageOfArticlesQuery(page, collection.getAllArticles())
            if articlesDict:
                for article in articlesDict["articles"]:
                    article["title"] = escape(article["title"])
                return HttpResponse(json.dumps(articlesDict), content_type="application/json")
            else:
                return HttpResponse(response404, status=404)
        else:
            return HttpResponse(response400, status=400)
    else:
        return HttpResponse(response405, status=405)

@csrf_exempt
def getArticlesByCategoryOnPage(request, category, page):
    if request.method == "GET":
        page = int(page)
        flagNext = True;
        if not validation.categoryValidation(category):
            flagNext = False
        if flagNext and not validation.pageValidation(page):
            flagNext = False

        if flagNext:
            articlesDict = collection.getPageOfArticlesQuery(page, collection.getArticlesByCategory(category))
            if articlesDict:
                for article in articlesDict["articles"]:
                    article["title"] = escape(article["title"])
                return HttpResponse(json.dumps(articlesDict), content_type="application/json")
            else:
                return HttpResponse(response404, status=404)
        else:
            return HttpResponse(response400, status=400)
    else:
        return HttpResponse(response405, status=405)

@csrf_exempt
def getArticlesByDateOnPage(request, leftDate, rightDate, page):
    if request.method == "GET":
        page = int(page)
        flagNext = True;
        if not validation.dateValidation(leftDate):
            flagNext = False
        if flagNext and not validation.dateValidation(rightDate):
            flagNext = False
        if flagNext and not validation.pageValidation(page):
            flagNext = False
        if flagNext and datetime.strptime(leftDate, "%Y-%m-%d") > datetime.strptime(rightDate, "%Y-%m-%d"):
            flagNext = False

        if flagNext:
            articlesDict = collection.getPageOfArticlesQuery(page, collection.getArticlesByDate(leftDate, rightDate))
            if articlesDict:
                for article in articlesDict["articles"]:
                    article["title"] = escape(article["title"])
                return HttpResponse(json.dumps(articlesDict), content_type="application/json")
            else:
                return HttpResponse(response404, status=404)
        else:
            return HttpResponse(response400, status=400)
    else:
        return HttpResponse(response405, status=405)

@csrf_exempt
def searchArticlesOnPage(request, searchline, page):
    if request.method == "GET":
        page = int(page)
        flagNext = True;
        if not validation.searchlineValidation(searchline):
            flagNext = False
        if flagNext and not validation.pageValidation(page):
            flagNext = False

        if flagNext:
            articlesDict = collection.getPageOfArticlesQuery(page, collection.searchArticles(searchline))
            if articlesDict:
                for article in articlesDict["articles"]:
                    article["title"] = escape(article["title"])
                return HttpResponse(json.dumps(articlesDict), content_type="application/json")
            else:
                return HttpResponse(response404, status=404)
        else:
            return HttpResponse(response400, status=400)
    else:
        return HttpResponse(response405, status=405)