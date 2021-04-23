async function showAllArticles() {
    let eGetArticlesErrorMsg = document.getElementById("getArticlesErrorMsg");
    let eGetArticlesResultMsg = document.getElementById("getArticlesResultMsg");
    let eArticles = document.getElementById("articles");
    let ePageBar = document.getElementById("pageBar");

    eGetArticlesErrorMsg.textContent = "";
    eGetArticlesResultMsg.textContent = "";
    eArticles.textContent = "";
    ePageBar.textContent = "";

    await showAllArticlesOnPage(1);
}

async function showArticlesByCategory() {
    let eGetArticlesErrorMsg = document.getElementById("getArticlesErrorMsg");
    let eGetArticlesResultMsg = document.getElementById("getArticlesResultMsg");
    let eArticles = document.getElementById("articles");
    let ePageBar = document.getElementById("pageBar");
    let eCategory = document.getElementById("category");

    eGetArticlesErrorMsg.textContent = "";
    eGetArticlesResultMsg.textContent = "";
    eArticles.textContent = "";
    ePageBar.textContent = "";

    let category = eCategory.value;

    await showArticlesByCategoryOnPage(1, category);
}

async function showArticlesByDates() {
    let eGetArticlesErrorMsg = document.getElementById("getArticlesErrorMsg");
    let eGetArticlesResultMsg = document.getElementById("getArticlesResultMsg");
    let eArticles = document.getElementById("articles");
    let ePageBar = document.getElementById("pageBar");
    let eLeftDate = document.getElementById("leftDate");
    let eRightDate = document.getElementById("rightDate");

    eGetArticlesErrorMsg.textContent = "";
    eGetArticlesResultMsg.textContent = "";
    eArticles.textContent = "";
    ePageBar.textContent = "";

    let leftDate = eLeftDate.value;
    let rightDate = eRightDate.value;

    let flagNext = true;
    let leftDateErrorMsg = dateValidate(leftDate);
    if (leftDateErrorMsg != "") {
        flagNext = false;
        eGetArticlesErrorMsg.innerHTML = "<p>Левая граница: " + leftDateErrorMsg + "</p>";
    }

    let rightDateErrorMsg = dateValidate(rightDate);
    if (rightDateErrorMsg != "") {
        flagNext = false;
        eGetArticlesErrorMsg.innerHTML = eGetArticlesErrorMsg.innerHTML + "<p>Правая граница: " + rightDateErrorMsg + "</p>";
    }

    if (flagNext && ((new Date(leftDate)).getTime() > (new Date(rightDate)).getTime())) {
        flagNext = false;
        eGetArticlesErrorMsg.textContent = "Некорректный диапазон";
    }

    if (flagNext) {
        await showArticlesByDatesOnPage(1, leftDate, rightDate);
    }
}

async function showArticlesBySearchline() {
    let eGetArticlesErrorMsg = document.getElementById("getArticlesErrorMsg");
    let eGetArticlesResultMsg = document.getElementById("getArticlesResultMsg");
    let eArticles = document.getElementById("articles");
    let ePageBar = document.getElementById("pageBar");
    let eSearchline = document.getElementById("searchline");

    eGetArticlesErrorMsg.textContent = "";
    eGetArticlesResultMsg.textContent = "";
    eArticles.textContent = "";
    ePageBar.textContent = "";

    let flagNext = true;
    let searchline = eSearchline.value;
    let searchlineErrorMsg = searchlineValidate(searchline);
    if (searchlineErrorMsg != "") {
        flagNext = false;
        eGetArticlesErrorMsg.textContent = searchlineErrorMsg;
    }

    if (flagNext) {
        await showArticlesBySearchlineOnPage(1, searchline);
    }
}

