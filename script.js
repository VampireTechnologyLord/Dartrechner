console.info('Loading script...');

const globalHTML = {
    playdataTableHead: document.getElementById('playdata_table_head'),
    playdataTableBody: document.getElementById('playdata_table_body'),
    gameHistoryTableHead: document.getElementById('game_history_table_head'),
    gameHistoryTableBody: document.getElementById('game_history_table_body'),
    playerAmountSelector: document.getElementById('inputGroupSelect01'),
    addRoundButton: document.getElementById('add_round_button'),
    exportGameButton: document.getElementById('export_game_data_button'),
    gameFileUpload: document.getElementById('game_file_upload'),
};
const gameRounds = [];
const playersWon = [];
const playerNames = [];
const playerRemainingScores = [];
const playerMaximumScores = [];
const preCalculated = [];
const mergedCalculated = [];
let playerAmount = 0;
let initialScoreParse = false;

class UtilClass {
    constructor() {}
    parseScore(scoreString) {
        let cleanedScore = scoreString.toString().trim().replace(' ', '') + '';
        cleanedScore.toUpperCase();
        if (
            cleanedScore.length === 0 ||
            cleanedScore == null ||
            cleanedScore == '' ||
            cleanedScore === void 0
        ) {
            return 0;
        }
        if (
            cleanedScore === 'BI' ||
            cleanedScore === 'bi' ||
            cleanedScore === 'Bi' ||
            cleanedScore === 'bI'
        ) {
            return 50;
        }
        if (
            cleanedScore === 'BO' ||
            cleanedScore === 'bo' ||
            cleanedScore === 'Bo' ||
            cleanedScore === 'bO'
        ) {
            return 25;
        }
        if (cleanedScore.startsWith('D') || cleanedScore.startsWith('d')) {
            return parseInt(cleanedScore.substring(1)) * 2;
        }
        if (cleanedScore.startsWith('T') || cleanedScore.startsWith('t')) {
            return parseInt(cleanedScore.substring(1)) * 3;
        }
        return parseInt(cleanedScore.length > 0 ? cleanedScore : 0);
    }

    parseFormattedScore(scoreString) {
        let cleanedScore = scoreString.toString().trim().replace(' ', '') + '';
        cleanedScore.toUpperCase();
        if (
            cleanedScore.length === 0 ||
            cleanedScore == null ||
            cleanedScore == '' ||
            cleanedScore === void 0
        ) {
            return 'Miss';
        }
        if (
            cleanedScore === 'BI' ||
            cleanedScore === 'bi' ||
            cleanedScore === 'Bi' ||
            cleanedScore === 'bI'
        ) {
            return 'Bullseye in';
        }
        if (
            cleanedScore === 'BO' ||
            cleanedScore === 'bo' ||
            cleanedScore === 'Bo' ||
            cleanedScore === 'bO'
        ) {
            return 'Bullseye out';
        }
        if (cleanedScore.startsWith('D') || cleanedScore.startsWith('d')) {
            return 'Double ' + cleanedScore.substring(1);
        }
        if (cleanedScore.startsWith('T') || cleanedScore.startsWith('t')) {
            return 'Triple ' + cleanedScore.substring(1);
        }
        return cleanedScore.length > 0 ? cleanedScore : 'Miss';
    }

    calculateAvg(...numbers) {
        let sum = 0;
        numbers.forEach((number) => {
            sum += number;
        });
        return (sum / numbers.length).toFixed(1);
    }
}

const util = new UtilClass();

class PlaydataTableClass {
    constructor() {
        this.head = globalHTML.playdataTableHead;
        this.body = globalHTML.playdataTableBody;
    }

    resetHead() {
        this.head.innerHTML = '';
    }

    resetBody() {
        this.body.innerHTML = '';
    }

