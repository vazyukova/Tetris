$('.add').on('click', function(){
    $('.modal').addClass('active');
    $('.overlay').addClass('active');
})

$('.modal_cross').on('click', function(){
    $('.modal').removeClass('active');
    $('.overlay').removeClass('active');
})

$("#saveButton").on("click", function(){
    let heightValue = $('#height').val();
    let widthValue = $('#width').val();
    console.log("высота " + heightValue + " ширина" + widthValue);
    if (heightValue < 15 || heightValue > 49 || widthValue < 7 || widthValue > 25){
        alert("Ширина стакана должна быть от 8 до 24 \n" +
            "Высота стакана должна быть от 16 до 48");
    }
    else {
        $.ajax({
            url: 'api/saveGlass',
            method: 'POST',
            dataType: 'application/json',
            contentType: 'application/json',
            data: JSON.stringify({'height': heightValue, 'width': widthValue}),
            success: function (data) {

            },
            complete: function (xhr){
                if (xhr.status === 422){
                    alert("Такой стакан уже существует");
                }
            }
        }).fail(function() {
            alert("Разорвано соединение с сервером")
        });;
        location.reload();
    }
});
