const apiKey = "sbazNDGSGYQBiEptbkVqgm0aeUbeps5C5npryr45";

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const container = document.getElementById("current-image-container");
const historyList = document.getElementById("search-history");

window.onload = () => {
    getCurrentImageOfTheDay();
    addSearchToHistory();
};

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const date = input.value;

    if (date) {
        getImageOfTheDay(date);
    }
});

async function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    fetchImage(currentDate, false);
}

async function getImageOfTheDay(date) {
    fetchImage(date, true);
}

async function fetchImage(date, save) {
    try {
        const url = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`;

        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();

        displayImage(data);

        if (save) {
            saveSearch(date);
            addSearchToHistory();
        }

    } catch (error) {
        console.error(error);
        container.innerHTML = `<h2>${error.message}</h2>`;
    }
}

function displayImage(data) {

    container.innerHTML = `
        <h2>${data.title}</h2>
        <p><strong>Date:</strong> ${data.date}</p>

        ${
            data.media_type === "image"
                ? `<img src="${data.url}" alt="${data.title}" style="width:100%;max-width:700px;">`
                : `<iframe src="${data.url}" width="700" height="400"></iframe>`
        }

        <p>${data.explanation}</p>
    `;
}

function saveSearch(date) {

    let searches = JSON.parse(localStorage.getItem("searches")) || [];

    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem("searches", JSON.stringify(searches));
    }
}

function addSearchToHistory() {

    historyList.innerHTML = "";

    const searches = JSON.parse(localStorage.getItem("searches")) || [];

    searches.forEach(date => {

        const li = document.createElement("li");

        li.textContent = date;
        li.style.cursor = "pointer";

        li.addEventListener("click", () => {
            getImageOfTheDay(date);
        });

        historyList.appendChild(li);

    });

}