    createHead(players) {
        this.head.innerHTML = '';

        const headRound = document.createElement('th');
        headRound.innerHTML = 'Round';
        this.head.appendChild(headRound);

        for (let i = 0; i < players; i++) {
            const headPlayer = document.createElement('th');

            const headPlayerInput = document.createElement('input');
            const headPlayerLabel = document.createElement('label');
            const headPlayerDiv = document.createElement('div');

            headPlayerInput.type = 'text';
            headPlayerInput.id = `playdata_table_head_player_name_input_${i}`;
            headPlayerInput.value = `Player ${i + 1}`;
            headPlayerInput.placeholder = `Player ${i + 1}`;
            headPlayerInput.className = 'form-control';

            headPlayerLabel.htmlFor = `playdata_table_head_player_name_input_${i}`;

            headPlayerDiv.className = 'input-group';

            headPlayerLabel.appendChild(headPlayerInput);
            headPlayerDiv.appendChild(headPlayerLabel);
            headPlayer.appendChild(headPlayerDiv);

            this.head.appendChild(headPlayer);
        }

        globalHTML.playdataTableHead = this.head;

        return this;
    }

    createBody(
        rounds = gameRounds,
        players = playerAmount,
        scores = playerRemainingScores
    ) {
        this.body.innerHTML = '';

        const bodySetupRow = this._createSetupRow(rounds, players);
        const bodyRemainingRow = this._createRemainingRowNormal(
            playerAmount,
            scores,
            undefined
        );
        const bodyScoreRow = this._createScoreRow(rounds, players);
        const bodyLastScoreRow = this._createLastScoreRow(rounds, players);

        this.body.appendChild(bodySetupRow);
        this.body.appendChild(bodyRemainingRow);
        this.body.appendChild(bodyScoreRow);
        this.body.appendChild(bodyLastScoreRow);

        return this;
    }

    _createSetupRow(rounds, players) {
        const bodySetupRow = document.createElement('tr');
        bodySetupRow.id = 'playdata_table_body_setup_row';
        const bodySetupRowHead = document.createElement('th');
        bodySetupRowHead.scope = 'row';
        bodySetupRowHead.innerHTML = 'Setup';
        bodySetupRow.appendChild(bodySetupRowHead);

        if (rounds.length === 0) {
            for (let i = 0; i < players; i++) {
                const bodySetupRowData = document.createElement('td');
                const bodySetupRowInput = document.createElement('input');
                const bodySetupRowLabel = document.createElement('label');
                const bodySetupRowDiv = document.createElement('div');

                bodySetupRowInput.type = 'number';
                bodySetupRowInput.id =
                    'playdata_table_body_setup_max_score_input_player_' +
                    (i + 1);
                bodySetupRowInput.value = 301;
                bodySetupRowInput.className = 'form-control';
                bodySetupRowInput.min = 1;
                bodySetupRowInput.step = 100;
                bodySetupRowInput.placeholder = 301;

                bodySetupRowLabel.htmlFor =
                    'playdata_table_body_setup_max_score_input_player_' +
                    (i + 1);

                bodySetupRowDiv.className = 'input-group';

                bodySetupRowLabel.appendChild(bodySetupRowInput);
                bodySetupRowDiv.appendChild(bodySetupRowLabel);
                bodySetupRowData.appendChild(bodySetupRowDiv);

                bodySetupRow.appendChild(bodySetupRowData);
            }
        } else {
            for (let i = 0; i < players; i++) {
                if (
                    !document.getElementById(
                        'playdata_table_body_setup_max_score_input_player_' +
                            (i + 1)
                    )
                ) {
                    const bodySetupRowData = document.createElement('td');
                    const bodySetupRowInput = document.createElement('input');
                    const bodySetupRowLabel = document.createElement('label');
                    const bodySetupRowDiv = document.createElement('div');

                    bodySetupRowInput.type = 'number';
                    bodySetupRowInput.id =
                        'playdata_table_body_setup_max_score_input_player_' +
                        (i + 1);
                    bodySetupRowInput.value = playerMaximumScores[i];
                    bodySetupRowInput.className = 'form-control';
                    bodySetupRowInput.min = 1;
                    bodySetupRowInput.step = 100;
                    bodySetupRowInput.placeholder = 301;

                    bodySetupRowLabel.htmlFor =
                        'playdata_table_body_setup_max_score_input_player_' +
                        (i + 1);

                    bodySetupRowDiv.className = 'input-group';

                    bodySetupRowLabel.appendChild(bodySetupRowInput);
                    bodySetupRowDiv.appendChild(bodySetupRowLabel);
                    bodySetupRowData.appendChild(bodySetupRowDiv);

                    bodySetupRow.appendChild(bodySetupRowData);
                } else {
                    document.getElementById(
                        'playdata_table_body_setup_max_score_input_player_' +
                            (i + 1)
                    ).value = playerMaximumScores[i];
                }
            }
        }

        return bodySetupRow;
    }

