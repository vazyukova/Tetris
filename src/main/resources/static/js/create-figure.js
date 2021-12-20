var matrixStr = "";
var matrix = [];
for (let row = 0; row < 4; row++) {
    matrix[row] = [];

    for (let col = 0; col < 4; col++) {
        matrix[row][col] = 0;
    }
}
$('td').on('click', function () {
    var id = String($(this).attr('id'));
    var indexes = id.split('-');
    if (matrix[Number(indexes[0])][Number(indexes[1])] === 0) {
        $(this).css("background-color", "red");
        $(this).css("color", "red");
        matrix[Number(indexes[0])][Number(indexes[1])] = 1;
    }
    else
    {
        $(this).css("background-color", "white");
        $(this).css("background", "white");
        matrix[Number(indexes[0])][Number(indexes[1])] = 0;
    }
})

$('.save').on('click', function () {
    if (check(matrix)) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                matrixStr += matrix[i][j] + ",";
            }
            matrixStr += "|";
        }
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            url: '/api/saveFigure',
            data: JSON.stringify({"matrix": matrixStr}),
            success: function (data) {
                console.log(data);
            }, // обработка ответа от сервера
            error: function (jqXHR) {
                console.log('Ошибка выполнения');
            },
            complete: function () {
                console.log('Завершение выполнения');
            }
        });
        document.location.href = '/figures';
    }
    else{
        alert("Нарушена целостность фигуры!");
    }
});

function check(matrix){
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            if (matrix[i][j] === 1){
                if (i !== 0 && i !== 3 && j !== 0 && j !== 3) {
                    if ((matrix[i - 1][j] === 0) && (matrix[i + 1][j] === 0) && (matrix[i][j - 1] === 0) && (matrix[i][j + 1] === 0))
                        return false;
                }
                else if (i === 0){
                    if (j === 0 )
                    {
                        if ((matrix[i + 1][j] === 0) && (matrix[i][j + 1] === 0))
                            return false;
                    }
                    else if (j === 3){
                        if ((matrix[i + 1][j] === 0) && (matrix[i][j - 1] === 0))
                            return false;
                    }
                    else{
                        if ((matrix[i + 1][j] === 0) && (matrix[i][j - 1] === 0) && (matrix[i][j + 1] === 0))
                            return false;
                    }
                }
                else if (i === 3){
                    if (j === 3)
                    {
                        if ((matrix[i - 1][j] === 0) && (matrix[i][j - 1] === 0))
                            return false;
                    }
                    else if (j === 0){
                        if ((matrix[i + 1][j] === 0) && (matrix[i][j + 1] === 0))
                            return false;
                    }
                    else{
                        if ((matrix[i - 1][j] === 0) && (matrix[i][j - 1] === 0) && (matrix[i][j + 1] === 0))
                            return false;
                    }
                }
            }
        }
    }
    return true;
}