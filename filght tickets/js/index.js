$(document).ready(function () {

    // disabling the return date for single trip and enabling for round trip
    $("#single").click(function () {
        $("#return").val("")
        $("#return").prop("disabled", true);
    });
    $("#round").click(function () {
        $("#return").prop("disabled", false);
    });

    $(".btn-search-flights").click(userInputUpdate);


    // function to update the localstorage values
    function userInputUpdate() {
        let trip = $("input[name='trip']:checked").val();
        let from = $("#from").val();
        let to = $("#to").val();
        let departure = $("#departure").val();
        let returnDate = $("#return").val();
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

        if (from === to) {
            alert("enter different locations");
            $(".flight-search-form").attr("action", "#")
        }
        else {
            $(".flight-search-form").attr("action", "../html/flights.html")
        }
    }
    //assigning the min value for departure date and return date

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    let todayDate = year + '-' + (month = (month + 1 < 10) ? '0' + (month + 1) : month + 1) + '-' + (day = (day < 10) ? '0' + day : day);
    console.log(todayDate);

    $("#departure").attr("min", todayDate);

    $("#departure").change(
        function () {

            let dptDate = $("#departure").val();
            if (dptDate === '') {
                $("#return").attr("min", todayDate);
            }
            else {
                let date = new Date(dptDate);
                let day = date.getDate();
                let month = date.getMonth();
                let year = date.getFullYear();

                let todayDate = year + '-' + (month = (month + 1 < 10) ? '0' + (month + 1) : month + 1) + '-' + (day = (day + 1 < 10) ? '0' + (day + 1) : day + 1);
                $("#return").attr("min", todayDate);
            }
        }
    )


})