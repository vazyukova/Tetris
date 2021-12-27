let tetraminosIds = [55, 56, 57, 58, 59, 60, 61, 62, 63];
$.ajax({
    type: 'GET',
    contentType: "application/json",
    url: '/api/figures',
    success: function(data) {
        console.log(data);
        data.forEach(function (fig){
            $('.figure-list').append('<div class="figure-div-'+ fig.id + '" style="display: inline-block; border: 2px solid #254141; margin: 10pt"></div>');
            $('.figure-div-' + fig.id).append('<table class="figure' + fig.id + '" ></table>');
            var matrix = getMatrixFromStr(fig.matrix);
            for (var i = 0; i < 4; i++) {
                $('.figure' + fig.id).append('<tr class="figure-' + i + '-' + fig.id + '"></tr>');
                for (var j = 0; j < 4; j++) {
                    if (matrix[i][j] === '0') {
                        $('.figure-' + i + '-' + fig.id ).append('<td style="color:white">000</td>');
                    } else {
                        $('.figure-' + i + '-' + fig.id ).append('<td style="background-color: red; color: red">111</td>');
                    }
                }
            }
            if (!contains(tetraminosIds, fig.id)) {
                $('.figure-div-' + fig.id).append('<button class="deleteLink" id="delete-' + fig.id + '"></button>');
                $('.figure-div-' + fig.id).append('<button class="editLink" id="edit-' + fig.id + '">Ред</button>');
                $('#delete-' + fig.id).on('click', function () {
                    $.ajax({
                        type: 'GET',
                        contentType: "application/json",
                        url: '/api/deleteFigure/' + fig.id,
                        success: function () {
                            location.reload();
                        }
                    })
                });
                $('#edit-' + fig.id).on('click', function () {
                    location.href = "/editFigure/" + fig.id;
                });
            }
        });

    }, // обработка ответа от сервера
    error: function(jqXHR) { console.log('Ошибка выполнения'); },
    complete: function() { console.log('Завершение выполнения'); }
}).fail(function() {
    alert("Разорвано соединение с сервером")
});;

function getMatrixFromStr(str){
    var matrix = [];
    for (let row = 0; row < 4; row++) {
        matrix[row] = [];
        for (let col = 0; col < 4; col++) {
            matrix[row][col] = 0;
        }
    }
    let rows = str.split('|', 4);
    let i = 0;
    rows.forEach (row => {
        if (row) {
            let j = 0;
            let columns = row.split(',');
            columns.forEach(column => {
                if (column) {
                    matrix[i][j] = column;
                }
                j++;
            })
        }
        i++;
    })
    return matrix;
}

function contains(arr, elem) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === elem) {
            return true;
        }
    }
    return false;
}
