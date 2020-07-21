

$('.fa').on("click",function(){
    console.log(this);
    let audio = new Audio(this.attr('src'));

  if($(this).hasClass('fa-play'))
   {
     $(this).removeClass('fa-play');
     $(this).addClass('fa-pause');
     audio.play();
   }
  else
   {
     $(this).removeClass('fa-pause');
     $(this).addClass('fa-play');
     audio.pause();
   }
});

audio.onended = function() {
     $("this").removeClass('fa-pause');
     $("this").addClass('fa-play');
};