async function showAllArticlesOnPage(page) {
    let eGetArticlesErrorMsg = document.getElementById("getArticlesErrorMsg");
    let eGetArticlesResultMsg = document.getElementById("getArticlesResultMsg");
    let eArticles = document.getElementById("articles");
    let ePageBar = document.getElementById("pageBar");
    let ePreloader = document.getElementById("preloader");

    eGetArticlesErrorMsg.textContent = "";
    eGetArticlesResultMsg.textContent = "";
    eArticles.textContent = "";
    ePageBar.textContent = "";

    ePreloader.hidden = false;

    try {
        let response = await fetch("/api/collection/page/" + page.toString(), {
            method: "GET"
        });

        if (response.ok) {
            let articlesObject = await response.json();

            eGetArticlesResultMsg.textContent = "Кол-во статей в выборке: " + articlesObject.len.toString();
            showArticles(articlesObject.articles);
            showPageBar(page, articlesObject.countArticlesOnPage, articlesObject.len, showAllArticlesOnPage);
        } else {
            if (response.status == 404) {
                eGetArticlesResultMsg.textContent = "Таких статей не найдено";
            } else {
                eGetArticlesErrorMsg.textContent = "Что-то пошло не так";
            }
        }
    } catch (error) {
        eGetArticlesErrorMsg.textContent = error;
    }

    ePreloader.hidden = true;
}

async function showArticlesByCategoryOnPage(page, category) {
    let eGetArticlesErrorMsg = document.getElementById("getArticlesErrorMsg");
    let eGetArticlesResultMsg = document.getElementById("getArticlesResultMsg");
    let eArticles = document.getElementById("articles");
    let ePageBar = document.getElementById("pageBar");
    let ePreloader = document.getElementById("preloader");

    eGetArticlesErrorMsg.textContent = "";
    eGetArticlesResultMsg.textContent = "";
    eArticles.textContent = "";
    ePageBar.textContent = "";

    ePreloader.hidden = false;

    try {
        let response = await fetch("/api/collection/category/" + category + "/page/" + page.toString(), {
            method: "GET"
        });

        if (response.ok) {
            let articlesObject = await response.json();

            eGetArticlesResultMsg.textContent = "Кол-во статей в выборке: " + articlesObject.len.toString();
            showArticles(articlesObject.articles);
            showPageBar(page, articlesObject.countArticlesOnPage, articlesObject.len, showArticlesByCategoryOnPage, category);
        } else {
            if (response.status == 404) {
                eGetArticlesResultMsg.textContent = "Таких статей не найдено";
            } else {
                eGetArticlesErrorMsg.textContent = "Что-то пошло не так";
            }
        }
    } catch (error) {
        eGetArticlesErrorMsg.textContent = error;
    }

    ePreloader.hidden = true;
}

async function showArticlesByDatesOnPage(page, leftDate, rightDate) {
    let eGetArticlesErrorMsg = document.getElementById("getArticlesErrorMsg");
    let eGetArticlesResultMsg = document.getElementById("getArticlesResultMsg");
    let eArticles = document.getElementById("articles");
    let ePageBar = document.getElementById("pageBar");
    let ePreloader = document.getElementById("preloader");

    eGetArticlesErrorMsg.textContent = "";
    eGetArticlesResultMsg.textContent = "";
    eArticles.textContent = "";
    ePageBar.textContent = "";

    ePreloader.hidden = false;

    try {
        let response = await fetch("/api/collection/dates/" + leftDate + "/" + rightDate + "/page/" + page.toString(), {
            method: "GET"
        });

        if (response.ok) {
            let articlesObject = await response.json();

            eGetArticlesResultMsg.textContent = "Кол-во статей в выборке: " + articlesObject.len.toString();
            showArticles(articlesObject.articles);
            showPageBar(page, articlesObject.countArticlesOnPage, articlesObject.len, showArticlesByDatesOnPage, leftDate, rightDate);
        } else {
            if (response.status == 404) {
                eGetArticlesResultMsg.textContent = "Таких статей не найдено";
            } else {
                eGetArticlesErrorMsg.textContent = "Что-то пошло не так";
            }
        }
    } catch (error) {
        eGetArticlesErrorMsg.textContent = error;
    }

    ePreloader.hidden = true;
}

