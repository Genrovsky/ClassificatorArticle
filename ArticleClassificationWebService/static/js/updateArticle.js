async function showArticleContentForUpdate() {
    let ePreloader = document.getElementById("preloader");
    let eTitle = document.getElementById("title");
    let eTitleHead = document.getElementById("titleHead");
    let eCategory = document.getElementById("category");
    let eDate = document.getElementById("date");
    let eText = document.getElementById("text");
    let eArticleContent = document.getElementById("articleContent");

    ePreloader.hidden = false;

    let articleId = getArticleId();

    try {
        let response = await fetch("/api/collection/" + articleId, {
            method: "GET"
        });

        if (response.ok) {
            let articleObject = await response.json();

            eTitle.value = articleObject.title;
            eTitleHead.textContent = articleObject.title;
            eCategory.value = articleObject.category;
            eDate.value = articleObject.date;
            eText.value = articleObject.text;
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

async function updateArticle() {
    let ePreloader = document.getElementById("preloader");
    let eUpdateErrorMsg = document.getElementById("updateErrorMsg");
    let eUpdateResultMsg = document.getElementById("updateResultMsg");
    let eTitleErrorMsg = document.getElementById("titleErrorMsg");
    let eDateErrorMsg = document.getElementById("dateErrorMsg");
    let eTextErrorMsg = document.getElementById("textErrorMsg");
    let eTitle = document.getElementById("title");
    let eCategory = document.getElementById("category");
    let eDate = document.getElementById("date");
    let eText = document.getElementById("text");
    let eArticleContent = document.getElementById("articleContent");

    ePreloader.hidden = false;
    eUpdateResultMsg.textContent = "";
    eUpdateErrorMsg.textContent = "";
    eTitleErrorMsg.textContent = "";
    eDateErrorMsg.textContent = "";
    eTextErrorMsg.textContent = "";

    let title = eTitle.value;
    let category = eCategory.value;
    let date = eDate.value;
    let text = eText.value;

    let flagNext = true;

    let titleErrorMsg = titleValidate(title);
    if (titleErrorMsg != "") {
        flagNext = false;
        eTitleErrorMsg.textContent = titleErrorMsg;
    }

    let dateErrorMsg = dateValidate(date);
    if (dateErrorMsg != "") {
        flagNext = false;
        eDateErrorMsg.textContent = dateErrorMsg;
    }

    let textErrorMsg = textValidate(text);
    if (textErrorMsg != "") {
        flagNext = false;
        eTextErrorMsg.textContent = textErrorMsg;
    }

    if (flagNext) {
        let articleObject = {
            title: title,
            category: category,
            date: date,
            text: text
        };

        try {
            let response = await fetch("/api/collection/" + getArticleId(), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(articleObject)
            });

            if (response.ok) {
                eUpdateResultMsg.textContent = "Статья успешно изменена";
            } else {
                if (response.status == 400) {
                    eArticleContent.textContent = "Такой статьи уже не существует";
                } else {
                    eArticleContent.textContent = "Что-то пошло не так";
                }
            }
        } catch (error) {
            eUpdateErrorMsg.textContent = error;
        }
    } else {
        eUpdateErrorMsg.textContent = "Поля заполнены некорректно";
    }

    ePreloader.hidden = true;
}