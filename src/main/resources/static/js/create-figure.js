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
        $(this).css("color", "white");
        matrix[Number(indexes[0])][Number(indexes[1])] = 0;
    }
})

$('.save').on('click', function () {
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
                document.location.href = '/figures';
            }, // обработка ответа от сервера
            error: function (jqXHR) {
                if(jqXHR.status === 422){
                    location.reload();
                    alert('Такая фигура уже существует');
                }
                else if (jqXHR.status === 400){
                    location.reload();
                    alert('Нарушена целостность фигуры');
                }
            }
        }).fail(function() {
            alert("Разорвано соединение с сервером")
        });;
});

/*function check(matrix){
    let checked = [];
    let current = checkFirstFill(matrix);
    console.log(current);
    checked.push(current);
    let flag = true;
    while(flag) {
         if (checkFill(matrix, checked)){
             flag = false;
             return true;
         }
         else {
             console.log()
             if (current.i !== 0 && matrix[current.i - 1][current.j] === 1 && checked.indexOf({
                 'i': current.i - 1,
                 'j': current.j
             }) === -1) {
                 checked.push({'i': current.i - 1, 'j': current.j});
                 current = {'i': current.i - 1, 'j': current.j};
             } else if (current.i !== 3 && matrix[current.i + 1][current.j] === 1 && checked.indexOf({
                 'i': current.i + 1,
                 'j': current.j
             }) === -1) {
                 checked.push({'i': current.i + 1, 'j': current.j});
                 current = {'i': current.i + 1, 'j': current.j};
             } else if (current.j !== 0 && matrix[current.i][current.j - 1] === 1 && checked.indexOf({
                 'i': current.i,
                 'j': current.j - 1
             }) === -1) {
                 checked.push({'i': current.i, 'j': current.j - 1});
                 current = {'i': current.i, 'j': current.j - 1};
             } else if (current.j !== 3 && matrix[current.i][current.j + 1] === 1 && checked.indexOf({
                 'i': current.i,
                 'j': current.j + 1
             }) === -1) {
                 checked.push({'i': current.i, 'j': current.j + 1});
                 current = {'i': current.i, 'j': current.j + 1};
             } else {
                 return false;
             }
         }
    }
    return true;
}

function checkFill(matrix, checked){
    console.log(checked);
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            if (matrix[i][j] === 1 && (checked.indexOf({'i': i, 'j': j}) === -1))
                console.log(i + " " + j)
                return true;
        }
    }
    return false;
}

function checkFirstFill(matrix){
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            if (matrix[i][j] === 1)
            return {'i' : i, 'j' : j};
        }
    }
    return null;
}*/