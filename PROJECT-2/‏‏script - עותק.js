$(document).ready(function () {
    console.log("ready!");

    localStorage.setItem("selectedCoins", JSON.stringify([]));
    localStorage.setItem("infoRequests", JSON.stringify([]));
    $("a[name='liveReports']").click(liveReportsBtn);
    $("a[name='home']").click(homeBtn);
    $("a[name='about']").click(aboutBtn);
    $("#home").load("homeHtml.txt").promise().done(getAllCoins());
    $("#searchBar >button").click(searchBtn);

    // $("#home").promise().done(()=>{getAllCoins()});

    // getAllCoins();

});

function aboutBtn(){
    if (!(this.classList.contains("active"))) {
        // $("#home").load("homeHtml.txt");
        $("#about").load("aboutHtml.txt");

        $(".form-inline").hide();
        $("a[name='about']").addClass("active");
        $("a[name='liveReports']").removeClass("active");
        $("a[name='home']").removeClass("active");
        // deleteOtherDivs(this.name);
    }
}





function homeBtn() {
    if (!(this.classList.contains("active"))) {
        // $("#home").load("homeHtml.txt");
        $("#home").load("homeHtml.txt").promise().done(getAllCoins());

        $(".form-inline").show();
        $("a[name='home']").addClass("active");
        $("a[name='liveReports']").removeClass("active");
        $("a[name='about']").removeClass("active");
        // deleteOtherDivs(this.name);
    }
}

function getAllCoins() {
    $.getJSON("https://api.coingecko.com/api/v3/coins/list", function (data) {
            console.log("success");
            printCoinDivs(data);  
        })
        .fail(function () {
            console.log("error");
        })
        .always(function () {
            console.log("complete");
        });
}



function searchBtn(){
console.log("searchBtn clicked");
console.log($("#searchBar >input").val());
debugger;

}

function printCoinDivs(coin) {
    console.log("printing 50 coins");
    for (var i = 0; i < 50; i++) {
        newDiv = `
        <div class="col-sm-4 px-0">
                <div class="card" data-coinid="${coin[i].id}">

                    <label class="switch">
                        <input type="checkbox" name="${coin[i].symbol}">
                        <span class="slider round"></span>
                    </label>

                    <div class="card-body">
                        <h4 class="card-title">${coin[i].symbol}</h4>
                        <p class="card-text">${coin[i].name}</p>
                        <button name="moreInfoBtn" class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapse${coin[i].id}"
                            aria-expanded="false" aria-controls="collapse${coin[i].id}" data-id="${coin[i].id}">More Info</button>
                        <div class="collapse" id="collapse${coin[i].id}">
                            <div class="pad">
                                <progress class="progress" value="0" max="100" name="${coin[i].id}PB">0%</progress>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        `

        $(".coins > .row").append(newDiv);

    }
    $(".card input[type='checkbox']").change(checkBoxVal);
    $("button[name='moreInfoBtn']").click(MoreInfoBtnAction);

}










function checkBoxVal() {
    var sixCoin = "";
    // console.log("this checkBoxVal changed", this);
    var selectedCoinsArr = JSON.parse(localStorage.getItem("selectedCoins"));

    if (this.checked == true) {
        if (selectedCoinsArr.length < 5) {
            selectedCoinsArr.push(this.name);
            localStorage.setItem("selectedCoins", JSON.stringify(selectedCoinsArr));
            console.log("selectedCoinsArr:", selectedCoinsArr);
        } else {
            console.log("selectedCoinsArr is full with 5 items");
            sixCoin = this;
            overFiveModal(selectedCoinsArr, sixCoin);
        }
    } else {
        let thisCoin = this.name;
        selectedCoinsArr = selectedCoinsArr.filter(function (coins) {
            return coins != thisCoin;
        });

        localStorage.setItem("selectedCoins", JSON.stringify(selectedCoinsArr));
        console.log("selectedCoinsArr:", selectedCoinsArr);

    }

}