    _createRemainingRowNormal(
        players,
        remainingScores
    ) {
        const bodyRemainingRow = document.createElement('tr');
        bodyRemainingRow.id = 'playdata_table_body_remaining_row';
        const bodyRemainingRowHead = document.createElement('th');
        bodyRemainingRowHead.scope = 'row';
        bodyRemainingRowHead.innerHTML = 'Remaining';
        bodyRemainingRow.appendChild(bodyRemainingRowHead);

        for (let i = 0; i < players; i++) {
            const bodyRemainingRowData = document.createElement('td');

            bodyRemainingRowData.innerHTML = `${remainingScores[i] ?? '---'} (${playerRemainingScores[i] ?? 0})`;

            bodyRemainingRowData.id = `playdata_table_body_remaining_score_player_${
                i + 1
            }`;

            bodyRemainingRow.appendChild(bodyRemainingRowData);
        }

        return bodyRemainingRow;
    }

    _createRemainingRowPre(
        players,
        remainingScores,
        preCalculated
    ) {
        const bodyRemainingRow = document.createElement('tr');
        bodyRemainingRow.id = 'playdata_table_body_remaining_row';
        const bodyRemainingRowHead = document.createElement('th');
        bodyRemainingRowHead.scope = 'row';
        bodyRemainingRowHead.innerHTML = 'Remaining';
        bodyRemainingRow.appendChild(bodyRemainingRowHead);

        for (let i = 0; i < players; i++) {
            const bodyRemainingRowData = document.createElement('td');

            bodyRemainingRowData.innerHTML = `${remainingScores[i] ?? '---'} (${(playerRemainingScores[i] == undefined ? preCalculated[i] : playerRemainingScores[i]) - preCalculated[i]})`;

            bodyRemainingRowData.id = `playdata_table_body_remaining_score_player_${
                i + 1
            }`;

            bodyRemainingRow.appendChild(bodyRemainingRowData);
        }

        return bodyRemainingRow;
    }

