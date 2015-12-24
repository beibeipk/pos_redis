$(document).ready(function(){
    $.ajax({url:"/inputs",method:"GET"}).done(function(input){
        if(input!=null){
        inputs=input
        }
        else{
        var inputs=[]
        }
        $('.items').on('click','button', function(){
            var input_item=$(this).closest('.items').data('barcode')
            inputs.push(input_item)
            $.ajax({url:"/inputs",type:"POST",data:{'inputs':JSON.stringify(inputs)}}).done
        })
    })
})