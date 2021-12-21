$('#level-button').on('click', function(){
    $('#level').addClass('active');
    $('.overlay').addClass('active');
})

$('#game-button').on('click', function(){
    $('#game').addClass('active');
    $('.overlay').addClass('active');
})

$('.modal_cross').on('click', function(){
    $('#level').removeClass('active');
    $('#game').removeClass('active');
    $('.overlay').removeClass('active');
})