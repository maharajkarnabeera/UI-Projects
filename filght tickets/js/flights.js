$(document).ready(function () {

    //calling the showresults function to show the results according to the given input in previous page
    readFlightsData();


    let tripType = localStorage.getItem("trip");


    //checking the trip type and accordingly enabling the return date.
    if (tripType === "single") {
        $("#return-modify").prop("disabled", true);
        $("#return-modify").val("");

    }
    else {
        $("#return-modify").prop("disabled", false);
    }

    // disabling the return date for single trip and enabling for round trip whenever there is a change.
    $("#single").click(function () {
        $("#return-modify").prop("disabled", true);
        $("#return-modify").val("");
    });
    $("#round").click(function () {
        $("#return-modify").prop("disabled", false);

    });

    //calling the userInputUpdate function whenever there is a click event on search flights button
    $(".btn-search-flights").click(userInputUpdate);


    // function to update the localstorage values
    function userInputUpdate() {
        let trip = $("input[name='trip']:checked").val();
        let from = $("#from").val();
        let to = $("#to").val();
        let departure = $("#departure-modify").val();
        let returnDate = $("#return-modify").val();
        let adult = $("#adult").val();
        let child = $("#child").val();
        let infant = $("#infant").val();
        let travelClass = $("input[name='class']:checked").val();

        localStorage.setItem("trip", trip);
        localStorage.setItem("from", from);
        localStorage.setItem("to", to);
        localStorage.setItem("departure", departure);
        localStorage.setItem("returnDate", returnDate);
        localStorage.setItem("adult", adult);
        localStorage.setItem("child", child);
        localStorage.setItem("infant", infant);
        localStorage.setItem("travelClass", travelClass);

        //uncheck all the checked items in filters
        $('input[name="airline"]:checked').prop('checked', false);


        //validation of from and to location 
        if (from === to) {
            alert("enter different locations");
        }
        else {
            readFlightsData();
        }
    }


    // function to show search results

    function showResults(data) {

        //getting the values of previous form from local storage
        let tripType = localStorage.getItem("trip");
        let classType = localStorage.getItem("travelClass");
        let fromLoc = localStorage.getItem("from");
        let toLoc = localStorage.getItem("to");
        let departureDate = localStorage.getItem("departure");
        let returnDate = localStorage.getItem("returnDate");
        let adultCount = localStorage.getItem("adult");
        let childCount = localStorage.getItem("child");
        let infantCount = localStorage.getItem("infant");

        //setting the values to form inputs
        $("#" + tripType).prop("checked", "true");
        $("#" + classType).prop("checked", "true");
        $("#from").val(fromLoc);
        $("#to").val(toLoc);
        $("#departure-modify").val(departureDate);
        $("#return-modify").val(returnDate);
        $("#adult").val(adultCount);
        $("#child").val(childCount);
        $("#infant").val(infantCount);

        let index; // variable used to identify the class price from the json class array

        if (classType === "economy") {
            index = 0;
        }
        else if (classType === "business") {
            index = 1;
        }
        else {
            index = 2;
        }

        //getting the day of departure and arrival to check the avaliability of flights on those days.
        let dptDate = new Date(departureDate);
        let rtnDate = new Date(returnDate)
        let departureDay = dptDate.getDay();
        let returnDay = rtnDate.getDay();


        //assigning the min value for departure date and return date
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();

        let todayDate = year + '-' + (month = (month + 1 < 10) ? '0' + (month + 1) : month + 1) + '-' + (day = (day < 10) ? '0' + day : day);
        $("#departure-modify").attr("min", todayDate);

        //setting the min value for return date when there is a change in departure date.
        $("#departure-modify").change(
            function () {

                let dptDate = $("#departure-modify").val();
                if (dptDate === '') {
                    $("#return-modify").attr("min", todayDate);
                }
                else {
                    let date = new Date(dptDate);
                    let day = date.getDate();
                    let month = date.getMonth();
                    let year = date.getFullYear();

                    let todayDate = year + '-' + (month = (month + 1 < 10) ? '0' + (month + 1) : month + 1) + '-' + (day = (day + 1 < 10) ? '0' + (day + 1) : day + 1);
                    $("#return-modify").attr("min", todayDate);
                }
            }
        )
        date = dptDate;
        day = date.getDate();
        month = date.getMonth();
        year = date.getFullYear();

        todayDate = year + '-' + (month = (month + 1 < 10) ? '0' + (month + 1) : month + 1) + '-' + (day = (day + 1 < 10) ? '0' + (day + 1) : day + 1);
        $("#return-modify").attr("min", todayDate);


        //array to store search results.
        let searchedFlights = [];
        let allFlightsData = data;


        //filtering data depending on trip type
        if (tripType === "single") {
            for (let i = 0; i < allFlightsData.length; i++) {
                let dataFrom = allFlightsData[i]["fromCity"];
                let dataTo = allFlightsData[i]["toCity"];
                let availableDays = allFlightsData[i]["days"];
                if ((dataFrom === fromLoc.toLowerCase()) && (dataTo === toLoc.toLowerCase()) && (availableDays.includes(departureDay))) {
                    searchedFlights.push(allFlightsData[i]);
                }
            }
        }
        else {
            for (let i = 0; i < allFlightsData.length; i++) {
                let dataFrom = allFlightsData[i]["fromCity"];
                let dataTo = allFlightsData[i]["toCity"];
                let availableDays = allFlightsData[i]["days"];
                if ((dataFrom === fromLoc.toLowerCase()) && (dataTo === toLoc.toLowerCase()) && (availableDays.includes(departureDay)) && (availableDays.includes(returnDay))) {
                    searchedFlights.push(allFlightsData[i]);
                }
            }
        }


        //adding event listener to airline filter
        $(".airline-type").click(function () {
            $(".search-input").val("");
            filterDataByAirline(searchedFlights, index, adultCount, childCount, infantCount, tripType);
        });

        //adding event listener to price range filter
        $("#price").change(function () {
            filterDataByAirline(searchedFlights, index, adultCount, childCount, infantCount, tripType);
        })

        //adding event listener to no of stops filter
        $(".stops-radio-input").click(function () {
            filterDataByAirline(searchedFlights, index, adultCount, childCount, infantCount, tripType);
        })

        //adding event listener to search bar
        $(".search-icon").click(function()
        {
            let searchInput = $(".search-input").val();
            let c=0;// its a counter flag used to check whether given input is available or not.
            searchInput = searchInput.trim();
            searchInput = searchInput.replace(" ",'');
            searchInput = searchInput.toLowerCase();
            $('input[name="airline"]:checked').prop('checked', false);
            for(let i=0;i<data.length;i++)
            {
                if(searchInput === data[i].airline) //if the given input is a valid input then we will show the filtered result
                {
                    c=1;
                    $("#"+searchInput).prop('checked',true);
                    filterDataByAirline(searchedFlights, index, adultCount, childCount, infantCount, tripType); 
                    break;  
                }
            }
            if(c===0) //if counter flag remains same then show all default results.
            {
                alert("airline not available");
                $(".search-input").val("");
                filterDataByAirline(searchedFlights, index, adultCount, childCount, infantCount, tripType); 
            }
        })



        //empty the card-container in order to display search results.
        $(".card-container").empty();

        //calling displayFlights function to display the results.
        displayFlights(searchedFlights, index, adultCount, childCount, infantCount);
    }


    function displayFlights(result, index, adultCount, childCount, infantCount) {

        //validation to check the size of the result array
        if (result.length === 0) {
            $(".card-container").text("no results found"); //displaying "no results found".
        }
        else {
            for (let i = 0; i < result.length; i++) {

                let classPrice = result[i]["class"][index];//price of each seat accoring to the selected class.
                let childPrice = classPrice - (classPrice * (0.1));//calculating the price for children.
                let infantPrice = classPrice - (classPrice * (0.5));//calculating the price for infants.

                //calculating the total price according to the given no.of passengers.
                let totalPrice = (adultCount * classPrice) + (childCount * childPrice) + (infantCount * infantPrice);



                //arrival and departure data.
                let fromListItem = `<li class="card-detail display-flex-column">
                <span>${result[i]["fromCity"]}</span>
                <span>${result[i]["departureTime"]}</span>
                </li>`;
                let toListItem = `<li class="card-detail display-flex-column">
                <span>${result[i]["toCity"]}</span>
                <span>${result[i]["arrivalTime"]}</span>
                </li>`;
                let durationStopDetails = `<li class="card-detail duration-stop-details display-flex-column">
                <span>${result[i]["duration"]}</span>
                <span class="no-of-stops">${result[i]["noOfStops"]} stop</span>
                </li>`;
                
                //changing the price according to trip type and adding return flights arrival and departure data.
                if (tripType === "round") {
                    classPrice *= 2;
                    childPrice *= 2;
                    infantPrice *= 2;
                    totalPrice *= 2;

                    fromListItem = `<li class="card-detail display-flex-column">
                    <span>${result[i]["fromCity"]}</span>
                    <span>${result[i]["departureTime"]}</span>
                    <span>${result[i]["toCity"]}</span>
                    <span>${result[i]["returnDptTime"]}</span>
                    </li>`;

                    toListItem = `<li class="card-detail display-flex-column">
                    <span>${result[i]["toCity"]}</span>
                    <span>${result[i]["arrivalTime"]}</span>
                    <span>${result[i]["fromCity"]}</span>
                    <span>${result[i]["returnArrivalTime"]}</span>
                    </li>`;

                    durationStopDetails = `<li class="card-detail duration-stop-details display-flex-column">
                    <span>${result[i]["duration"]}</span>
                    <span class="no-of-stops">${result[i]["noOfStops"]} stop</span>
                    <span class="no-of-stops for-each-trip">( for each trip )</span>
                     </li>`;
                }


                //creating flight card for obtained result
                const flightCard = `<div class="card-item">
                <ul class="display-flex card-list">
                    <li class="card-detail">
                        <span>${result[i]["airline"]}</span>
                    </li>`+ fromListItem
                    + durationStopDetails
                    + toListItem
                    + `<li class="card-detail card-price display-flex">
                    <span>${totalPrice}</span>
                    <i class="fa-solid fa-circle-info"></i>
                    <div class = " specified-prices display-flex-column">
                        <span>adult (${classPrice}) x (${adultCount})</span>
                        <span>child (${childPrice}) x (${childCount})</span>
                        <span>infant (${infantPrice}) x (${infantCount})</span>
                    </div>
                    </li>
                </ul>
            </div>`;


                $(".card-container").append(flightCard);
            }

            //adding event listeners to price and duration in sortby
            $(".sort-by-price").click(function () {
                sortBy(result, "price", index, adultCount, childCount, infantCount);
            });
            $(".sort-by-duration").click(function () {
                sortBy(result, "duration", index, adultCount, childCount, infantCount);
            });
        }
    }


    //sortBy function sorts the data depending on the key.
    function sortBy(data, type, index, adultCount, childCount, infantCount) {
        let sortedData;

        if (type === "price") {
            sortedData = data.sort(function (a, b) {
                return a.class[index] - b.class[index];
            })
        }
        if (type === "duration") {
            console.log("in duration")
            sortedData = data.sort(function (a, b) {
                return a.durationMin - b.durationMin;
            })
        }
        $(".card-container").empty();
        displayFlights(sortedData, index, adultCount, childCount, infantCount);

    }


    //filter data by airline name
    function filterDataByAirline(data, index, adultCount, childCount, infantCount, tripType) {

        let filteredData = [];
        let airline = [];

        $('input[name="airline"]:checked').each(function () {
            airline.push($(this).val());
        });
        for (let i = 0; i < data.length; i++) {
            if (airline.includes(data[i].airline)) {
                filteredData.push(data[i]);
            }
        }

        if (filteredData.length === 0 && airline.length === 0) {
            filteredData = data;
        }
        filterDataByPrice(filteredData, index, adultCount, childCount, infantCount, tripType);
    }

    //filter data by price
    function filterDataByPrice(data, index, adultCount, childCount, infantCount, tripType) {
        console.log(data)
        let filteredData = [];
        let price = parseInt($("#price").val())
        $(".price-value").text(price)

        if (price === 0) {
            filteredData = data;
        }
        else {
            if (tripType === "single") {
                for (let i = 0; i < data.length; i++) {
                    if (data[i]["class"][index] <= price) {
                        filteredData.push(data[i]);
                    }
                }
            }
            else {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].class[index]*2 <= price) {
                        filteredData.push(data[i]);
                    }
                }
            }
        }
        filterDataByStops(filteredData, index, adultCount, childCount, infantCount)
    }

    //filter data by stops
    function filterDataByStops(data, index, adultCount, childCount, infantCount) {
        let filteredData = [];

        let noOfStops = $('input[name="stops"]:checked').val()

        if (noOfStops === "all") {
            filteredData = data;
        }
        else {
            noOfStops = parseInt(noOfStops);
            for (let i = 0; i < data.length; i++) {
                if (data[i]["noOfStops"] === noOfStops) {
                    filteredData.push(data[i]);
                }
            }
        }
        $(".card-container").empty();
        displayFlights(filteredData, index, adultCount, childCount, infantCount);
    }


    //function to load json data
   async function readFlightsData() {
        $.ajax({
            url: "../js/flightsData.json",
            success: function (result) {
                showResults(result);
            }
        })

    }


    //drop down for filter
    $(".filter-item-header").click(function () {
        let currentState = $(".filter-item-header").find(".fa-solid");

        if (currentState.hasClass("fa-chevron-down")) {
            currentState.toggleClass("fa-chevron-up fa-chevron-down");
            $(".filter-item").css("display", "block");
        }
        else {
            currentState.toggleClass("fa-chevron-up fa-chevron-down");
            $(".filter-item").css("display", "none");
        }
    })

})