function overFiveModal(selectedCoinsArr, sixCoin) {

    $(".modal-body").html("");
    selectedCoinsArr.forEach(element => {
        newSortDiv = `
        <div class="sortCoins clearfix" >
            <h5>${element}</h5>
            <label class="switch modalswitch">
                <input type="checkbox" checked="true" name="${element}">
                <span class="slider round"></span>
            </label>
        </div>
        `
        $(".modal-body").append(newSortDiv);
    });

    $('#myModal').modal('show');

    console.log("sixCoin:", sixCoin);

    $(".modal-footer >.btn-danger").click([sixCoin], uncheckSixkBox);
    $(".modal-footer >.btn-success").click([sixCoin], checkModalBoxVal);

    function uncheckSixkBox() {
        console.log("need to uncheck this:", sixCoin);
        $(sixCoin).prop("checked", false);
        sixCoin = "";
    }

    function checkModalBoxVal() {
        var sortedCoinsArr = [];
        sortedCoinsArr = $(".modalswitch >input");
        var tempCoinArr = [];

        for (var i = 0; i < sortedCoinsArr.length; i++) {
            if (sortedCoinsArr[i].checked == false) {
                $(`.card input[name='${sortedCoinsArr[i].name}']`).prop("checked", false);
            } else {
                tempCoinArr.push(sortedCoinsArr[i].name);
            }
        }

        if (tempCoinArr.length == 5) {
            $(sixCoin).prop("checked", false);
            localStorage.setItem("selectedCoins", JSON.stringify(tempCoinArr));
        } else {
            tempCoinArr.push(sixCoin.name);
            localStorage.setItem("selectedCoins", JSON.stringify(tempCoinArr));
        }
        sixCoin = "";
    }
}




function deleteOtherDivs(divName){
    var mainChildernArr=$("main").children();
    mainChildernArr.map(x=>
    {
        if(mainChildernArr[x].id!=divName){
            $(`#${mainChildernArr[x].id}`).html("");
        }
    });
}




function scrollToDiv(divName) {
    $('html, body').animate({
        scrollTop: $(`#${divName}`).offset().top
    }, 2000);

}





function liveReportsBtn() {
    // $('html, body').animate({
    //     scrollTop: $(`#liveReports`).offset().top
    // }, 2000);x   
    
    if (!(this.classList.contains("active"))) {

        $("#liveReports").load("reportsHtml.txt");
        $(".form-inline").hide();
        $("a[name='liveReports']").addClass("active");
        $("a[name='home']").removeClass("active");
        $("a[name='about']").removeClass("active");

        console.log($("#home").height());
        console.log($( window ).height());
        
        // debugger;
        // scrollToDiv("liveReports");
        // deleteOtherDivs(this.name);
        
        generatReport();
        // var selectedCoinsArr = JSON.parse(localStorage.getItem("selectedCoins"));
            // if (selectedCoinsArr.length > 0) {
        //     $("#chartContainer").html("");
        //     var uppercaseArr = $.map(selectedCoinsArr, function (c) {
        //         return c.toUpperCase();
        //     });

        //     var chartData = createVariables(uppercaseArr);
        //     var str = uppercaseArr.join(",");
        //     $.getJSON(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${str}&tsyms=USD`, function (dataAPI) {

        //         for (var i = 0; i < chartData.length; i++) {
        //             let currname = chartData[i].name;
        //             chartData[i].yValue = dataAPI[currname].USD;
        //             chartData[i].dataPoints[0].y = chartData[i].yValue;
        //         }
        //     }).always(function () {
        //         drawChart(chartData, str);
        //     });
        // }
    }

}

