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
    $('#def-div select').change(function () {
        let def = $(this).children("option:selected").val();
        $("#textarea-def").text('');
        if ('Suggested Definitions' != def) {
            $("#textarea-def").text(def);
        }
    });
    $('#list-div select').change(function () {
        let listVal =$(this).children("option:selected").val();;
        $("input[name=list]").val('');
        if ('Saved Lists' != listVal) {
            $('input[name=list]').val(listVal);
        }
    });
        $(".suggested-imgs img").click(function () {
        console.log(this);
        $("input[name=img_url]").val('');
        $("input[name=img_url]").val(this.attributes.src.value);
    });
}); 
