from django.conf.urls import include, url
from django.views.generic import RedirectView
from django.views.static import serve
from CollectionAndClassificationApp import api
from CollectionAndClassificationApp import views
from ArticleClassificationWebService import settings

urlpatterns = [
    url(r"^api/db-to-default$", api.dbToDefault),
    url(r"^api/fit-and-save-model$", api.fitAndSaveModel),
    url(r"^api/classification$", api.textClassification),
    url(r"^api/collection/add-article$", api.addArticle),
    url(r"^api/collection/(?P<id>[0-9]+)$", api.operationsOnArticle),
    url(r"^api/collection/page/(?P<page>[0-9]+)$", api.getArticlesOnPage),
    url(r"^api/collection/category/(?P<category>[\w]+)/page/(?P<page>[0-9]+)$", api.getArticlesByCategoryOnPage),
    url(r"^api/collection/dates/(?P<leftDate>[0-9]{4}-[0-9]{2}-[0-9]{2})/(?P<rightDate>[0-9]{4}-[0-9]{2}-[0-9]{2})/page/(?P<page>[0-9]+)$", api.getArticlesByDateOnPage),
    url(r"^api/collection/search/(?P<searchline>[\w\s]+)/page/(?P<page>[0-9]+)$", api.searchArticlesOnPage),
    url(r"^$", views.classification),
    url(r"^add-article$", views.addArticle),
    url(r"^collection$", views.collection),
    url(r"^collection/[0-9]+$", views.article),
    url(r"^collection/update/[0-9]+$", views.updateArticle),
    url(r'^favicon\.ico$', RedirectView.as_view(url='/static/media/favicon.ico')),
	url(r'^static/(?P<path>.*)$', serve,{'document_root': settings.STATIC_ROOT})
]

handler404 = views.show404Error