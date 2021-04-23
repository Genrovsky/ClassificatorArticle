async function addArticle() {
    let ePreloader = document.getElementById("preloader");
    let eAddErrorMsg = document.getElementById("addErrorMsg");
    let eAddResultMsg = document.getElementById("addResultMsg");
    let eTitleErrorMsg = document.getElementById("titleErrorMsg");
    let eDateErrorMsg = document.getElementById("dateErrorMsg");
    let eTextErrorMsg = document.getElementById("textErrorMsg");
    let eTitle = document.getElementById("title");
    let eCategory = document.getElementById("category");
    let eDate = document.getElementById("date");
    let eText = document.getElementById("text");

    ePreloader.hidden = false;
    eAddResultMsg.textContent = "";
    eAddErrorMsg.textContent = "";
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
            let response = await fetch("/api/collection/add-article", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(articleObject)
            });

            if (response.ok) {
                eAddResultMsg.textContent = "Текст успешно добавлен в коллекцию";
            } else {
                eAddErrorMsg.textContent = "Что-то пошло не так";
            }
        } catch (error) {
            eAddErrorMsg.textContent = error;
        }
    } else {
        eAddErrorMsg.textContent = "Поля заполнены некорректно";
    }

    ePreloader.hidden = true;
}