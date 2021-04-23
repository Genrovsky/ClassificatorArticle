from sklearn.linear_model import SGDClassifier
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn import metrics
from string import punctuation
from nltk import download
from nltk.corpus import stopwords
import pickle
from CollectionAndClassificationApp.models import Article
from ArticleClassificationWebService import settings
from CollectionAndClassificationApp.validation import requiredCategories

dirOfModel = "model"
delimeter = "\\"

def fitAndSaveModel():
    categoryList = []
    textList = []
    articlesQuery = Article.objects.all()

    for articleObject in articlesQuery:
        categoryList.append(requiredCategories.index(articleObject.category) + 1)
        textList.append(articleObject.text)

    textForTrainList, textForTestList, categoryForTrainList, categoryForTestList = train_test_split(textList, categoryList, test_size=0.25, random_state=0)

    download("stopwords")
    stopwordsList = stopwords.words("russian") + list(punctuation)

    classificationModel = Pipeline([
        ("cv", CountVectorizer(stop_words = stopwordsList)),
        ("tf-idf", TfidfTransformer()),
        ("clf", SGDClassifier(alpha=1e-3))
        ])
    classificationModel.fit(textForTrainList, categoryForTrainList)

    fileWriteClassificationModel = open(settings.BASE_DIR + delimeter + dirOfModel + delimeter + "cModel.txt", "wb")
    pickle.dump(classificationModel, fileWriteClassificationModel)
    fileWriteClassificationModel.close()

    predictedCategories = classificationModel.predict(textForTestList)
    reportTableInStr = metrics.classification_report(categoryForTestList, predictedCategories, target_names=requiredCategories)
    fileWriteReport = open(settings.BASE_DIR + delimeter + dirOfModel + delimeter + "classificatonReport.txt", 'w')
    fileWriteReport.write(reportTableInStr)
    fileWriteReport.close()

    print("модель классификатора обучена и сохранена")
    
def textClassify(text):
    categoryDict = {}
    fileReadClassificationModel = open(settings.BASE_DIR + delimeter + dirOfModel + delimeter + "cModel.txt", "rb")
    classificationModel = pickle.load(fileReadClassificationModel)
    fileReadClassificationModel.close()

    categoryDict["category"] = requiredCategories[classificationModel.predict([text])[0] - 1]

    return categoryDict