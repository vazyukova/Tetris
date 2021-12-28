$('#my-stat').on('click', function (){
    $('#my-stat').attr('disabled', true);
    $('#best').attr('disabled', false);
    $('#type').val('my');
    getStatistics();
})

$('#best').on('click', function (){
    $('#best').attr('disabled', true);
    $('#my-stat').attr('disabled', false);
    $('#type').val('best');
    getStatistics();
})

$('#resultType').on('change', function(){
    getStatistics();
})

function getStatistics(){
    let url;

    let resType = $('#resultType').val();
    if (resType === '1'){ //по очкам
        if ($('#my-stat').prop('disabled')) { //Моя
            url = '/api/getMyStatistic/ByResult';
        }
        else{
            url = '/api/getBestStatistic/ByResult'
        }
        $('#typeth').text("Очки");
    }
    else{
        if (!$('#my-stat').prop('disabled')) { //Лучшие
            url = '/api/getBestStatistic/ByTime';
        }
        else{
            url = '/api/getMyStatistic/ByTime'
        }
        $('#typeth').text('Время');
    }
    $.ajax({
        type: 'GET',
        contentType: "application/json",
        url: url,
        success: function (data) {
            $('#allStatistics tbody').remove();
            data.forEach(function (stat){
                console.log(stat.result + " " + stat.time)
                if (stat.result === -1 || stat.time === '0:0') {
                    console.log();
                }
                else{
                    $('#allStatistics').append('<tr id="' + stat.id + '"></tr>');
                    $('#' + stat.id).append('<td>' + stat.user.username + '</td>');
                    if (resType === '1')
                        $('#' + stat.id).append('<td>' + stat.result + '</td>');
                    else
                        $('#' + stat.id).append('<td>' + stat.time + '</td>');
                }
            })
        }
    }).fail(function() {
        alert("Разорвано соединение с сервером")
    });
}