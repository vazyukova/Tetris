$('.modal_cross').on('click', function(){
    $('.modal').removeClass('active');
    $('.overlay').removeClass('active');
    location.href = '/glasses';
})