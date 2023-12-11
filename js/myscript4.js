var mydata;
//foods.json واکشی اطلاعات از فایل  
function loadData() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "../json/foods.json");
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var jsObject = JSON.parse(xhttp.responseText);
            valueCallBack(jsObject);
        }
    };
    xhttp.send();
}
//----------------------------------------------------------------
//mydata پر کردن متغیر 
function valueCallBack(jsObject) {
    mydata = jsObject;
}

//----------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function() {
    loadData();
    update_shopcart_number();
    update_shopcart_Total();
    create_shopcart_table();
});

//----------------------------------------------------------------
// واکشی کل اطلاعات حافظه 
function getFoodsFromLocalStorage() {
    let foods;
    let josnStrFoods = localStorage.getItem('foods');
    if (josnStrFoods === null) {
        foods = []
    } else {
        foods = JSON.parse(josnStrFoods)
    }
    return foods;
}
//----------------------------------------------------------------
// برگرداندن اطلاعات کالای جاری که اگر ایندکس -1 باشد از داخل فایل جیسون و در غیر این صورت از حافظه واکشی می شود 
function getCurrentProduct(index) {
    var product;
    if (index == -1) {
        const urlParams = new URLSearchParams(window.location.search);
        const group_id = urlParams.get('group');
        const product_id = urlParams.get('product');
        product = mydata.product_groups[group_id].group_products[product_id];
    } else {
        const foods = getFoodsFromLocalStorage();
        product = foods[index];
    }
    return product;
}

//----------------------------------------------------------------
//اضافه کردن کالا به سبد خرید
function addToShopCart(type_index) {
    var product = getCurrentProduct(-1);
    var select_food = {
        id: product.product_id,
        name: product.product_name,
        image: product.product_image[0],
        type: product.product_type[type_index],
        price: product.product_price[type_index],
        qty: 1
    }
    addToMemory(select_food, 1);
}

//----------------------------------------------------------------
//ذخیره کردن کالا در حافظه
function addToMemory(select_food, count) {
    const foods = getFoodsFromLocalStorage();
    var index = -1;

    for (let i = 0; i < foods.length; i++) {
        const food = foods[i];
        if (food.id === select_food.id && food.price === select_food.price) {
            index = i;
            break;
        }
    }

    if (index === -1) {
        foods.push(select_food);
    } else {
        foods[index].qty += count;
    }

    josnStrFoods = JSON.stringify(foods);
    localStorage.setItem('foods', josnStrFoods);
    update_shopcart_number();
    update_shopcart_Total()
}

//----------------------------------------------------------------
//حذف کردن کالا از حافظه
function removeFromMemory(index) {
    const foods = getFoodsFromLocalStorage();
    for (let i = 0; i < foods.length; i++) {
        if (i === index) {
            foods.splice(i, 1);
        }
    }
    josnStrFoods = JSON.stringify(foods);
    localStorage.setItem('foods', josnStrFoods);
    update_shopcart_number();
    create_shopcart_table();
    update_shopcart_Total()
}

//----------------------------------------------------------------
//بروزرسانی عدد کنار سبد خرید
function update_shopcart_number() {
    foods = getFoodsFromLocalStorage();
    var len = 0;
    if (foods !== null) {
        len = foods.length;
    }
    document.getElementById("shopcart-count").innerText = '(' + len + ')';
    document.getElementById("shopcart-count2").innerText = '(' + len + ')';
}

//----------------------------------------------------------------
//بروزرسانی جمع کل قیمت سبد خرید
function update_shopcart_Total() {
    foods = getFoodsFromLocalStorage();
    var sum = 0;
    for (let i = 0; i < foods.length; i++) {
        const element = foods[i];
        sum += element.price * element.qty;
    }
    document.getElementById("total-price").innerText = sum;
}
//----------------------------------------------------------------
//اضافه کردن تعداد کالا به حافظه
function plusNumber(index) {
    select_food = getCurrentProduct(index)

    var number = Number(document.getElementById("number_" + index).value);
    number++;
    document.getElementById("number_" + index).value = number;

    addToMemory(select_food, 1);
    create_shopcart_table();
}

//----------------------------------------------------------------
//کم کردن تعداد کالا از حافظه
function minusNumber(index) {
    select_food = getCurrentProduct(index)

    var number = Number(document.getElementById("number_" + index).value);
    if (number > 1) {
        number--;
        document.getElementById("number_" + i).value = number;

        addToMemory(select_food, -1);
        create_shopcart_table();
    }
}

//----------------------------------------------------------------
//ساخت المان سطر برای جدول سبد خرید
function create_shopcart_row(rowIndex, id, name, image, type, price, qty) {
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    td1.classList.add('td-1');
    var div1 = document.createElement('div');
    div1.classList.add('number');
    var span1 = document.createElement('span');
    span1.setAttribute('id', 'plus_' + rowIndex);
    span1.setAttribute('onclick', 'plusNumber(' + rowIndex + ')');
    var input1 = document.createElement('input');
    input1.setAttribute('type', 'number');
    input1.setAttribute('id', 'number_' + rowIndex);
    input1.setAttribute('readonly', '');
    input1.setAttribute('value', qty);
    var span2 = document.createElement('span');
    span2.setAttribute('id', 'minus_' + rowIndex);
    span2.setAttribute('onclick', 'minusNumber(' + rowIndex + ')');
    div1.appendChild(span1)
    div1.appendChild(input1)
    div1.appendChild(span2)
    td1.appendChild(div1);
    tr.appendChild(td1);


    var td2 = document.createElement('td');
    td2.classList.add('td-2');
    var img1 = document.createElement('img');
    img1.setAttribute('src', image);
    img1.setAttribute('width', '130');
    img1.setAttribute('height', '110');
    td2.appendChild(img1);
    tr.appendChild(td2);

    var td3 = document.createElement('td');
    td3.classList.add('td-3');
    td3.appendChild(document.createTextNode(name + '(' + type + ')'))
    tr.appendChild(td3);

    var td4 = document.createElement('td');
    td4.classList.add('td-4');
    td4.appendChild(document.createTextNode(price + " تومان"))
    tr.appendChild(td4);

    var td5 = document.createElement('td');
    td5.classList.add('td-5');
    td5.appendChild(document.createTextNode(qty + " عدد"))
    tr.appendChild(td5);

    var td6 = document.createElement('td');
    td6.classList.add('td-6');
    td6.appendChild(document.createTextNode(qty * price))
    tr.appendChild(td6);

    var td7 = document.createElement('td');
    var a1 = document.createElement('a');
    var i1 = document.createElement('i');
    i1.classList.add('fa');
    i1.classList.add('fa-times');
    a1.setAttribute('onclick', 'removeFromMemory(' + rowIndex + ')');
    a1.appendChild(i1);
    td7.appendChild(a1)
    tr.appendChild(td7);
    return tr;
}
//----------------------------------------------------------------
//ساخت جدول کامل برای سبد خرید
function create_shopcart_table() {
    var shopcartTable = document.getElementById("shopcart-table");
    shopcartTable.innerHTML = '';
    const foods = getFoodsFromLocalStorage();
    for (let i = 0; i < foods.length; i++) {
        const element = foods[i];
        var tr = create_shopcart_row(i, element.id, element.name, element.image, element.type, element.price, element.qty)
        shopcartTable.appendChild(tr);
    }
}

//----------------------------------------------------------------