    _createScoreRow(rounds, players) {
        const bodyScoreRow = document.createElement('tr');
        bodyScoreRow.id = 'playdata_table_body_score_row';
        const bodyScoreRowHead = document.createElement('th');
        bodyScoreRowHead.scope = 'row';
        bodyScoreRowHead.innerHTML = 'Round ' + (rounds.length + 1);
        bodyScoreRowHead.id = 'playdata_table_body_score_row_head';
        bodyScoreRow.appendChild(bodyScoreRowHead);

        for (let i = 0; i < players; i++) {
            const bodyScoreRowData = document.createElement('td');
            const bodyScoreRowInput1 = document.createElement('input');
            const bodyScoreRowInput2 = document.createElement('input');
            const bodyScoreRowInput3 = document.createElement('input');
            const bodyScoreRowLabel1 = document.createElement('label');
            const bodyScoreRowLabel2 = document.createElement('label');
            const bodyScoreRowLabel3 = document.createElement('label');
            const bodyScoreRowDiv = document.createElement('div');

            bodyScoreRowInput1.type = 'string';
            bodyScoreRowInput1.id =
                'playdata_table_body_score_input_player_' +
                (i + 1) +
                '_field_1';
            bodyScoreRowInput1.value = '';
            bodyScoreRowInput1.className = 'form-control';
            bodyScoreRowInput1.placeholder = 'Throw 1';

            bodyScoreRowInput2.type = 'string';
            bodyScoreRowInput2.id =
                'playdata_table_body_score_input_player_' +
                (i + 1) +
                '_field_2';
            bodyScoreRowInput2.value = '';
            bodyScoreRowInput2.className = 'form-control';
            bodyScoreRowInput2.placeholder = 'Throw 2';

            bodyScoreRowInput3.type = 'string';
            bodyScoreRowInput3.id =
                'playdata_table_body_score_input_player_' +
                (i + 1) +
                '_field_3';
            bodyScoreRowInput3.value = '';
            bodyScoreRowInput3.className = 'form-control';
            bodyScoreRowInput3.placeholder = 'Throw 3';

            bodyScoreRowLabel1.htmlFor =
                'playdata_table_body_score_input_player_' +
                (i + 1) +
                '_field_1';
            bodyScoreRowLabel2.htmlFor =
                'playdata_table_body_score_input_player_' +
                (i + 1) +
                '_field_2';
            bodyScoreRowLabel3.htmlFor =
                'playdata_table_body_score_input_player_' +
                (i + 1) +
                '_field_3';

            bodyScoreRowDiv.className = 'input-group';
            if (playersWon[i]) {
                bodyScoreRowInput1.disabled = true;
                bodyScoreRowInput2.disabled = true;
                bodyScoreRowInput3.disabled = true;

                bodyScoreRowInput1.placeholder = 'Won';
                bodyScoreRowInput2.placeholder = 'Won';
                bodyScoreRowInput3.placeholder = 'Won';
            }
            bodyScoreRowLabel1.appendChild(bodyScoreRowInput1);
            bodyScoreRowLabel2.appendChild(bodyScoreRowInput2);
            bodyScoreRowLabel3.appendChild(bodyScoreRowInput3);

            bodyScoreRowDiv.appendChild(bodyScoreRowLabel1);
            bodyScoreRowDiv.appendChild(bodyScoreRowLabel2);
            bodyScoreRowDiv.appendChild(bodyScoreRowLabel3);

            bodyScoreRowData.appendChild(bodyScoreRowDiv);

            bodyScoreRow.appendChild(bodyScoreRowData);
        }

        return bodyScoreRow;
    }

    _createLastScoreRow(rounds, players) {
        const bodyLastScoreRow = document.createElement('tr');
        bodyLastScoreRow.id = 'playdata_table_body_last_score_row';
        const bodyLastScoreRowHead = document.createElement('th');
        bodyLastScoreRowHead.scope = 'row';
        bodyLastScoreRowHead.innerHTML = 'Round ' + rounds.length;
        bodyLastScoreRow.appendChild(bodyLastScoreRowHead);

        for (let i = 0; i < players; i++) {
            const bodyLastScoreRowData = document.createElement('td');
            const bodyLastScoreRowInput = document.createElement('input');
            const bodyLastScoreRowLabel = document.createElement('label');
            const bodyLastScoreRowDiv = document.createElement('div');

            bodyLastScoreRowInput.type = 'string';
            bodyLastScoreRowInput.id =
                'playdata_table_body_last_score_input_player_' + (i + 1);
            if (rounds.length > 0) {
                bodyLastScoreRowInput.value =
                    rounds[rounds.length - 1][i][0].score +
                    ' + ' +
                    rounds[rounds.length - 1][i][1].score +
                    ' + ' +
                    rounds[rounds.length - 1][i][2].score +
                    ' = ' +
                    (rounds[rounds.length - 1][i][0].score +
                        rounds[rounds.length - 1][i][1].score +
                        rounds[rounds.length - 1][i][2].score);
            } else {
                bodyLastScoreRowInput.value = 'No rounds yet.';
            }
            bodyLastScoreRowInput.className = 'form-control';
            bodyLastScoreRowInput.disabled = true;

            bodyLastScoreRowLabel.htmlFor =
                'playdata_table_body_last_score_input_player_' + (i + 1);

            bodyLastScoreRowDiv.className = 'input-group';

            bodyLastScoreRowLabel.appendChild(bodyLastScoreRowInput);

            bodyLastScoreRowDiv.appendChild(bodyLastScoreRowLabel);

            bodyLastScoreRowData.appendChild(bodyLastScoreRowDiv);

            bodyLastScoreRow.appendChild(bodyLastScoreRowData);
        }

        return bodyLastScoreRow;
    }