async function showArticlesBySearchlineOnPage(page, searchline) {
    let eGetArticlesErrorMsg = document.getElementById("getArticlesErrorMsg");
    let eGetArticlesResultMsg = document.getElementById("getArticlesResultMsg");
    let eArticles = document.getElementById("articles");
    let ePageBar = document.getElementById("pageBar");
    let ePreloader = document.getElementById("preloader");

    eGetArticlesErrorMsg.textContent = "";
    eGetArticlesResultMsg.textContent = "";
    eArticles.textContent = "";
    ePageBar.textContent = "";

    ePreloader.hidden = false;

    try {
        let response = await fetch("/api/collection/search/" + searchline + "/page/" + page.toString(), {
            method: "GET"
        });

        if (response.ok) {
            let articlesObject = await response.json();

            eGetArticlesResultMsg.textContent = "Кол-во статей в выборке: " + articlesObject.len.toString();
            showArticles(articlesObject.articles);
            showPageBar(page, articlesObject.countArticlesOnPage, articlesObject.len, showArticlesBySearchlineOnPage, searchline);
        } else {
            if (response.status == 404) {
                eGetArticlesResultMsg.textContent = "Таких статей не найдено";
            } else {
                eGetArticlesErrorMsg.textContent = "Что-то пошло не так";
            }
        }
    } catch (error) {
        eGetArticlesErrorMsg.textContent = error;
    }

    ePreloader.hidden = true;
}

function showPageBar(page, countArticlesOnPage, countArticles, functionForAction, ...data) {
    let ePageBar = document.getElementById("pageBar");
    let lastPage = Math.ceil(countArticles / countArticlesOnPage)

    let strFirstPage = generatePageElement(1, page == 1);
    let strPrevPrevPage = generatePageElement(page - 2, false);
    let strPrevPage = generatePageElement(page - 1, false);
    let strPage = generatePageElement(page, true);
    let strNextPage = generatePageElement(page + 1, false);
    let strNextNextPage = generatePageElement(page + 2, false);
    let strLastPage = generatePageElement(lastPage, page == lastPage);

    let strPageBar = strFirstPage;
    if (page > 3) {
        strPageBar = strPageBar + strPrevPrevPage;
    }

    if (page > 2) {
        strPageBar = strPageBar + strPrevPage;
    }

    if (page > 1 && page < lastPage) {
        strPageBar = strPageBar + strPage;
    }

    if (page < lastPage - 1) {
        strPageBar = strPageBar + strNextPage;
    }

    if (page < lastPage - 2) {
        strPageBar = strPageBar + strNextNextPage;
    }

    if (lastPage != 1) {
        strPageBar = strPageBar + strLastPage;
    }
    ePageBar.innerHTML = strPageBar;

    let ePagesInPagesBar = document.getElementsByClassName("page");

    if (functionForAction.name == "showAllArticlesOnPage") {
        for (let ePage of ePagesInPagesBar) {
            ePage.onclick = function () {
                functionForAction(parseInt(ePage.textContent));
            }
        }
    } else {
        if (functionForAction.name == "showArticlesByCategoryOnPage" || functionForAction.name == "showArticlesBySearchlineOnPage") {
            for (let ePage of ePagesInPagesBar) {
                ePage.onclick = function () {
                    functionForAction(parseInt(ePage.textContent), data[0]);
                }
            }
        } else {
            if (functionForAction.name == "showArticlesByDatesOnPage") {
                for (let ePage of ePagesInPagesBar) {
                    ePage.onclick = function () {
                        functionForAction(parseInt(ePage.textContent), data[0], data[1]);
                    }
                }
            }
        }
    }
}

function generatePageElement(page, onPage) {
    if (onPage) {
        return "<button class='page'><b>" + page.toString() + "</b></button>";
    } else {
        return "<button class='page'>" + page.toString() + "</button>";
    }
}

function showArticles(articles) {
    let eArticles = document.getElementById("articles");

    let divArticlesInStr = "";

    for (let article of articles) {
        divArticlesInStr = divArticlesInStr + "<div><div><a href='/collection/" + article.id.toString() + "'>"
            + article.title + "</a></div><div><p>Категория: " + article.category + "</p></div><div><p>Дата публикации: "
            + article.date + "</p></div></div>";
    }

    eArticles.innerHTML = divArticlesInStr;
}