$("document").ready(function () {

    let counter = 0;
    let wishCount = 0;
    let addCartCount = 0;
    let jsonData;

    const classSelector = {
        "loadMore": ".load-more-button",
        "filterItems": ".filter-item-details",
        "sortByRating": ".js-ratings",
        "sortByPrice": ".js-price",
        "sortByNewLaunches": ".js-new-launches",
        "addCartButton": ".addToCart",
        "highlightItem": "sortby-item-highlight",
        "productContainer": ".mobiles-container",
        "resultsCountText": ".showing-results-line",
        "noMoreResultsText": ".no-more-results",
        "showMoreButton": ".show-more",
        "brandCheckbox": ".brand-checkbox",
        "sortByMethods": ".sortby-list-items"
    };

    if(localStorage.getItem("cartCount")){
        addCartCount=parseInt(localStorage.getItem("cartCount"));
        $(".cart-count").text(addCartCount);

    }

    // ajax call to load json data.
    $.ajax({
        url: "../js/mobile_data.json",
        success: function (result) {
            loadMobiles(result); //to display mobiles.
            filterData(result); // to filter mobiles.
        }
    });


    // adding load more button functionality.
    $(classSelector.loadMore).click(function () { loadMobiles(jsonData) });

    // function to load mobiles.
    function loadMobiles(data) {
        jsonData = data;

        if(jsonData.length>0)
        {
            for (let i = counter; i < counter + 6 && i < data.length; i++) {

                let product = data[i];
    
                // Loop to add rating stars to product
                let avgRating = Math.floor(product.avg_rating);
                let noOfStars = 5;
                let ratingsDiv = ``;
                while (noOfStars > 0) {
                    noOfStars--;
                    if (avgRating > 0) {
                        avgRating--;
                        ratingsDiv += '<i class="fa fa-star pink-color"></i>';
                    }
                    else {
                        ratingsDiv += '<i class="fa fa-star grey-color"></i>';
                    }
                }
    
                //condition to add new and sale values of product
                let newSale = product.status;
                let newSaleValue = ``;
                if (newSale.length === 2) {
                    newSaleValue = `<div class='new-sale'>
                                      <div class='new'>new</div>
                                      <div class='new sale'>sale</div>
                                  </div>`;
                }
                else if (newSale.length === 1 && newSale[0] === 'new') {
                    newSaleValue = `<div class='new-sale'>
                                      <div class='new'>new</div>
                                  </div>`;
                }
                else if (newSale.length === 1 && newSale[0] === 'sale') {
                    newSaleValue = `<div class='new-sale'>
                                      <div class="new sale">sale</div>
                                  </div>`;
                }
    
                //creating mobile item.
                let mobileCard = $("<div>").addClass("mobileCard" + product.id).addClass("mobileCard").attr("tabindex",0);
                mobileCard.append(newSaleValue);
                mobileCard.append(`
                    <div class="heart-container"><i class="fa-regular fa-heart fa-l grey-color"></i></div>
                    <div class="mobile-fig-container"><img src="${product.img_url}" alt="image of mobile" class="mobile-fig"></div>
                    <div class="mobileCard-buttons">
                        <button class="mobileCard-button addToCart">ADD TO CART</button>
                        <button class="mobileCard-button" disabled>VIEW GALLERY</button>
                    </div>
                    <div class="mobile-details">
                        <h2 class="mobile-name">${product.brand + " " + product.model + " (" + product.color + ", " + product.storage + " GB)"}</h2>
                        <div class="rating">${ratingsDiv}<span class="rating-count">${" (" + product.rating_count + ")"}</span></div>
                        <div class="pricing">
                            <span class="final-price">${"$" + product.final_price}</span>
                            <s class="MRP">${"$" + product.MRP}</s>
                            <span class="discount">${product.discount + "%"}</span>
                        </div>
                    </div>`);
    
    
    
                //append mobile-item to mobiles-conatiner
                $(classSelector.productContainer).append(mobileCard);
    
    
                //working of wishlist icon.
                $(".mobileCard" + product.id + " .fa-heart").click(function () {
                    let thisRef = $(this);
                    if (thisRef.hasClass("grey-color")) {
                        wishCount++;
                        thisRef.removeClass("grey-color").removeClass("fa-regular");
                        thisRef.addClass("pink-color").addClass("fa-solid");
                    }
                    else {
                        wishCount--;
                        thisRef.removeClass("pink-color").removeClass("fa-solid");
                        thisRef.addClass("grey-color").addClass("fa-regular");
                    }
                    $(".wishlist-count").text(wishCount);
                })

    
                //showing no.of loaded results in a line.
                $(classSelector.resultsCountText).text("showing results from 1-" + (i + 1) + " out of " + data.length + " results");
            }
            counter += 6;
    
    
            //add to cart count increase or decrease
            $(classSelector.addCartButton).click(function () {
                addCartCount++;
                localStorage.setItem("cartCount",addCartCount);
                $(".cart-count").text(addCartCount);
            })
    
            //hide the more results button when it showed all the results
            if (counter >= data.length) {
                $(classSelector.noMoreResultsText).css("display", "block");
                $(classSelector.showMoreButton).css("display", "none");
            }
            else {
                $(classSelector.noMoreResultsText).css("display", "none");
                $(classSelector.showMoreButton).css("display", "block");
            }

    
            //onclick functions for sorting methods

            $(classSelector.sortByMethods).click(function () {
                let key = $(this).text();
                $(classSelector.sortByMethods).removeClass(classSelector.highlightItem);
                $(this).addClass(classSelector.highlightItem);
                sortByKey(key, jsonData);
            })

        }
        else
        {
            $(classSelector.productContainer).text("no products to display");
            $(classSelector.resultsCountText).text("0 products found");
            $(".show-more").css("display", "none");

        }

    }


    //sorting function
    function sortByKey(key, data) {
        $(".js-sort-methods").css("display","none");
        let sortedData;
        if (key === "Ratings") {
            sortedData = data.sort(function (a, b) {
                return b.avg_rating - a.avg_rating;
            })
        }
        else if (key === "Price low-High") {
            sortedData = data.sort(function (a, b) {
                return a.final_price - b.final_price;
            })
        }
        else if (key === "Newest First") {
            sortedData = data.filter(function (a) {
                return a.status[0] === "new";
            })
            if (sortedData.length < data.length) {
                for (let i = 0; i < data.length; i++) {
                    if (!(sortedData.includes(data[i]))) {
                        sortedData.push(data[i]);
                    }
                }
            }
        }
        $(classSelector.productContainer).empty();
        counter = 0;
        loadMobiles(sortedData);
    }


    //filterData function
    function filterData(data){

        //filter function

        function filterBy(key)
        {

            $(classSelector.sortByMethods).removeClass(classSelector.highlightItem);
            let filteredData=[];
            if(key.length===0)
            {
                filteredData=data;
            }
            else
            {
                for(let i=0; i<data.length; i++ )
                {
                    if(key.includes(data[i].brand))
                    {
                        filteredData.push(data[i]);
                    }
                }
            }

            $(classSelector.productContainer).empty();
            counter=0;
            loadMobiles(filteredData);
        }

        //filterBy function calling on checking or unchecking the brand checkbox 

            let selectedBrands=[];
            $(classSelector.brandCheckbox).change(function(){
                let brandName = $(this).val()
                if(selectedBrands.includes(brandName)){
                    selectedBrands.splice(selectedBrands.indexOf(brandName),1);
                    console.log(brandName)
                }
                else{
                    selectedBrands.push(brandName);
                    console.log(brandName)
                }
                filterBy(selectedBrands);
            });
    }
    



    //accordion show and hide functionality.

    $(classSelector.filterItems).click(function () {
        let thisRef = $(this);
        let currentIconState = thisRef.find(".fa-solid");
        if (currentIconState.hasClass("fa-chevron-down")) {
            currentIconState.toggleClass("fa-chevron-up fa-chevron-down");
            thisRef.next().css("display", "block");
        }
        else {
            currentIconState.toggleClass("fa-chevron-up fa-chevron-down");
            thisRef.next().css("display", "none");
        }
    });


    //display search bar on clicking search icon.
    $(".search-icon").click(function(){
        $(".search-input").toggle();
    });


    //sort and filter button functions in mobile view

    $(".mb-sort-button").click(function(){
        $(".js-sort-methods").toggle();
        $(".js-filter-methods").css("display","none");
    });

    $(".mb-filter-button").click(function(){
        $(".js-filter-methods").toggle();
        $(".js-sort-methods").css("display","none");
    });

    $(".close-icon").click(function(){
        $(".sort-filter-methods").css("display","none");
    });


});