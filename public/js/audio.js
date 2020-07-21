
$('.fa').on("click", function () {
    console.log(this.attributes[0].nodeValue);
    let audio = new Audio(this.attributes[0].nodeValue);
    if ($(this).hasClass('fa-play')) {
        $(this).removeClass('fa-play');
        $(this).addClass('fa-pause');
        audio.play()


    }
    else {
        $(this).removeClass('fa-pause');
        $(this).addClass('fa-play');
        audio.pause();
    }
    setTimeout(() => {
        $(this).removeClass('fa-pause');
        $(this).addClass('fa-play');
    }, 500);

});

