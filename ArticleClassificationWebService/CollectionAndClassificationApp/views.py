from django.http import HttpResponse
from django.shortcuts import render

response405 = "forbidden method"

def show404Error(request):
    return HttpResponse("page not found", status=404)

def classification(request):
    if request.method == "GET":
        return render(request, "CollectionAndClassificationApp/classification.html")
    else:
        return HttpResponse(response405, status=405)

def addArticle(request):
    if request.method == "GET":
        return render(request, "CollectionAndClassificationApp/addArticle.html")
    else:
        return HttpResponse(response405, status=405)

def collection(request):
    if request.method == "GET":
        return render(request, "CollectionAndClassificationApp/collection.html")
    else:
        return HttpResponse(response405, status=405)

def article(request):
    if request.method == "GET":
        return render(request, "CollectionAndClassificationApp/article.html")
    else:
        return HttpResponse(response405, status=405)

def updateArticle(request):
    if request.method == "GET":
        return render(request, "CollectionAndClassificationApp/updateArticle.html")
    else:
        return HttpResponse(response405, status=405)
