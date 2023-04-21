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