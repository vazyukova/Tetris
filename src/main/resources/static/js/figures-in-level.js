var levelId = $('#levelId').val();
var figures = [];
var firstFigures = [];
let tetraminosIds = [55, 56, 57, 58, 59, 60, 61, 62, 63];

$.ajax({
    type: 'GET',
    contentType: "application/json",
    url: '/api/figures',
    success: function(data) {
        data.forEach(function (fig, l){
            if (!contains(tetraminosIds, fig.id)) {
                let flag = false;
                if (fig.level === null)
                {
                    flag = true;
                }
                else{
                    if (fig.level.id === Number(levelId) || fig.level.id === 0)
                        flag = true;
                }
                if (flag) {
                $('.figure-list').append('<div class="figure-div-' + fig.id + ' fig" style="display: inline-block; border: 2px solid purple; margin: 10pt;"></div>');
                $('.figure-div-' + fig.id).append('<button class="addButton" id="' + fig.id + '"style="border: none; background-color: #3bd9d9; color: black; margin: 2pt;">Добавить</button>');
                if (fig.level !== null) {
                    if (fig.level.id === Number(levelId)) {
                        $('#' + fig.id).text('Удалить');
                        $('#' + fig.id).css("background-color", "#ffac3f");
                        firstFigures.splice(figures.length, 0, fig.id);
                        figures.splice(figures.length, 0, fig.id);
                    }
                }
                $('.figure-div-' + fig.id).append('<table class="figure' + fig.id + '"></table>');
                var matrix = getMatrixFromStr(fig.matrix);
                for (var i = 0; i < 4; i++) {
                    $('.figure' + fig.id).append('<tr class="figure-' + i + '-' + fig.id + '"></tr>');
                    for (var j = 0; j < 4; j++) {
                        if (matrix[i][j] === '0') {
                            $('.figure-' + i + '-' + fig.id).append('<td style="color:white; width: 26pt; height: 26pt;">000</td>');
                        } else {
                            $('.figure-' + i + '-' + fig.id).append('<td style="background-color: #5723EEFF; color: #5723EEFF; width: 26pt; height: 26pt;">111</td>');
                        }
                    }
                }

                $('#' + fig.id).on('click', function () {
                    if ($(this).text() === 'Удалить') {
                        //figures.splice(l, 1);
                        figures = jQuery.grep(figures, function (value) {
                            return value !== fig.id;
                        });
                        $.ajax({
                            type: 'POST',
                            url: '/api/setFigureLevel/' + fig.id,
                            contentType: "application/json",
                            data: JSON.stringify(0),
                            success: function (data) {
                                //document.location.href = "/level/" + levelId
                            }, // обработка ответа от сервера
                            error: function (jqXHR) {
                                console.log('Ошибка выполнения');
                            },
                            complete: function () {
                                console.log('Завершение выполнения');
                            }
                        }).fail(function () {
                            alert("Разорвано соединение с сервером");
                        });
                        $('#' + fig.id).text('Добавить');
                        $('#' + fig.id).css("background-color", "#3bd9d9");
                        console.log(figures);
                    } else {
                        figures.splice(figures.length, 0, fig.id);
                        $.ajax({
                            type: 'POST',
                            url: '/api/setFigureLevel/' + fig.id,
                            contentType: "application/json",
                            data: JSON.stringify(levelId),
                            success: function (data) {
                                //document.location.href = "/level/" + levelId
                            }, // обработка ответа от сервера
                            error: function (jqXHR) {
                                console.log('Ошибка выполнения');
                            },
                            complete: function () {
                                console.log('Завершение выполнения');
                            }
                        }).fail(function () {
                            alert("Разорвано соединение с сервером");
                        });
                        $('#' + fig.id).text('Удалить');
                        $('#' + fig.id).css("background-color", "#ffb048");
                        console.log(figures);
                    }
                });
            }
        }
        });

    }, // обработка ответа от сервера
    error: function(jqXHR) { console.log('Ошибка выполнения'); },
    complete: function() {
    }
}).fail(function() {
    alert("Разорвано соединение с сервером")
});;

$('.saveButton').on('click', function (){
    /*figures.forEach(function (item) {
        let lev;
        console.log(firstFigures);
        console.log(figures);
        if (firstFigures.indexOf(item.id) !== -1 && figures.indexOf(item.id) === -1){
            lev = 0;
        }else {
            lev = levelId
        }
            $.ajax({
                type: 'POST',
                url: '/api/setFigureLevel/' + item,
                contentType: "application/json",
                data: JSON.stringify(lev),
                success: function (data) {
                    //document.location.href = "/level/" + levelId
                }, // обработка ответа от сервера
                error: function (jqXHR) {
                    console.log('Ошибка выполнения');
                },
                complete: function () {
                    console.log('Завершение выполнения');
                }
            }).fail(function(){
                alert("Разорвано соединение с сервером");
            });
        })*/
    document.location.href = "/level/" + levelId;
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

function contains(arr, elem) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === elem) {
            return true;
        }
    }
    return false;
}
