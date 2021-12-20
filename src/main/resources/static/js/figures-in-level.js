var levelId = $('#levelId').val();
var figures = [];

$.ajax({
    type: 'GET',
    contentType: "application/json",
    url: '/api/figures',
    success: function(data) {
        console.log(data);
        data.forEach(function (fig, l){
            $('.figure-list').append('<div class="figure-div-'+ fig.id + ' fig"></div>');
            $('.figure-div-' + fig.id).append('<button class="addButton" id="' + fig.id + '">Добавить</button>');
            if (fig.level === levelId)
            {
                $('#' + fig.id).text('Удалить');
            }
            $('.figure-div-' + fig.id).append('<table class="figure' + fig.id + '"></table>');
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
            $('#' + fig.id).on('click', function (){
                if ($(this).text() === 'Удалить'){
                    //figures.splice(l, 1);
                    figures = jQuery.grep(figures, function(value) {
                        return value !== fig.id;
                    });
                    $('#' + fig.id).text('Добавить');
                    console.log(figures);
                }
                else {
                    figures.splice(figures.length, 0, fig.id);
                    $('#' + fig.id).text('Удалить');
                    console.log(figures);
                }
            });
        });

    }, // обработка ответа от сервера
    error: function(jqXHR) { console.log('Ошибка выполнения'); },
    complete: function() { console.log('Завершение выполнения'); }
});

$('.saveButton').on('click', function (){
    figures.forEach(function (item) {
        $.ajax({
            type: 'POST',
            url: '/api/setFigureLevel/' + item,
            contentType: "application/json",
            data: JSON.stringify(levelId),
            success: function(data) { document.location.href = "/level/" + levelId}, // обработка ответа от сервера
            error: function(jqXHR) { console.log('Ошибка выполнения'); },
            complete: function() { console.log('Завершение выполнения'); }
        });
    })
});

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
