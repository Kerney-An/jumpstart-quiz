import { quizQuestions } from "./data/questions.js";
import { themes } from "./data/themes.js";
import { scoringMatrix } from "./data/scoring.js";


const form = document.querySelector("#quiz-form");
const questionsContainer = document.querySelector("#quiz-questions");

const resultsSection = document.querySelector("#results");
const primaryResult = document.querySelector("#primary-result");
const secondaryResult = document.querySelector("#secondary-result");
const allResultsList = document.querySelector("#all-results-list");

const restartButton = document.querySelector("#restart-button");


function createQuestionHTML(question, number) {
    return `
        <section class="question">

            <h3>
                ${number}. ${question.title ?? ""}
            </h3>

            <p>
                ${question.text}
            </p>

            <div class="rating">

                <label>
                    <input
                        type="radio"
                        name="${question.id}"
                        value="1"
                        required
                    >
                    <span>1</span>
                </label>

                <label>
                    <input
                        type="radio"
                        name="${question.id}"
                        value="2"
                    >
                    <span>2</span>
                </label>

                <label>
                    <input
                        type="radio"
                        name="${question.id}"
                        value="3"
                    >
                    <span>3</span>
                </label>

                <label>
                    <input
                        type="radio"
                        name="${question.id}"
                        value="4"
                    >
                    <span>4</span>
                </label>

                <label>
                    <input
                        type="radio"
                        name="${question.id}"
                        value="5"
                    >
                    <span>5</span>
                </label>

            </div>

            <div class="scale-labels">
                <span>Not for me</span>
                <span>Absolutely</span>
            </div>

        </section>
    `;
}


function renderQuestions() {
    let html = "";
    let currentSection = "";

    quizQuestions.forEach((question, index) => {

        if (question.section !== currentSection) {
            currentSection = question.section;

            html += `
                <div class="quiz-section-header">
                    <h2>${currentSection}</h2>
                </div>
            `;
        }

        html += createQuestionHTML(
            question,
            index + 1
        );
    });

    questionsContainer.innerHTML = html;
}


function answerToFactor(answer) {
    return (answer - 1) / 4;
}


function calculateScores(formData) {
    const results = [];

    for (const themeName in themes) {

        let score = 0;
        let maxScore = 0;

        for (const questionId in scoringMatrix) {

            const rawAnswer =
                formData.get(questionId);

            if (rawAnswer === null) {
                continue;
            }

            const answer =
                Number(rawAnswer);

            const factor =
                answerToFactor(answer);

            const weight =
                scoringMatrix[questionId]?.[themeName] ?? 0;

            score += factor * weight;
            maxScore += weight;
        }

        let percentage = 0;

        if (maxScore > 0) {
            percentage =
                (score / maxScore) * 100;
        }

        results.push({
            name: themeName,
            percentage: percentage,
            description:
                themes[themeName].description ?? "",
            color:
                themes[themeName].color ?? ""
        });
    }

    results.sort(
        (a, b) =>
            b.percentage - a.percentage
    );

    return results;
}


function createResultCard(result) {
    return `
        <div class="result-card">

            <h3>
                ${result.name}
            </h3>

            <p class="score">
                ${Math.round(result.percentage)}% Match
            </p>

            <p>
                ${result.description}
            </p>

        </div>
    `;
}


function createRankingHTML(results) {
    return results
        .map((result, index) => {

            return `
                <div class="ranking-row ${index < 2 ? "top-result" : ""}">

                    <span class="rank">
                        #${index + 1}
                    </span>

                    <span class="theme-name">
                        ${result.name}
                    </span>

                    <span class="ranking-score">
                        ${Math.round(result.percentage)}%
                    </span>

                </div>
            `;

        })
        .join("");
}


form.addEventListener("submit", function(event) {

    event.preventDefault();

    const formData =
        new FormData(form);

    const results =
        calculateScores(formData);

    if (results.length < 2) {
        console.error(
            "At least two themes are required to show quiz results."
        );

        return;
    }

    const firstPlace =
        results[0];

    const secondPlace =
        results[1];

    primaryResult.innerHTML =
        createResultCard(firstPlace);

    secondaryResult.innerHTML =
        createResultCard(secondPlace);

    allResultsList.innerHTML =
        createRankingHTML(results);

    form.classList.add("hidden");

    resultsSection.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


restartButton.addEventListener("click", function() {

    form.reset();

    resultsSection.classList.add("hidden");

    form.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


renderQuestions();