    updateSetupRow(row) {
        const setupRow = document.getElementById(
            'playdata_table_body_setup_row'
        );
        if (setupRow) {
            setupRow.parentNode.replaceChild(row, setupRow);
        }
    }

    updateRemainingRow(row) {
        const remainingRow = document.getElementById(
            'playdata_table_body_remaining_row'
        );
        remainingRow.replaceWith(row);
    }

    updateScoreRow(row) {
        const scoreRow = document.getElementById(
            'playdata_table_body_score_row'
        );
        scoreRow.replaceWith(row);
    }

    updateLastScoreRow(row) {
        const lastScoreRow = document.getElementById(
            'playdata_table_body_last_score_row'
        );
        lastScoreRow.replaceWith(row);
    }
}

class GameHistoryTableClass {
    constructor() {
        this.head = globalHTML.gameHistoryTableHead;
        this.body = globalHTML.gameHistoryTableBody;
    }

    resetHead() {
        this.head.innerHTML = '';
    }

    resetBody() {
        this.body.innerHTML = '';
    }

    createHead(players) {
        this.head.innerHTML = '';

        const headRound = document.createElement('th');
        headRound.scope = 'col';
        headRound.innerHTML = 'Round';
        this.head.appendChild(headRound);

        for (let i = 0; i < players; i++) {
            const headPlayer = document.createElement('th');
            headPlayer.scope = 'col';
            headPlayer.innerHTML = 'Player ' + (i + 1);

            this.head.appendChild(headPlayer);
        }

        const headAverage = document.createElement('th');
        headAverage.scope = 'col';
        headAverage.innerHTML = 'Average';
        this.head.appendChild(headAverage);
    }

    createBody(rounds, players) {
        this.resetBody();

        for (let i = 0; i < rounds.length; i++) {
            const bodyRound = document.createElement('tr');
            const bodyRoundHead = document.createElement('th');
            bodyRoundHead.scope = 'row';
            bodyRoundHead.innerHTML = 'Round ' + (i + 1);
            bodyRound.appendChild(bodyRoundHead);
            const bodyRoundAverage = document.createElement('td');

            for (let j = 0; j < players; j++) {
                const bodyRoundData = document.createElement('td');

                bodyRoundData.innerHTML += rounds[i][j][0].score + ' + ';
                bodyRoundData.innerHTML += rounds[i][j][1].score + ' + ';
                bodyRoundData.innerHTML += rounds[i][j][2].score + ' = ';
                bodyRoundData.innerHTML +=
                    rounds[i][j][0].score +
                    rounds[i][j][1].score +
                    rounds[i][j][2].score;

                bodyRoundData.title =
                    rounds[i][j][0].score +
                    ' + ' +
                    rounds[i][j][1].score +
                    ' + ' +
                    rounds[i][j][2].score +
                    ' = ' +
                    (rounds[i][j][0].score +
                        rounds[i][j][1].score +
                        rounds[i][j][2].score);
                bodyRoundData.title +=
                    ' - ' +
                    rounds[i][j][0].formatted +
                    ' | ' +
                    rounds[i][j][1].formatted +
                    ' | ' +
                    rounds[i][j][2].formatted;

                if (j === players - 1) {
                    bodyRoundAverage.innerHTML += util.calculateAvg(
                        rounds[i][j][0].score,
                        rounds[i][j][1].score,
                        rounds[i][j][2].score
                    );
                } else {
                    bodyRoundAverage.innerHTML +=
                        util.calculateAvg(
                            rounds[i][j][0].score,
                            rounds[i][j][1].score,
                            rounds[i][j][2].score
                        ) + ' | ';
                }

                bodyRound.appendChild(bodyRoundData);
                bodyRound.appendChild(bodyRoundAverage);
            }

            this.body.appendChild(bodyRound);
        }
    }
}

