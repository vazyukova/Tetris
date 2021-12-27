var levelId = $('#levelId').val();
var glassId = $('#glassId').val();
var parent = $('#' + glassId).parent();
var glassHeight = parent.find('.height').text();
var glassWidth = parent.find('.width').text();
$('#' + glassId).css("color", "silver");

    $('.add').on('click', function(){
        $('#' + glassId).css("color", "black");
        glassId = $(this).attr('id');
        console.log(glassId);
        $('#' + glassId).css("color", "silver");
        parent = $('#' + glassId).parent();
        glassHeight = parent.find('.height').text();
        glassWidth = parent.find('.width').text();
    });

    $('.saveButton').on('click', function () {
        console.log(glassId);
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            url: '/api/setGlass/' + levelId,
            data: glassId,
            success: function(data) { document.location.href = "/level/" + levelId}, // обработка ответа от сервера
            error: function(jqXHR) { console.log('Ошибка выполнения'); },
            complete: function() { console.log('Завершение выполнения'); }
        }).fail(function() {
            alert("Разорвано соединение с сервером")
        });;
    })