function generatReport(){
    var selectedCoinsArr = JSON.parse(localStorage.getItem("selectedCoins"));
    if (selectedCoinsArr.length > 0) {
        $("#chartContainer").html("");
        var uppercaseArr = $.map(selectedCoinsArr, function (c) {
            return c.toUpperCase();
        });

        var chartData = createVariables(uppercaseArr);
        var str = uppercaseArr.join(",");
        $.getJSON(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${str}&tsyms=USD`, function (dataAPI) {

            for (var i = 0; i < chartData.length; i++) {
                let currname = chartData[i].name;
                chartData[i].yValue = dataAPI[currname].USD;
                chartData[i].dataPoints[0].y = chartData[i].yValue;
            }
        }).always(function () {
            drawChart(chartData, str);
        });
    }
}

function createVariables(uppercaseArr) {
    var dataArr = [];
    for (var i = 0; i < uppercaseArr.length; ++i) {
        dataArr[i] = {
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00Wh",
            xValueFormatString: "hh:mm:ss TT",
            showInLegend: true,

            name: uppercaseArr[i],
            dataPoints: [{
                x: new Date(),
                y: 0
            }],
            yValue: 0
        };
    }
    return dataArr;
}


function drawChart(chartData, str) {

    var data = chartData;
    var options = {
        title: {
            text: "Selected Coins USD value"
        },
        axisX: {
            title: "chart updates every 2 secs"
        },
        axisY: {
            suffix: "USD",
            includeZero: false
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            fontSize: 22,
            fontColor: "dimGrey",
            itemclick: toggleDataSeries
        },
        data: data
    };

    var chart = $("#chartContainer").CanvasJSChart(options);

    function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }

    var updateInterval = 2000;

    var time = new Date($.now());
    // time.getHours();
    // time.getMinutes();
    // time.getSeconds();
    // time.getMilliseconds();


    function updateChart() {
        time.setTime(time.getTime() + updateInterval);

        for (var i = 0; i < data.length; i++) {
            // pushing the new values
            data[i].dataPoints.push({
                x: time.getTime(),
                y: data[i].yValue
            });
            options.data[i].legendText = `${data[i].name} : ` + data[i].yValue + "USD";
        }
        $("#chartContainer").CanvasJSChart().render();
    }
    // generates first set of dataPoints 
    updateChart();
    setInterval(function () {
        $.getJSON(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${str}&tsyms=USD`, function (dataAPI) {

            for (var i = 0; i < data.length; i++) {
                let currname = data[i].name;
                data[i].yValue = dataAPI[currname].USD;
                data[i].dataPoints[0].y = data[i].yValue;
            }
        }).always(function () {
            updateChart(data);
        });
    }, updateInterval);

}

// ****************************************************************


















// moer info
function MoreInfoBtnAction() {

    if (this.nextElementSibling.className == "collapse") {
        showProgressBar(this, getCoinInfo);
    } else {
        if (($(`#collapse${this.dataset.id}`).children()[1]) != undefined) {
            $(`#collapse${this.dataset.id}`).children()[1].remove();
        }
    }

}

function getCoinInfo(coinBtn) {
    var newInfoDemand = false;
    console.log("coinBtn", coinBtn);

    var requiredInfoId = coinBtn.dataset.id;
    var cuurentCoinInfoArr = JSON.parse(localStorage.getItem("infoRequests"));

    if (cuurentCoinInfoArr.length == 0) {
        getInfoFronAPI(requiredInfoId, coinBtn);
    } else {
        var indexInArray = cuurentCoinInfoArr.findIndex(c => c.id == requiredInfoId);
        if (indexInArray != -1) {
            console.log("found in array in index:", indexInArray);
            newInfoDemand = validateTimestamp(cuurentCoinInfoArr[indexInArray].timeset);
            if (newInfoDemand) {
                cuurentCoinInfoArr.splice(indexInArray, indexInArray + 1);
                localStorage.setItem("infoRequests", JSON.stringify(cuurentCoinInfoArr));

                getInfoFronAPI(requiredInfoId, coinBtn);
            } else {
                console.log("getInfoFromLocalStorage()", cuurentCoinInfoArr[indexInArray]);
                drawInfoDiv(requiredInfoId);
                        }
        } else {
            getInfoFronAPI(requiredInfoId, coinBtn);
        }
    }
}



