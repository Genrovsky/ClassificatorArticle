async function showArticleContent() {
    let ePreloader = document.getElementById("preloader");
    let eTitle = document.getElementById("title");
    let eTitleH = document.getElementById("titleH");
    let eCategory = document.getElementById("category");
    let eDate = document.getElementById("date");
    let eText = document.getElementById("text");
    let eAUpdate = document.getElementById("aUpdate");
    let eArticleContent = document.getElementById("articleContent");

    ePreloader.hidden = false;

    let articleId = getArticleId();

    try {
        let response = await fetch("/api/collection/" + articleId, {
            method: "GET"
        });

        if (response.ok) {
            let articleObject = await response.json();

            eAUpdate.href = "/collection/update/" + articleId;
            eTitle.textContent = articleObject.title;
            eTitleH.textContent = articleObject.title;
            eCategory.textContent = "Категория: " + articleObject.category;
            eDate.textContent = "Дата публикации: " + articleObject.date;
            eText.textContent = articleObject.text;
        } else {
            if (response.status == 404) {
                eArticleContent.textContent = "Такой статьи не существует";
            } else {
                eArticleContent.textContent = "Что-то пошло не так";
            }
        }
    } catch (error) {
        eArticleContent.textContent = error;
    }

    ePreloader.hidden = true;
}

async function deleteArticle() {
    let ePreloader = document.getElementById("preloader");
    let eArticleContent = document.getElementById("articleContent");
    let eArticleErrorMsg = document.getElementById("articleErrorMsg");

    eArticleErrorMsg.textContent = "";

    let articleId = getArticleId();

    try {
        let response = await fetch("/api/collection/" + articleId, {
            method: "DELETE"
        });

        if (response.ok) {
            eArticleContent.textContent = "Статья успешно удалена";
        } else {
            if (response.status == 400) {
                eArticleContent.textContent = "Такой статьи уже не существует";
            } else {
                eArticleContent.textContent = "Что-то пошло не так";
            }
        }
    } catch (error) {
        eArticleErrorMsg.textContent = error;
    }

    ePreloader.hidden = true;
}

function getArticleId() {
    let url = document.location.pathname;
    let id = url.slice(url.lastIndexOf('/') + 1);

    return id;
}