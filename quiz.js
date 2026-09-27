const form = document.querySelector("#quiz-form");

const resultsSection = document.querySelector("#results");

const primaryResult = document.querySelector("#primary-result");
const secondaryResult = document.querySelector("#secondary-result");

const restartButton = document.querySelector("#restart-button");


const themes = {
    Dinosaurs: {
        score: 0,
        maxScore: 0,
        description: "Huge prehistoric creatures and overwhelming power."
    },

    Goblins: {
        score: 0,
        maxScore: 0,
        description: "Fast, chaotic, and full of troublesome little creatures."
    },

    Elves: {
        score: 0,
        maxScore: 0,
        description: "Build an army where your creatures make each other stronger."
    }
};

const scoringMatrix = {

    q1: {
        Dinosaurs: 3,
        Goblins: 0,
        Elves: 1
    },

    q2: {
        Dinosaurs: 0,
        Goblins: 3,
        Elves: 0
    },

    q3: {
        Dinosaurs: 0,
        Goblins: 2,
        Elves: 3
    }

};

/**
    1 → 0%
    2 → 25%
    3 → 50%
    4 → 75%
    5 → 100%
 */
function answerToFactor(answer) {
    return (answer - 1) / 4;
}

function calculateScores(formData) {

    // Reset theme scores

    for (const theme of Object.values(themes)) {
        theme.score = 0;
        theme.maxScore = 0;
    }


    // Look through every quiz question

    for (const question in scoringMatrix) {

        const answer = Number(formData.get(question));

        const factor = answerToFactor(answer);

        const weights = scoringMatrix[question];


        // Apply this question's weights

        for (const themeName in weights) {

            const weight = weights[themeName];

            themes[themeName].score += factor * weight;

            themes[themeName].maxScore += weight;
        }
    }


    // Convert everything to percentages

    const results = [];

    for (const themeName in themes) {

        const theme = themes[themeName];

        let percentage = 0;

        if (theme.maxScore > 0) {
            percentage =
                (theme.score / theme.maxScore) * 100;
        }

        results.push({
            name: themeName,
            percentage: percentage,
            description: theme.description
        });
    }


    // Highest score first

    results.sort(
        (a, b) => b.percentage - a.percentage
    );


    return results;
}

function createResultCard(result) {

    return `
        <div class="result-card">

            <h3>${result.name}</h3>

            <p class="score">
                ${Math.round(result.percentage)}% Match
            </p>

            <p>
                ${result.description}
            </p>

        </div>
    `;
}

form.addEventListener("submit", function(event) {

    event.preventDefault();


    const formData = new FormData(form);

    const results = calculateScores(formData);


    const firstPlace = results[0];
    const secondPlace = results[1];


    primaryResult.innerHTML =
        createResultCard(firstPlace);

    secondaryResult.innerHTML =
        createResultCard(secondPlace);


    form.classList.add("hidden");

    resultsSection.classList.remove("hidden");

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