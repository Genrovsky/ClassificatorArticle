async function classification() {
    let ePreloader = document.getElementById("preloader");
    let eText = document.getElementById("text");
    let eResultMes = document.getElementById("classificationResultMes");
    let eErrorMes = document.getElementById("classificationErrorMes");

    ePreloader.hidden = false;
    eResultMes.textContent = "";
    eErrorMes.textContent = "";

    let text = eText.value;

    let errorMes = textValidate(text);
    if (errorMes == "") {
        let textObject = {
            text: text
        };

        try {
            let response = await fetch("/api/classification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(textObject)
            });

            if (response.ok) {
                let categoryObject = await response.json();

                eResultMes.innerHTML = "Текст относится к категории: <b>" + categoryObject.category + "</b>";
            } else {
                eErrorMes.textContent = "Что-то пошло не так";
            }
        } catch (error) {
            eErrorMes.textContent = error;
        }
    } else {
        eErrorMes.textContent = errorMes;
    }

    ePreloader.hidden = true;
}