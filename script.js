// 1. APPLICATION STATE
const state = {
    successes: 0,
    trials: 0,
    probability: 0.0,
    method: "binomial"
};

const storedData = localStorage.getItem("probabilityData");
if (storedData) {
    const savedState = JSON.parse(storedData);
    state.successes = savedState.successes;
    state.trials = savedState.trials;
    state.probability = savedState.probability;
    state.method = savedState.method;
}

// 2. STATE ACCESSORS/MUTATORS FN'S
function saveData() {
    const data = {
        successes: state.successes,
        trials: state.trials,
        probability: state.probability,
        method: state.method
    };
    localStorage.setItem("probabilityData", JSON.stringify(data));
}

function setSuccesses(successes) {
    state.successes = successes;
    saveData();
}

function setTrials(trials) {
    state.trials = trials;
    saveData();
}

function setProbability(probability) {
    state.probability = probability;
    saveData();
}

function setMethod(method) {
    state.method = method;
    saveData();
}

// 3. DOM Node Refs
const successes$ = document.getElementById('successes');
const trials$ = document.getElementById('trials');
const probability$ = document.getElementById('probability');
const method$ = document.getElementById('method');
const result$ = document.getElementById('result');
const fetchCatImage$ = document.getElementById('fetchCatImage');
const catImageResult$ = document.getElementById('catImageResult');

// 5. RENDER FN
function render() {
    successes$.value = state.successes.toString();
    trials$.value = state.trials.toString();
    probability$.value = state.probability.toString();
    method$.value = state.method;

    if (state.successes > 0 && state.trials > 0 && state.probability > 0) {
        let resultText;
        if (state.method === 'binomial') {
            const binomialProb = binomialProbability(state.successes, state.trials, state.probability);
            resultText = `Binomiale Wahrscheinlichkeit (P(X = k)): ${binomialProb.toFixed(5)}`;
        } else if (state.method === 'cumulative') {
            const cumulativeProb = cumulativeBinomialProbability(state.successes, state.trials, state.probability);
            resultText = `Kumulative Wahrscheinlichkeit (P(X ≤ k)): ${cumulativeProb.toFixed(5)}`;
        }
        result$.innerHTML = `<p>${resultText}</p>`;
    }
}

// 6. EVENT HANDLERS
successes$.addEventListener('input', function(event) {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
        setSuccesses(value);
        render();
    }
});

trials$.addEventListener('input', function(event) {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
        setTrials(value);
        render();
    }
});

probability$.addEventListener('input', function(event) {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
        setProbability(value);
        render();
    }
});

method$.addEventListener('change', function(event) {
    setMethod(event.target.value);
    render();
});

fetchCatImage$.addEventListener('click', function() {
    fetch('https://api.thecatapi.com/v1/images/search', {
        headers: {
            'x-api-key': 'live_Cks6BZy63jwpo7gHnbBVTUmB5OLOvUJtDqIvwLeVzoZuyWvpBtpwtEcF76RXpmDM'
        }
    })
        .then(response => response.json())
        .then(data => {
            catImageResult$.innerHTML = `
            <img src="${data[0].url}" alt="Random Cat Image" style="max-width: 100%;">
        `;
        })
        .catch(error => {
            catImageResult$.innerHTML = `
            <p>Fehler beim Abrufen der Daten: ${error.message}</p>
        `;
        });
});

// 7. INIT BINDINGS
window.addEventListener('load', function() {
    render();
});

// 8. INITIAL RENDER
render();

// Utility Functions
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

function combination(n, k) {
    return factorial(n) / (factorial(k) * factorial(n - k));
}

function binomialProbability(k, n, p) {
    return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

function cumulativeBinomialProbability(k, n, p) {
    let cumulativeProb = 0;
    for (let i = 0; i <= k; i++) {
        cumulativeProb += binomialProbability(i, n, p);
    }
    return cumulativeProb;
}
