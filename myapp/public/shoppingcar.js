$(document).ready(function(){
        $.ajax({url:"/inputs",method:"GET"}).done(function(input){
            var inputs=input
            $.ajax({url:"/allitems",method:"GET"}).done(function(items){
                 var allItems=items
                 $.ajax({url:"/promotions",method:"GET"}).done(function(gift){
                    var promotion=gift
                    var inputs_count=count_inputs(inputs)
                    var order_info=get_order_info(inputs_count,allItems)
                    var gift_info=get_gift_info(order_info,promotion)
                    var order_info_final=minus_gift_price(order_info,gift_info)
                    var caculate=caculate_price(order_info_final,gift_info)
                    var Receipt={Order:order_info_final,
                                 Gift:gift_info,
                                 Caculate:caculate}
                    var compiled = _.template($("#charts").text());
                    $("#Receipt").append(compiled({'Receipt':Receipt}));
                })
            })
        })
})
//    for(var i=0;i<Receipt.Order.length;i++){
//        $("#order_info").find("tbody").append("<tr><td>"+Receipt.Order[i].name+"</td>"+"<td>"+Receipt.Order[i].price+"元</td>"
//        +"<td>"+Receipt.Order[i].count+Receipt.Order[i].unit+"</td>"+"<td>"+Receipt.Order[i].total+"元</td>"+"</tr>")
//    }
//    for(var i=0;i<Receipt.Gift.length;i++){
//        $("#gift_info").find("tbody").append("<tr><td>"+Receipt.Gift[i].name+"</td>"+"<td>"+Receipt.Gift[i].price+"元</td>"
//        +"<td>"+Receipt.Gift[i].count+Receipt.Gift[i].unit+"</td>"+"<td>"+Receipt.Gift[i].total+"元</td>"+"</tr>")
//    }
//    $("#caculate_info").find("#sum").append(Receipt.Caculate.Sum+"元")
//    $("#caculate_info").find("#gift_sum").append(Receipt.Caculate.gifts_price+"元")

function find_same(str,inputs_count,judgement){
   for(var j=0;j<inputs_count.length;j++)  {
       if(str==inputs_count[j].barcode){
          inputs_count[j].count++
          judgement=1
       }
   }
   if (judgement==0) {
       inputs_count.push({barcode:str,count:1})
   }
}

function another_find_same(str,inputs_count,judgement){
    chenzhong=str.split('-')
    for(var j=0;j<inputs_count.length;j++){
        if(chenzhong[0]==inputs_count[j].barcode){
            inputs_count[j].count+=parseInt(chenzhong[1])
            judgement=1
        }
    }
    if(judgement==0){
        inputs_count.push({barcode:chenzhong[0],count:parseInt(chenzhong[1])})
    }
}

function count_inputs(inputs){
    var inputs_count=[],chenzhong=[],judgement
    for(var i=0;i<inputs.length;i++){
        judgement=0
        if (inputs[i].indexOf('-')==-1){
            find_same(inputs[i],inputs_count,judgement)
        }
        else{
            another_find_same(inputs[i],inputs_count,judgement)
        }
    }
    return inputs_count
}

function get_order_info(inputs_count,allItems){
    var order_info=[]
    for(i=0;i<inputs_count.length;i++) {
        for(j=0;j<allItems.length;j++) {
            if (inputs_count[i].barcode==allItems[j].barcode){
                order_info.push({barcode:allItems[j].barcode,name:allItems[j].name,unit:allItems[j].unit,count:inputs_count[i].count,price:allItems[j].price,total:allItems[j].price*inputs_count[i].count})
            }
        }
    }
    return order_info
}

function get_gift_info(order_info,promotion){
    var gift_info=[]
    for(i=0;i<order_info.length;i++){
        for(j=0;j<promotion[0].barcodes.length;j++)  {
            if (order_info[i].barcode==promotion[0].barcodes[j])   {
                gift_info.push({barcode:order_info[i].barcode,name:order_info[i].name,unit:order_info[i].unit,
                price:order_info[i].price,count:parseInt(order_info[i].count/3),total:parseInt(order_info[i].count/3)*order_info[i].price})
            }
        }
    }
    return gift_info
}

function minus_gift_price(order_info,gift_info){
    var order_info_final=order_info
    for(i=0;i<order_info.length;i++)  {
        for(j=0;j<gift_info.length;j++)  {
            if(order_info_final[i].barcode==gift_info[j].barcode)  {
                order_info_final[i].total=order_info_final[i].price*(order_info_final[i].count-gift_info[j].count)
            }
        }
    }
   return order_info_final
}

function caculate_price(order_info_final,gift_info){
    var caculate={Sum:0,gifts_price:0}
    for(i=0;i<order_info_final.length;i++){
        caculate.Sum+=order_info_final[i].total
    }
    for(i=0;i<gift_info.length;i++){
        caculate.gifts_price+=gift_info[i].total
    }
    return caculate
}





//
//function loadAllItems() {
//    return [
//        {
//            barcode: 'ITEM000000',
//            name: '可口可乐',
//            unit: '瓶',
//            price: 3.00
//        },
//        {
//            barcode: 'ITEM000001',
//            name: '雪碧',
//            unit: '瓶',
//            price: 3.00
//        },
//        {
//            barcode: 'ITEM000002',
//            name: '苹果',
//            unit: '斤',
//            price: 5.50
//        },
//        {
//            barcode: 'ITEM000003',
//            name: '荔枝',
//            unit: '斤',
//            price: 15.00
//        },
//        {
//            barcode: 'ITEM000004',
//            name: '电池',
//            unit: '个',
//            price: 2.00
//        },
//        {
//            barcode: 'ITEM000005',
//            name: '方便面',
//            unit: '袋',
//            price: 4.50
//        }
//    ];
//}
//

function loadPromotions() {
    return [
        {
            type: 'BUY_TWO_GET_ONE_FREE',
            barcodes: [
                'ITEM000000',
                'ITEM000001',
                'ITEM000005'
            ]
        }
    ];
}
