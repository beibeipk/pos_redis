var redis = require("redis"), client = redis.createClient();

client.on("connect", get_info);

$(document).ready(function(){
    function get_info() {
        var AllItems=[
                    {
                        "barcode": "ITEM000000",
                        "name": "可口可乐",
                        "unit": "瓶",
                        "price": 3.00
                    },
                    {
                        "barcode": "ITEM000001",
                        "name": "雪碧",
                        "unit": "瓶",
                        "price": 3.00
                    },
                    {
                        "barcode": "ITEM000002",
                        "name": "苹果",
                        "unit": "斤",
                        "price": 5.50
                    },
                    {
                        "barcode": "ITEM000003",
                        "name": "荔枝",
                        "unit": "斤",
                        "price": 15.00
                    },
                    {
                        "barcode": "ITEM000004",
                        "name": "电池",
                        "unit": "个",
                        "price": 2.00
                    },
                    {
                        "barcode": "ITEM000005",
                        "name": "方便面",
                        "unit": "袋",
                        "price": 4.50
                    }
                ]
        var Promotions=[
                         {
                           "type": "BUY_TWO_GET_ONE_FREE",
                           "barcodes": [
                             "ITEM000000",
                             "ITEM000001",
                             "ITEM000005"
                           ]
                         }
                       ]

        var allItems=[],promotion=[]
        client.set("allitems",JSON.stringify(AllItems),redis.print);
        client.get("allitems", function (key, value) {
            allItems=JSON.parse(value)
            client.set("promotions",JSON.stringify(Promotions),redis.print);
            client.get("promotions", function (key, value) {
                promotion=JSON.parse(value)
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
            });
        });
    }
}