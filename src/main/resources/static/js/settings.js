let next = $('#next1').val();
let grid = $('#grid1').val();
let stat = $('#result1').val();
let id = $('#settingsId').val();
let username = $('#username').val();

if (next === '1'){
    $('#next').trigger('click');
}

if(grid === '1'){
    $('#grid').trigger('click');
}

$('#stat option[value=' + stat + ']').prop('selected', true);

$('#saveButton').on('click', function(){
    let nextValue;
    if ($('#next').is(':checked')){
        nextValue = 1;
    }
    else{
        nextValue = 0;
    }
    let gridValue;
    if ($('#grid').is(':checked')){
        gridValue = 1;
    }
    else{
        gridValue = 0;
    }
    let statValue = $('#stat').val();
    $.ajax({
        type: 'POST',
        contentType: "application/json",
        url: '/api/saveSettings/' + username,
        data: JSON.stringify({"id": id, "grid": gridValue, "next": nextValue, "stat": statValue}),
        success: function (data) {
            document.location.href = '/main';
        }, // обработка ответа от сервера
        error: function (jqXHR) {
            alert('Ошибка сервера');
        }
    }).fail(function() {
        alert("Разорвано соединение с сервером")
    });;
})