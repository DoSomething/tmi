$(document).ready(function(){
    /**
    *   Global variables.
    */
    var pageHeight = $(window).height();
    var pageWidth = $(window).width();
    var navigationHeight = $("#navigation").outerHeight();

    /**
    *   ON RESIZE, check again
    */
    $(window).resize(function () {
        pageWidth = $(window).width();
        pageHeight = $(window).height();
    });


    /**
    *   ON LOAD
    */

    /* Initialize scroll so if user droped to other part of page then home page. */
    $(window).trigger('scroll');

    /* Fix navigation. */
    $('#navigation').fixedonlater({
        speedDown: 250,
        speedUp: 100
    });

    /* Centralize elements on page. */
    $('.centralized').centralized({
        delay: 1500,
        fadeSpeed: 500
    });

    /* Make embeded videos responsive. */
    $.fn.responsivevideos();

    /* Carousel "Quote slider" initialization. */
    $('#quote-slider').each(function(){
        if($('.item', this).length) {
            $(this).carousel({
                interval: 20000
            });
        }
    });

    /* Scroll spy and scroll filter */
    $('#main-menu').onePageNav({
        currentClass: "active",
        changeHash: false,
        scrollOffset: navigationHeight - 10,
        scrollThreshold: 0.5,
        scrollSpeed: 750,
        filter: "",
        easing: "swing"
     });

    /*
    *  Paralax initialization.
    *  Exclude for mobile.
    */
    if(pageWidth > 980){
        /* Dont user paralax for tablet and mobile devices. */
        $('#page-welcome').parallax("0%", 0.2);
        $('#page-features').parallax("0%", 0.07);
        $('#page-twitter').parallax("0%", 0.1);
    }

    /* Emulate touch on table/mobile touchstart. */
    if(typeof(window.ontouchstart) != 'undefined') {
        var touchElements = [".social-icons a", ".portfolio-items li", ".about-items .item"];

        $.each(touchElements, function (i, val) {
            $(val).each(function(i, obj) {
                $(obj).bind('click', function(e){

                    if($(this).hasClass('clickInNext')){
                        $(this).removeClass('clickInNext');
                    } else {
                        e.preventDefault();
                        e.stopPropagation();

                        $(this).mouseover();
                        $(this).addClass('clickInNext');
                    }
                });
            });
        });
    }

    /**
    *   BLOCK | Navigation
    *
    *   Smooth scroll
    *   Main menu links
    *   Logo click on Welcome page
    */
    $('#page-welcome .logo a').click(function(){
        $('html, body').animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top - navigationHeight + 4
        }, 800);

        /* Fix jumping of navigation. */
        setTimeout(function() {
            $(window).trigger('scroll');
        }, 900);

        return false;
    });

    /**
    *   PAGE | Welcome
    *
    *   Initialize slider for welcome page H1 message.
    */
   $('#welcome-messages ul').bxSlider({
        mode: 'vertical',
        auto: true,
        minSlides: 1,
        responsive: true,
        touchEnabled: true,
        pager: false,
        controls: false,
        useCSS: false,
        pause: 10000
    });

    /**
    *   PAGE | WORK
    *
    *   .plugin-filter - Defines action links.
    *   .plugin-filter-elements - Defines items with li.
    */
    $('.plugin-filter').click(function(){
        return false;
    });
    $('.plugin-filter-elements').mixitup({
        targetSelector: '.mix',
        filterSelector: '.plugin-filter',
        sortSelector: '.sort',
        buttonEvent: 'click',
        effects: ['fade','rotateY'],
        listEffects: null,
        easing: 'smooth',
        layoutMode: 'grid',
        targetDisplayGrid: 'inline-block',
        targetDisplayList: 'block',
        gridClass: '',
        listClass: '',
        transitionSpeed: 600,
        showOnLoad: 'all',
        sortOnLoad: false,
        multiFilter: false,
        filterLogic: 'or',
        resizeContainer: true,
        minHeight: 0,
        failClass: 'fail',
        perspectiveDistance: '3000',
        perspectiveOrigin: '50% 50%',
        animateGridList: true,
        onMixLoad: null,
        onMixStart: null,
        onMixEnd: null
    });

    /**
    *   PAGE | Twitter
    *
    *   Pull latest tweets from user.
    */
    // Create bearer token using the consumer key and secret.
    var consumerKey = "vo79JbIxgNczwP8DD5Ib8ivzX"; // @todo Place your API key here.
    var consumerSecret = "pQAG2Ts6vXSInMMzaAJUBpMuphC93i5T3EChsO0lnaHrNAFFEu"; // @todo Place your API secret here.
    var token = consumerKey + ':' + consumerSecret;
    var tokenEncoded = btoa(token);
    var replaceWithDisplayUrl = function(text, url, displayUrl, expandedUrl) {
        return text.replace(url, '<a href="' + expandedUrl + '">' + displayUrl + '</a>');
    };

    // Once access token is received, we can use it to retrieve tweets from the account.
    var getTweets = function(accessToken) {

        $.ajax({
            type: "get",
            async: true,
            crossDomain: true,
            url: "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=TMI_Agency&count=3",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            success: function(data, status, jqxhr) {
                // @todo Make this mess cleaner
                var tweet0 = data[0].text;
                var tweet1 = data[1].text;
                var tweet2 = data[2].text;

                for (var i = 0; i < data[0].entities.urls.length; i++) {
                    var entityUrl = data[0].entities.urls[i];
                    tweet0 = replaceWithDisplayUrl(tweet0, entityUrl.url, entityUrl.display_url, entityUrl.expanded_url);
                }
                for (var i = 0; i < data[1].entities.urls.length; i++) {
                    var entityUrl = data[1].entities.urls[i];
                    tweet1 = replaceWithDisplayUrl(tweet1, entityUrl.url, entityUrl.display_url, entityUrl.expanded_url);
                }
                for (var i = 0; i < data[2].entities.urls.length; i++) {
                    var entityUrl = data[2].entities.urls[i];
                    tweet2 = replaceWithDisplayUrl(tweet2, entityUrl.url, entityUrl.display_url, entityUrl.expanded_url);
                }

                var list = $('<ul class="tweet_list">');
                list.empty();

                list.append('<li>' + tweet0 + '</li>');
                list.append('<li>' + tweet1 + '</li>');
                list.append('<li>' + tweet2 + '</li>');

                $('#twitterfeed-slider').append(list);

                $('#twitterfeed-slider').tweetCarousel({
                    interval: 7000,
                    pause: "hover"
                });
            }
        });
    };

    // Send request to get access token.
    // @todo If the access token is already saved in a cookie, skip this initial step.
    $.ajax({
        type: "post",
        async: true,
        crossDomain: true,
        url: "https://api.twitter.com/oauth2/token",
        headers: {
            "Authorization": "Basic " + tokenEncoded,
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        data: "grant_type=client_credentials",
        success: function(data, status, jqxhr) {
            if (data && data.token_type === "bearer" && data.access_token) {
                getTweets(data.access_token);
            }
        }
    });
 });


/**
*   Ajax request.
*   Start loading.
*   Append loading notification.
*/
$( document ).ajaxSend( function() {
    /* Show loader. */
    if($(".loading").length == 0) {
        $("body").append('<div class="loading"><div class="progress progress-striped active"><div class="bar"></div></div></div>');
        $(".loading").slideDown();
        $(".loading .progress .bar").delay(300).css("width", "100%");
    }
});

/**
*   Reinitialize Scrollspy after ajax request is completed.
*   Refreshing will recalculate positions of each page in document.
*   Time delay is added to allow ajax loaded content to expand and change height of page.
*/
$( document ).ajaxComplete(function() {
    /* Remove loading section. */
    $(".loading").delay(1000).slideUp(500, function(){
        $(this).remove();
    });

    /* Portfolio details - close. */
    $(".close-portfolio span").click(function(e) {
        $(".portfolio-item-details").delay(500).slideUp(500, function(){
            $(this).remove();
        });

        window.location.hash= "!";
        return false;
    });
});

