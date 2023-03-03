﻿/* Initial jQuery as Page Loaded */
//(function ($) {
//    $(document).ready(function () {
//        setProduct();
//    });
//})(jQuery);

/* Form Validation */
function validateForm() {
    // add required table here
    var validation = 0
    $('#Breads input:radio').each(function () {
        var value = $(this).val() // none
        var check = $(this).is(':checked') // true
        if (value == 'none' && check) {
            validation++;
        }
    })

    var length = $('#Breads form').length
    if (length == validation) {
        console.log("Validatin failed")
        return false;
    } else if ($("#product option:selected").val() == "") {
        console.log("Select sandwich")
        return false;
    } else {
        console.log("Validation okay!!")
        return true;
    }
}

/* Handle onChange Select Product Menu */
function changeProduct(event) {
    var value = event.target.value;
    setProductPrice(value);
}

/* Set Total Price from selected option value */
function setProductPrice(value) {
    // parse price from value
    var productValue = value.split("-");
    var productPrice = productValue[1];
    $("#product-price").text(productPrice);

    // display total price
    var totalPrice =
        parseFloat($("#product-price").html()) + parseFloat($("#ingredients-price").html());
    $("#total-price").text(totalPrice);
}

/* Add to Cart */
function addToCart() {
    if (!validateForm()) {
        $(window).scrollTop(0);
    } else {
        // Get item from localStorage
        var cart = JSON.parse(localStorage.getItem("cart"));

        if (cart == null) {
            cart = [];
        }
        if (!(cart instanceof Array)) {
            cart = [cart];
        }

        // Customized item array
        var ingredients = [];

        $(".ingredientTable").each(function () {
            var quantity = $(this).find(".quantity").html();
            if (quantity > 0) {
                var ingredient = {
                    ingredientId: $(this).find(".ingredientId").html(),
                    description: $(this).find(".description").html(),
                    quantity: quantity,
                    price: $(this).find(".price").html(),
                };
                ingredients.push(ingredient);
            }
        });

        // Save item into localStorage
        var item = {
            productId: $("#product option:selected").val().split("-")[0],
            ingredients: ingredients,
            subTotal: $("#total-price").html(),
        };

        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
        $("#cart-icon").text(cart.length);
    }
}

/* Clear Selection */
function clearSelection(event) {
    // Uncheck radio button
    $("input:radio").each(function () {
        if ($(this).val() == "none") {
            $(this).prop("checked", true);
        } else {
            $(this).prop("checked", false);
        }
    });

    // Manually clear all sections

    $(".quantity").each(function () {
        $(this).text(0);
    });

    $(".amount").each(function () {
        $(this).text(0);
    });

    $("#ingredients-price").text(0);

    $("#total-amt").text(0);

    var totalPrice = parseFloat($("#product-price").html());
    $("#total-price").text(totalPrice);
}

/* Empty Cart */
function emptyCart(event) {
    $("#cart-icon").text(0);

    localStorage.clear();
}

/* Update Quantity from Selection Menu */
function changeQuantity(event) {
    var clickedId = event.target.id;
    var elementIdSplit = clickedId.split("-");
    var id = elementIdSplit[0];
    var quantityValue = elementIdSplit[1];

    updateTotalPrice(id, quantityValue);
}

function updateTotalPrice(id, quantityValue) {
    var itemPriceId = "#" + id + "-price";
    var cartQtyId = "#" + id + "-quantity";
    var cartAmtId = "#" + id + "-amount";

    var quantity = $(cartQtyId).html();

    switch (quantityValue) {
        case "none":
            quantity = 0;
            break;
        case "reg":
            quantity = 1;
            break;
        case "extra":
            quantity = 2;
            break;
    }

    $(cartQtyId).text(quantity);

    //Calculate new amount
    var amount = $(itemPriceId).html();
    var newAmount = (amount * quantity).toFixed(2);

    console.log(newAmount)
    $(cartAmtId).text(newAmount);

    //Calculate totals
    var totalQuantity = 0;
    $(".quantity").each(function () {
        var thisQuantity = $(this).html();
        totalQuantity += parseInt(thisQuantity);
    });
    $("#total-amt").text(totalQuantity);

    var ingredientsPrice = 0;
    $(".amount").each(function () {
        var thisAmount = $(this).html();
        ingredientsPrice += parseFloat(thisAmount);
    });

    $("#ingredients-price").text(ingredientsPrice.toFixed(2));
    var totalPrice =
        parseFloat($("#product-price").html()) +
        parseFloat($("#ingredients-price").html());
    $("#total-price").text(totalPrice);
}

/* Checkout */
function checkout() {
    var cart = localStorage.getItem("cart");

    console.log("hi")
    console.log(cart)
    $.ajax({
        type: 'POST',
        url: '/Order/ShoppingCart',
        data: { cart: cart },
        success: function () {
            console.log('Data sent to server successfully.');
        }
    });

    $(location).prop('href', '/order/shoppingcart')
}

//function transferData() {
//    var cart = localStorage.getItem("cart");

//    console.log("hi")
//    console.log(cart)
//    $.ajax({
//        type: 'POST',
//        url: '/Order/ShoppingCart',
//        data: { cart: cart },
//        success: function () {
//            console.log('Data sent to server successfully.');
//        }
//    });
//}