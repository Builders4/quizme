console.log('here>>>>>>>>>>>');
$(function () {
    if($('#list-div select')[0].children.length === 1){
        $('#list-div').hide();
    }
    if($('#def-div select')[0].children.length === 1){
        $('#def-div').hide();
    }
    if(!$('.suggested-imgs img')[0]){
        $('.suggested-imgs').hide();
    }


    $('#def-div select option').click(function () {
        $("#textarea-def").text('');
        if ('Suggested Definitions' != this.text) {
            $("#textarea-def").text(this.text);
            console.log('test1');
        }
        console.log('test2');
        console.log(this);
    });
    $('#list-div select option').click(function () {
        $("input[name=list").val('');
        if ('Saved Lists' != this.text) {
            $('input[name=list').val(this.text);
        }
    });
        $(".suggested-imgs img").click(function () {
        console.log(this.attributes.src.value);
        $("input[name=img_url]").val('');
        $("input[name=img_url]").val(this.attributes.src.value);
    });
}); 
