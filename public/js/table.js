let selectedList= window.location.href.split('=')[1];
if(!$('td:nth-of-type(2)')[0]){
    $('table').hide();
    $('.listbtn').hide();
}
if (selectedList !='My Lists'){
    $(`option[value=${selectedList}]`).attr('selected', 'selected');
}
