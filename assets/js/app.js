$(document).ready(function () {
  var api = "EFpmfS0tkulMhfgMKidEgbG0MutwWY6A";
  var categoryArray = ["Movies", "Television", "Music", "Sports", "Geography", "Animals"];
  function printCategories(arr) {
    for (i = 0; i < arr.length; i++) {
      newLi = $("<li>");
      newLi.text(arr[i]);
      newLi.attr("data-array-index", i)
      $("#exploreUl").append(newLi);
    }
  }
  function queryAPI(query) {
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
      query + "&limit=10&api_key=" + api;
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // After data comes back from the request
      .then(function (response) {
        // storing the data from the AJAX request in the results variable
        var results = response.data;
        // write title to HTML
        var titleRow =  '<div class="row px4pc mt-5">';
            titleRow += '<div class="col-12 row-title">';
            titleRow += '<h4>' + query + '</h4>';
            titleRow +=  '</div></div>';
        var sliderSection = $("<section id='" + query + "'>");
            sliderSection.addClass("center slider");
        var fullscreenSection = $("<section class='fullscreen' id='" + query + "FS'>");
        var fssHtml = "<i data-section-id='" + query + "' class='fas fa-times'></i>";
            fssHtml += "<div id='fssMainContent'></div>";
            fullscreenSection.html(fssHtml);

        // Looping through each result item
        for (var i = 0; i < results.length; i++) {
          var newDiv = $("<div>");
          newDiv.addClass("pr-1");
          var newImg = $("<img>");
          newImg.attr("data-still", results[i].images.fixed_height_still.url);
          newImg.attr("data-animated", results[i].images.fixed_height.url);
          var stillSrc = newImg.attr("data-still");
          newImg.attr("src", stillSrc);
          newImg.addClass("newImgs");
          newDiv.append(newImg);
          var overlayDiv = $("<div>");
          overlayDiv.addClass("overlayDiv");
          var width =  results[i].images.fixed_height.width;
          overlayDiv.css({"width": width});
          var title = cleanTitle(results[i].title);
          // console.log(results[i]);  
          var html = "<div class='overlayContent'><h5>" + title + "</h5>";   
          html += "<span class='maturity'>" +  results[i].rating  + "</span>";
          html += "<svg class='down-arrow' data-gif-id='" + results[i].id + "' data-section-id='" + query + "' width='45px' height='15px'><polyline fill='none' stroke='#FFFFFF' stroke-width='1' stroke-miterlimit='10' points='0.846,1.404 21.783,13.537 42.833,1.404 '/></svg>";
          html += "</div>";
          overlayDiv.html(html);          
          newDiv.append(overlayDiv);
          $(sliderSection).prepend(newDiv);
          
        }
        $(sliderSection).slick({          
          infinite: true,
          speed: 300,
          slidesToShow: 1,
          variableWidth: true
        });
        $("#gifWrapper").prepend(fullscreenSection);
        $("#gifWrapper").prepend(sliderSection);
        $("#gifWrapper").prepend(titleRow);
        // $("#" + query + "FS").fadeOut();        
      });
      
  }  
  // remove "GIF" and "By.." from Title
  function cleanTitle(str) {
    if(str.indexOf("by") > 0){
      str = str.substr(0, str.lastIndexOf("by"));
    }          
    str = str.replace(/gif/gi, " ");
    return str;
  }
  // mouse hover effects 
  $(document.body).on('mouseenter', '.overlayDiv', function () {       
    $(this).addClass('transition fadeIn');
    $(this).siblings().addClass('transition');
    newSrc = $(this).siblings().attr("data-animated");
    $(this).siblings().attr("src", newSrc);    
    
  });  
  $(document.body).on('mouseleave', '.overlayDiv', function () {       
    $(this).removeClass('transition fadeIn');
    $(this).siblings().removeClass('transition');
    newSrc = $(this).siblings().attr("data-still");
    $(this).siblings().attr("src", newSrc);        
     
  });
  $(document.body).on('click', '.down-arrow', function () {    
    $(".fullscreen").fadeOut();
    var gifID =  $(this).attr("data-gif-id");      
    var sectionID = $(this).attr("data-section-id");    
    fullscreenQuery(gifID, sectionID);
    $("#" + sectionID + "FS").fadeIn();
  });
  $(document.body).on('click', '.fa-times', function () {           
    var sectionID = $(this).attr("data-section-id");
    $("#" + sectionID + "FS").fadeOut();
  });
  // search button 
  $("#searchButton").on("click", function () {
    var value = $("#searchField").val();
    categoryArray.push(value);
    $("#exploreUl").empty();
    printCategories(categoryArray)
    $("#searchField").val("");
    queryAPI(value);
  });
  // search field Enter
  $("#searchField").on('keypress', function (e) {
    if (e.which == 13) {
      e.preventDefault();
      $("#searchButton").click();
    }
  
  });
  // fullscreen api call 
  function fullscreenQuery(gifID, sectionID) {
    var queryURL = "https://api.giphy.com/v1/gifs/" +
    gifID + "?api_key=" + api;
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // After data comes back from the request
    .then(function (response) { 
      var result = response.data;
      var title = cleanTitle(result.title);
      console.log(result);
      var fssMCHtml = "<div id='fssMCDesc'><h1>" + title +"</h1></div>"
          fssMCHtml += "<div id='fssMCImg'><div id='ImgGradient'></div><img src='" + result.images.original.url+ "'></div>";
      $("#" + sectionID + "FS").find("#fssMainContent").html(fssMCHtml);
    });
    
  }
  // initialize 
  function initCategories() {
    for(i=0;i<categoryArray.length;i++){
      queryAPI(categoryArray[i]);
    }
  }
  initCategories();
  printCategories(categoryArray);    
});