function validateTimestamp(arrObjTime) {
    var ct = new Date($.now());
    var timestamp = {
        hours: ct.getHours(),
        minutes: ct.getMinutes()
    };
    if (timestamp.hours == arrObjTime.hours) {
        if (timestamp.minutes - arrObjTime.minutes > 2) {
            return true;
        }
    } else if (timestamp.hours > arrObjTime.hours) {
        if (timestamp.minutes < arrObjTime.minutes) {
            if ((60 + timestamp.minutes) - arrObjTime.minutes > 2) {
                return true;
            }
        } else {
            return true;
        }
    }
}



function setNewCoinInfoObj(id, img, timeset, displayInfo) {
    var cuurentCoinInfoArr = JSON.parse(localStorage.getItem("infoRequests"));
    cuurentCoinInfoArr.push(new CoinInfo(id, img, timeset, displayInfo));
    localStorage.setItem("infoRequests", JSON.stringify(cuurentCoinInfoArr));

    console.log(cuurentCoinInfoArr);
}

function drawInfoDiv(requiredInfoId) {
    var coinsArr = JSON.parse(localStorage.getItem("infoRequests"));
    var indx = coinsArr.findIndex(c => c.id == requiredInfoId);
    var newInfoDiv = `
    <div class="card card-body" name="${coinsArr[indx].id}">
        <img src="${coinsArr[indx].img}" alt="" width="50px" height="50px" style="border: black solid">
        <p>price in USD: ${coinsArr[indx].displayInfo.usd}<span>&dollar;</span></p>
        <p>price in EUR: ${coinsArr[indx].displayInfo.eur}<span>&euro;</span></p>
        <p>price in ILS: ${coinsArr[indx].displayInfo.ils}<span>&#8362;</span></p>

    </div>
`
    // $(`.card-body[name="${requiredInfoId}"]`).append(newInfoDiv);

    $(`#collapse${coinsArr[indx].id}`).append(newInfoDiv);

    // $(`#collapse${coinid}`).append()
}

function getInfoFronAPI(requiredInfoId, coinBtn) {
    var jqxhr = $.getJSON(`https://api.coingecko.com/api/v3/coins/${requiredInfoId}`, function (data) {
            var cuurentTime = new Date($.now());
            console.log("cuurentTime", cuurentTime);

            setNewCoinInfoObj(data.id, data.image.small, {
                usd: data.market_data.current_price.usd,
                eur: data.market_data.current_price.eur,
                ils: data.market_data.current_price.ils
            });

            drawInfoDiv(data.id);

            console.log("success");
        })
        .fail(function () {
            console.log("error");
        })
        .always(function () {
            console.log("complete");
        });
}



function showProgressBar(coin, callbackGetCoinInfo) {
    
    var coinID = coin.dataset.id;
    var progressBar = $(`.progress[name="${coinID}PB"]`);
    progressBar.css('display', 'block');

    var progress = 0; // initial value of your progress bar
    var timeout = 5; // number of milliseconds between each frame
    var increment = .5; // increment for each frame
    var maxprogress = 110; // when to leave stop running the animation

    function animate() {
        setTimeout(function () {
            progress += increment;
            if (progress < maxprogress) {
                progressBar.attr('value', progress);
                animate();
            } else {
                progressBar.css('display', 'none');
                callbackGetCoinInfo(coin);
            }
        }, timeout);
    };
    animate();
}

function CoinInfo(id, img, displayInfo) {
    this.id = id;
    this.img = img;
    this.timeset = function () {
        let dt = new Date($.now());
        return {
            hours: dt.getHours(),
            minutes: dt.getMinutes()
        };
    }();
    new Date($.now());
    this.displayInfo = displayInfo;
}