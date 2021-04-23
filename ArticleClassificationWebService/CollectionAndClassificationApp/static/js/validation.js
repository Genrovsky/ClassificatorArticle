function textValidate(text) {
    if (text.trim() == "") {
        return "Текст не заполнен";
    }

    if (text.length > 25000) {
        return "Текст слишком длинный. Максимальное кол-во символов 25000";
    }

    return "";
}

function titleValidate(title) {
    if (title.trim() == "") {
        return "Заголовок не заполнен";
    }

    if (title.length > 400) {
        return "Заголовок слишком длинный. Максимальное кол-во символов 400";
    }

    return "";
}

function dateValidate(date) {
    if (date.trim() == "") {
        return "Дата не заполнена";
    }

    let reDateValodator = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
    if (!reDateValodator.test(date)) {
        return "Некорректный формат даты";
    }

    let rightDate = new Date(date);
    let rightDateInString = rightDate.getFullYear() + '-' + ('0' + (rightDate.getMonth() + 1)).slice(-2) + '-' + ('0' + rightDate.getDate()).slice(-2);
    if (date != rightDateInString) {
        return "Некорректная дата";
    }

    return "";
}

function searchlineValidate(searchline) {
    if (searchline.trim() == "") {
        return "Поисковый запрос пуст";
    }

    if (searchline.length > 450) {
        return "Поисковый запрос слишком длинный. Максимальное кол-во символов 450";
    }

    let words = searchline.split(" ");
    for (let i = 0; i < words.length; i++) {
        if (words[i] == "") {
            return "Пустое слово в поисковом запросе";
        }
    }

    return "";
}
