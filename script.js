$(document).ready(() => {
    console.log("Script Loaded");
    console.log(localStorage["form-content"]);
    if (!localStorage.getItem("form-content")) {
        localStorage.setItem(
            "form-content",
            JSON.stringify({
                fields: [
                    {
                        label: "Name",
                        name: "name",
                        type: "text",
                        required: true,
                        value: "",
                    },
                    {
                        label: "Email",
                        name: "email",
                        type: "email",
                        required: true,
                        value: "",
                    },
                    {
                        label: "Message",
                        name: "message",
                        type: "textarea",
                        required: true,
                        value: "",
                    },
                ],
            })
        );
    }

    if (!localStorage["form-response"]) {
        localStorage.setItem("form-response", JSON.stringify({ response: [] }));
    } else {
        const response = JSON.parse(localStorage.getItem("form-response"));

        response.response.forEach((data, index) => {
            let html = ``;
            for (const key in data) {
                html += `
                <p>${key}: ${data[key]}</p>
                `;
            }
            $(".carousel").append(`
                <li class="carousel-item">
                ${html}
                </li>
            `);
        });
    }

    generateFormContent();

    const form = document.getElementById("form");
    const addContentForm = document.getElementById("addContentForm");
    const formResponse = document.getElementById("formResponse");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const valueFields = [];

        $("#form input, #form textarea").each(function () {
            let key = $(this).attr("name");
            let data = {
                [key]: $(this).val(),
            };

            valueFields.push(data);
        });

        const data = Object.assign({}, ...valueFields);

        localStorage.setItem(
            "form-response",
            JSON.stringify({
                response: [
                    ...JSON.parse(localStorage.getItem("form-response"))
                        .response,
                    data,
                ],
            })
        );

        formResponse.textContent =
            "Thanks for the response, we will save your response in local storage and show it up in HomePage!";
        form.reset();

        console.log(data);

        location.reload();
    });

    addContentForm.addEventListener("submit", (e) => {
        const pages = document.getElementById("add-content-form");

        e.preventDefault();

        let formData = new FormData(addContentForm);

        let rawData = Object.fromEntries(formData);
        rawData = {
            ...rawData,
            required: rawData.required === "on" ? true : false,
            value: rawData.type === "number" ? 0 : '',
            name : rawData.label.toLocaleLowerCase()
        };


        const formContent = JSON.parse(localStorage.getItem("form-content"));

        formContent.fields = [...formContent.fields, rawData];

        localStorage.setItem("form-content", JSON.stringify(formContent));

        addContentForm.reset();
        pages.style.display = "none";
        $(".content-form-item").html(``);
        generateListFormContent();
    });
});

const prevButton = document.querySelector(".prev-btn");
const nextButton = document.querySelector(".next-btn");
const addContentButton = document.querySelector("#addContentBtn");
const updateContentButton = document.getElementById("updateContent");
const homeButton = document.querySelector("#homeBtn");

let currentIndex = 0;

function updateCarouselPosition() {
    const carousel = document.querySelector(".carousel");
    const carouselItems = document.querySelectorAll(".carousel-item");
    const totalItems = carouselItems.length;

    if (totalItems === 0) return;

    const itemWidth = carouselItems[0].offsetWidth;
    carousel.style.transform = `translateX(-${itemWidth * currentIndex}px)`;
}

prevButton.addEventListener("click", () => {
    const carouselItems = document.querySelectorAll(".carousel-item");
    const totalItems = carouselItems.length;

    currentIndex = currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
    updateCarouselPosition();
});

nextButton.addEventListener("click", () => {
    const carouselItems = document.querySelectorAll(".carousel-item");
    const totalItems = carouselItems.length;

    currentIndex = currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
    updateCarouselPosition();
});

addContentButton.addEventListener("click", () => {
    console.log("kesini");
    const pages = document.getElementById("add-content-form");

    pages.style.display === "none"
        ? (pages.style.display = "block")
        : (pages.style.display = "none");
});

homeButton.addEventListener("click", () => {
    const form = document.getElementById("form-section");
    const response = document.getElementById("response");
    const update = document.getElementById("update-content-page");

    update.style.display = "none";
    form.style.display = "block";
    response.style.display = "block";

    generateFormContent();
});

function generateFormContent() {
    const formFieldsContainer = $("#form");
    formFieldsContainer.empty();

    const formContent = JSON.parse(localStorage.getItem("form-content"));

    if (formContent.fields.length < 1) {
        console.log("kesini");
        $(`#form-section`).html(`
            <h2>Please Update Form Content</h2>
            <p>No form fields found</p>`);

        return;
    }

    formContent.fields.forEach((field) => {
        console.log(field);
        const fieldHTML = `
                <label for="${field.name}">${field.label}:</label>
                ${
                    field.type === "textarea"
                        ? `<textarea id="${field.name}" name="${
                              field.name
                          }" rows="4" cols="50" ${
                              field.required ? "required" : ""
                          }>${field.value}</textarea>`
                        : `<input type="${field.type}" id="${
                              field.name
                          }" name="${field.name}" value="${field.value}" ${
                              field.required ? "required" : ""
                          }>`
                }
        `;

        formFieldsContainer.append(fieldHTML);
    });

    formFieldsContainer.append(`
        <button type="submit">Submit</button>
    `);
}

const dropdown = document.querySelector(".dropdown");
const dropdownToggle = document.querySelector(".dropdown-toggle");

dropdownToggle.addEventListener("click", () => {
    dropdown.classList.toggle("active");
});

document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("active");
    }
});

updateContentButton.addEventListener("click", () => {
    const form = document.getElementById("form-section");
    const response = document.getElementById("response");
    const update = document.getElementById("update-content-page");

    update.style.display = "block";
    form.style.display = "none";
    response.style.display = "none";

    document.title = "Update Content";

    if (document.querySelectorAll(".content-form-item-list").length < 1) {
        generateListFormContent();
        return;
    }

    return;
});

const form = document.getElementById("contactForm");
const formResponse = document.getElementById("formResponse");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    formResponse.textContent = "Already Submitted!";
    form.reset();
});

function generateListFormContent() {
    const field = JSON.parse(localStorage.getItem("form-content"));

    field.fields.forEach((data, index) => {
        let html = ``;

        for (const key in data) {
            html += `
                <p><strong>${
                    key.charAt(0).toUpperCase() + key.slice(1)
                }:</strong> ${data[key]}</p>
                `;
        }

        $(".content-form-item").append(`
            <li class="content-form-item-list" id="form-item-list-${index}">
                ${html} 
                <button type="button" class="delete-button" data-index="${index}">Delete</button>
            </li>
        `);
    });

    $(".delete-button").on("click", function () {
        const index = $(this).data("index");
        const formContent = JSON.parse(localStorage.getItem("form-content"));

        formContent.fields.splice(index, 1);
        localStorage.setItem("form-content", JSON.stringify(formContent));

        $(this).closest(".content-form-item-list").remove();
    });
}