const playdataTable = new PlaydataTableClass();
const gameHistoryTable = new GameHistoryTableClass();

globalHTML.playerAmountSelector.addEventListener('change', function () {
    while (preCalculated.length > 0) {
        preCalculated.pop();
    }
    while (mergedCalculated.length > 0) {
        mergedCalculated.pop();
    }

    playerAmount = parseInt(this.value);
    for (let i = 0; i < playerAmount; i++) {
        mergedCalculated.push(0);
        for (let j = 0; j < 3; j++) {
            preCalculated.push(0)
        }
    }

    playdataTable.createHead(playerAmount).createBody(gameRounds, playerAmount);
    gameHistoryTable.createHead(playerAmount);
    globalHTML.addRoundButton.disabled = false;
    autoCalculation();
});

globalHTML.addRoundButton.addEventListener('click', function () {
    const gameRound = [];
    for (let i = 0; i < playerAmount; i++) {
        playersWon.push(false);
        playerNames[i] = document.getElementById(
            'playdata_table_head_player_name_input_' + i
        ).value;
        document.getElementById(
            'playdata_table_head_player_name_input_' + i
        ).disabled = true;
        playerMaximumScores[i] = parseInt(
            document.getElementById(
                'playdata_table_body_setup_max_score_input_player_' + (i + 1)
            ).value
        );
        document.getElementById(
            'playdata_table_body_setup_max_score_input_player_' + (i + 1)
        ).disabled = true;
        if (initialScoreParse === false) {
            playerRemainingScores[i] = playerMaximumScores[i];
        }

        while (preCalculated.length > 0) {
            preCalculated.pop();
        }
        while (mergedCalculated.length > 0) {
            mergedCalculated.pop();
        }
    
        for (let i = 0; i < playerAmount; i++) {
            mergedCalculated.push(0);
            for (let j = 0; j < 3; j++) {
                preCalculated.push(0)
            }
        }

        let _preCalculated = 0;
        const currentGameRound = [];
        for (let j = 0; j < 3; j++) {
            currentGameRound.push({
                score: util.parseScore(
                    document.getElementById(
                        'playdata_table_body_score_input_player_' +
                            (i + 1) +
                            '_field_' +
                            (j + 1)
                    ).value
                ),
                formatted: util.parseFormattedScore(
                    document.getElementById(
                        'playdata_table_body_score_input_player_' +
                            (i + 1) +
                            '_field_' +
                            (j + 1)
                    ).value
                ),
            });
            document.getElementById(
                'playdata_table_body_score_input_player_' +
                    (i + 1) +
                    '_field_' +
                    (j + 1)
            ).value = '';

            _preCalculated += currentGameRound[j].score;
        }

        if (_preCalculated > playerRemainingScores[i]) {
            alert(
                `Player ${
                    i + 1
                } has exceeded the maximum score! The round thus will not be added. The score of all other players will not be affected.`
            );
        } else if (
            _preCalculated === playerRemainingScores[i] &&
            !playersWon[i]
        ) {
            playersWon[i] = true;
            alert(
                `Player ${
                    i + 1
                } won! All other players can still continue playing.`
            );
            for (let j = 0; j < 3; j++) {
                document.getElementById(
                    'playdata_table_body_score_input_player_' +
                        (i + 1) +
                        '_field_' +
                        (j + 1)
                ).disabled = true;
            }
            playerRemainingScores[i] -= _preCalculated;
        } else {
            playerRemainingScores[i] -= _preCalculated;
        }

        gameRound.push(currentGameRound);
    }
    gameRounds.push(gameRound);

    gameHistoryTable.createBody(gameRounds, playerAmount);

    globalHTML.playerAmountSelector.disabled = true;

    initialScoreParse = true;

    const scoreInputFields = document.querySelectorAll(
        'input[id^="playdata_table_body_score_input_player_"]'
    );
    for (let i = 0; i < scoreInputFields.length; i++) {
        if (scoreInputFields[i].disabled === false) {
            scoreInputFields[i].focus();
            break;
        }
    }

    playdataTable.updateRemainingRow(
        playdataTable._createRemainingRowNormal(playerAmount, playerRemainingScores)
    );
    playdataTable.updateLastScoreRow(
        playdataTable._createLastScoreRow(gameRounds, playerAmount)
    );
    playdataTable.updateScoreRow(
        playdataTable._createScoreRow(gameRounds, playerAmount)
    );

    globalHTML.exportGameButton.disabled = false;
    autoCalculation()
});

