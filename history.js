console.info('Loading History script...');

const gameData = [];
const tokens = [];

document.getElementById('game_file_upload_history').addEventListener('change', function() {
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = function(progressEvent) {
        const data = JSON.parse(progressEvent.target.result);
        gameData.push(data.roundData);
        tokens.push(data.token);
    };
    reader.readAsText(file);
});

console.info('History script loaded.');
