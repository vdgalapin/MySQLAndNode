function gameScore(score, gameID, player) {
    $.ajax({
        url: "/gamescore",
        method: "post",
        data: { score: score, gameID: gameID, player: player},
        success:function(data) {
            console.log('sent');
        }
    });
}

function getHighScore(gameID) {

    $.ajax({
        url: "/getHighScore",
        method: "get",
        data: {gameID: gameID},
        success: function(data) {
        }
    }).done(function(data) {
        BuitScoreTable(data);
    })

}
function BuitScoreTable(data) {
    document.getElementById('scoresTable').style.display = 'block';
    for(let x = 0; x < data.length; x++) {
        var row = '<tr>' + 
                '<td> <div align="center"> ' + data[x].username + ' </div> </td>' +
                '<td> <div align="center"> ' + data[x].score + ' </div> </td>' +
                '<td> <div align="center"> ' + data[x].date_played.substring(1, 10)  + ' </div> </td>' +
                '<td> <div align="center"> ' + data[x].time_played + ' </div> </td>' +
                '</tr>';
        $("#HighScoreTable tbody").append(row);
    }
}