globalHTML.exportGameButton.addEventListener('click', function () {
    const playerData = [];
    const roundData = [];

    for (let i = 0; i < playerAmount; i++) {
        playerData.push({
            name: playerNames[i],
            maximumScore: playerMaximumScores[i],
            remainingScore: playerRemainingScores[i],
            won: playersWon[i],
        });
    }

    for (let i = 0; i < gameRounds.length; i++) {
        const currentRound = [];
        for (let j = 0; j < playerAmount; j++) {
            currentRound.push({
                score1: gameRounds[i][j][0].score,
                score2: gameRounds[i][j][1].score,
                score3: gameRounds[i][j][2].score,
                formatted1: gameRounds[i][j][0].formatted,
                formatted2: gameRounds[i][j][1].formatted,
                formatted3: gameRounds[i][j][2].formatted,
                player: j + 1,
            });
        }
        roundData.push({
            round: i + 1,
            scores: currentRound,
        });
    }

    const gameData = {
        playerAmount: playerAmount,
        playerData: playerData,
        roundData: roundData,
        token: Math.random().toString(36).substring(2, 9),
    };

    if (
        confirm(
            `Are you sure you want to export the game data? Players will be able to continue playing the game after the export.`
        )
    ) {
        const gameDataJSON = JSON.stringify(gameData);

        const gameDataBlob = new Blob([gameDataJSON], {
            type: 'application/json',
        });
        const gameDataURL = URL.createObjectURL(gameDataBlob);

        const gameDataLink = document.createElement('a');
        gameDataLink.href = gameDataURL;
        gameDataLink.download = 'game_data.json';
        gameDataLink.click();
    } else {
        alert(`Game data export cancelled.`);
    }
});

