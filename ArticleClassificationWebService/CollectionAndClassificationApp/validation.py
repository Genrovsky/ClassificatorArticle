import json
import re
from datetime import datetime

requiredCategories = ["наука", "гаджеты", "роботы", "техника", "космос"]

def categoryValidation(category):
    if category in requiredCategories:
        return True
    else:
        return False

def titleValidation(title):
    if not isinstance(title, str):
        return False

    if not title.strip():
        return False

    if len(title) > 400:
        return False

    return True

def dateValidation(date):
    if not isinstance(date, str):
        return False

    reDateValidator = r"^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    if not re.match(reDateValidator, date):
        return False

    try:
        dateCheck = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        return False

    return True

def textValidation(text):
    if not isinstance(text, str):
        return False

    if not text.strip():
        return False

    if len(text) > 25000:
        return False

    return True

def searchlineValidation(searchline):
    if not isinstance(searchline, str):
        return False

    if not searchline.strip():
        return False

    if len(searchline) > 450:
        return False

    words = searchline.split()
    for word in words:
        if not word.strip():
            return False

    if len(words) > 15:
        return False

    return True
    
def pageValidation(page):
    if page > 0:
        return True
    else:
        return False

def jsonValidation(dataForValidate, requiredFields):
    try:
        inputJson = json.loads(dataForValidate)
    except json.JSONDecodeError:
        return False

    if not inputJson:
        return False

    if list(inputJson.keys()) != requiredFields:
        return False

    return inputJson

def articleValidation(articleInJson):
    articleDict = jsonValidation(articleInJson, ["title", "category", "date", "text"])
    if not articleDict:
        return False

    if not titleValidation(articleDict["title"]):
        return False

    if not categoryValidation(articleDict["category"]):
        return False

    if not dateValidation(articleDict["date"]):
        return False

    if not textValidation(articleDict["text"]):
        return False

    return articleDict

def classifiyTextValidation(textInJson):
    textDict = jsonValidation(textInJson, ["text"])
    if not textDict:
        return False

    if not textValidation(textDict["text"]):
        return False

    return textDict

def secretKeyValidation(secretKey):
    if isinstance(secretKey, str):
        return True
    else:
        return False

def secretJsonValidation(secretKeyInJson):
    secretKeyDict = jsonValidation(secretKeyInJson, ["secret"])
    if not secretKeyDict:
        return False

    if not secretKeyValidation(secretKeyDict["secret"]):
        return False

    return secretKeyDict