// globalHTML.gameFileUpload is a file input element. Extract the json data of the file and parse it.
globalHTML.gameFileUpload.addEventListener('change', function () {
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const gameData = JSON.parse(e.target.result);

        if (gameData.token === undefined) {
            alert(
                `The file you uploaded is not a valid game data file. Please try again.`
            );
        } else {
            if (
                confirm(
                    `Are you sure you want to import the game data? Players will NOT be able to continue the current game after the import!
                    You should export it in case you want to save it before you continue with the import!`
                )
            ) {
                playdataTable.resetHead();
                playdataTable.resetBody();

                gameHistoryTable.resetHead();
                gameHistoryTable.resetBody();

                while (gameRounds.length > 0) {
                    gameRounds.pop();
                }

                while (playerNames.length > 0) {
                    playerNames.pop();
                }

                while (playerMaximumScores.length > 0) {
                    playerMaximumScores.pop();
                }

                while (playerRemainingScores.length > 0) {
                    playerRemainingScores.pop();
                }

                while (playersWon.length > 0) {
                    playersWon.pop();
                }

                playerAmount = gameData.playerAmount;
                initialScoreParse = true;

                for (let i = 0; i < playerAmount; i++) {
                    playerNames.push(gameData.playerData[i].name);
                    playerMaximumScores.push(
                        gameData.playerData[i].maximumScore
                    );
                    playerRemainingScores.push(
                        gameData.playerData[i].remainingScore
                    );
                    playersWon.push(gameData.playerData[i].won);
                }

                for (let i = 0; i < gameData.roundData.length; i++) {
                    const currentRound = [];
                    for (let j = 0; j < playerAmount; j++) {
                        currentRound.push([
                            {
                                score: gameData.roundData[i].scores[j].score1,
                                formatted:
                                    gameData.roundData[i].scores[j].formatted1,
                            },
                            {
                                score: gameData.roundData[i].scores[j].score2,
                                formatted:
                                    gameData.roundData[i].scores[j].formatted2,
                            },
                            {
                                score: gameData.roundData[i].scores[j].score3,
                                formatted:
                                    gameData.roundData[i].scores[j].formatted3,
                            },
                        ]);
                    }
                    gameRounds.push(currentRound);
                }

                playdataTable.createHead(playerAmount);
                playdataTable.updateSetupRow(
                    playdataTable._createSetupRow(gameRounds, playerAmount)
                );
                playdataTable.createBody(
                    gameRounds,
                    playerAmount,
                    playerRemainingScores
                );

                gameHistoryTable.createHead(playerAmount);
                gameHistoryTable.createBody(gameRounds, playerAmount);

                globalHTML.playerAmountSelector.disabled = true;

                const scoreInputFields = document.querySelectorAll(
                    'input[id^="playdata_table_body_score_input_player_"]'
                );
                for (let i = 0; i < scoreInputFields.length; i++) {
                    if (scoreInputFields[i].disabled === false) {
                        scoreInputFields[i].focus();
                        break;
                    }
                }

                for (let i = 0; i < playerAmount; i++) {
                    const nameField = document.getElementById(
                        `playdata_table_head_player_name_input_${i}`
                    );
                    nameField.value = playerNames[i];
                    nameField.disabled = true;

                    const maxScoreField = document.getElementById(
                        `playdata_table_body_setup_max_score_input_player_${
                            i + 1
                        }`
                    );
                    maxScoreField.value = playerMaximumScores[i];
                    maxScoreField.disabled = true;
                }

                globalHTML.playerAmountSelector.value = playerAmount;
                globalHTML.playerAmountSelector.disabled = true;

                globalHTML.addRoundButton.disabled = false;
            } else {
                alert(`Game data import cancelled.`);
            }
        }
    };
    reader.readAsText(file);
});

function createIndex(id) {
    let newId = id;
    newId = newId.replace('playdata_table_body_score_input_player_', '');
    const player = parseInt(newId[0]);
    newId = newId.replace(player, '');
    newId = newId.replace('_field_', '');
    const field = parseInt(newId[0]);

    const index = (player - 1) * 3 + (field - 1);
    return {player: player, field: field, index: index};
}

function autoCalculation() {
    document
        .querySelectorAll(
            'input[id^="playdata_table_body_score_input_player_"]'  
        )
        .forEach(function (element) {
            document
                .getElementById(element.id)
                .addEventListener('input', (ev) => {
                    const targetValue = ev.target.value;
                    console.log(targetValue.toString(), ev.target.id, createIndex(ev.target.id));
                    const regex =
                        /^([tTdD]?[0-9]|[tTdD]?1[0-9]|[tTdD]?20|[bB]([iI]|[oO]))$/; 
                    if (ev.target.value.toString() === '') {
                        ev.target.style.border = '';
                        preCalculated[createIndex(ev.target.id).index] = 0;
                    } else if (!regex.test(ev.target.value.toString())) {
                        ev.target.style.border = '1px solid red';
                        globalHTML.addRoundButton.disabled = true;
                        preCalculated[createIndex(ev.target.id).index] = 0;
                    } else if (ev.target.value.toString() !== '') {
                        ev.target.style.border = '1px solid green';
                        globalHTML.addRoundButton.disabled = false;
                        preCalculated[createIndex(ev.target.id).index] = util.parseScore(ev.target.value.toString())
                    }

                    mergedCalculated[createIndex(ev.target.id).player - 1] = preCalculated.slice((createIndex(ev.target.id).player - 1) * 3, (createIndex(ev.target.id).player - 1) * 3 + 3).reduce((a, b) => a + b, 0)

                    playdataTable.updateRemainingRow(playdataTable._createRemainingRowPre(playerAmount, playerRemainingScores, mergedCalculated))
                    console.log(preCalculated, mergedCalculated)
                });
        });
}

console.info('Script loaded.');
