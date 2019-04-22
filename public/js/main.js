AOS.init({
    duration: 800,
    easing: 'slide'
});

(function ($) {
    var $window = $(window);
    var column = 0;
    var pagingStart = 0;
    var pagingEnd = 13;
    const host = "localhost";
    /*List data content*/
    var listElm = document.querySelector('.home_blog_inner');
    "use strict";

    /* Application*/
    function getData(pagingStart, pagingEnd) {
        var animalApi = "http://" + host + ":8080/api/getCat";
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: animalApi,
            dataType: 'json',
            data: {pagingStart: pagingStart, pagingEnd: pagingEnd},
            'success': function (response) {
                column = response[0].SIZE_DATA;
                let data = null;
                for (var i = 1; i < 13; i++) {
                    data = {
                        idImage: response[i].ID_DATA_ANIMAL,
                        linkData: response[i].LINK_DATA_ANIMAL,
                        typeData: response[i].TYPE_DATA,
                        thumbailVideo: response[i].THUMBAIL_VIDEO,
                        caption: response[i].CAPTION,
                        isMultiImage: response[i].IS_MULTI_IMAGES
                    };
                    genData(data, i);
                }

            },
            'error': function () {
                alert("Error");
            }
        });


    };

    async function genData(data, index) {
        // appen data
        var element = null;
        if (data.typeData == 2) {
            //dynamically add an image and set its attribute
            element = document.createElement('video');
            element.classList = "img-fluid";
            element.poster = data.thumbailVideo;
            element.preload = "auto";
            element.loop = "loop";
            element.muted = "muted";


            var source = document.createElement('source');
            source.src = data.linkData;
            source.type = "video/mp4";
            element.appendChild(source);

        }
        else {
            if (data.isMultiImage == 0) {
                //dynamically add an image and set its attribute
                element = document.createElement("img");
                element.classList = "img-fluid";
                element.src = data.linkData;
            }
            else {
                //call ajax to load multidata image
                var animalApi = "http://" + host + ":8080/api/getMultiImage/" + data.idImage;
                await $.ajax({
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    url: animalApi,
                    dataType: 'json',
                    data: {pagingStart: pagingStart, pagingEnd: pagingEnd},
                    'success': function (response) {
                        element = document.createElement('div');
                        element.id = "wrapper";
                        var ul = document.createElement('ul');
                        ul.id = 'slideContainer';
                        response.forEach((value) => {
                            var li = document.createElement('li');
                            var img = document.createElement('img');
                            img.src = value.URL_DATA;
                            img.classList = "img-fluid";
                            li.appendChild(img);
                            ul.appendChild(li);

                        });
                        element.appendChild(ul);


                    },
                    'error': function () {
                        alert("Error");
                    }
                });
                //


            }
        }
        var dataContent = document.createElement('div');
        dataContent.classList = "col-lg-6";
        var dataContentInner = document.createElement('div');
        dataContentInner.classList.add("h_blog_img", "ftco-animate", "fadeInUp", "ftco-animated");
        dataContentInner.appendChild(element);
        dataContent.appendChild(dataContentInner);


        var dataContentCaption = document.createElement('div');
        dataContentCaption.classList = "col-lg-6";
        var dataContentInnerCaption = document.createElement('div');
        dataContentInnerCaption.classList.add("text", "text-2", "p-4");
        var h3Element = document.createElement('h3');
        h3Element.classList = "mb-2";
        h3Element.innerText = data.caption;
        dataContentInnerCaption.appendChild(h3Element);

        /*add bộ đếm reation*/
        var divReaction = document.createElement('div');
        divReaction.classList = "abj";
        var ulReaction = document.createElement('ul');
        /*-----Like*/
        var liReaction = document.createElement('li');
        liReaction.classList.add("reaction_item", data.idImage);
        var imgReaction = document.createElement('img');
        imgReaction.src = "../images/emoji/reactions_like_small.png";
        var spanReaction = document.createElement('span');
        spanReaction.textContent = " 100+";
        liReaction.appendChild(imgReaction);
        liReaction.appendChild(spanReaction);
        ulReaction.appendChild(liReaction);
        /*-----Love*/
        var liReaction = document.createElement('li');
        liReaction.classList.add("reaction_item", data.idImage);
        var imgReaction = document.createElement('img');
        imgReaction.src = "../images/emoji/reactions_love_small.png";
        var spanReaction = document.createElement('span');
        spanReaction.textContent = " 100+";
        liReaction.appendChild(imgReaction);
        liReaction.appendChild(spanReaction);
        ulReaction.appendChild(liReaction);
        /*-----Haha*/
        var liReaction = document.createElement('li');
        liReaction.classList.add("reaction_item", data.idImage);
        var imgReaction = document.createElement('img');
        imgReaction.src = "../images/emoji/reactions_haha_small.png";
        var spanReaction = document.createElement('span');
        spanReaction.textContent = " 100+";
        liReaction.appendChild(imgReaction);
        liReaction.appendChild(spanReaction);
        ulReaction.appendChild(liReaction);

        divReaction.appendChild(ulReaction);
        dataContentInnerCaption.appendChild(divReaction);
        /*---------*/
        /*add reaction emoji*/
        /*div*/
        var dk1Div = document.createElement('div');
        dk1Div.classList = "dkl";
        /*ul*/
        var ulmt3 = document.createElement('ul');
        ulmt3.classList.add("ftco-social", "mt-3");
        /*li*/
        var limt3 = document.createElement('li');
        limt3.classList.add("ftco-animate", "fadeInUp", "ftco-animated", "like-btn");

        /*div*/
        var divmt3 = document.createElement('div');

        var btnReaction = document.createElement('span');
        btnReaction.id = "btnLike_" + data.idImage;
        btnReaction.classList.add("main_btn2", "icon-heart-o");
        var ul = document.createElement('ul');
        ul.classList = "reactions-box";
        // li like
        var liLike = document.createElement('li');
        liLike.classList.add("reaction", "reaction-like", data.idImage);
        var dataRactionAttr = document.createAttribute("data-reaction");
        dataRactionAttr.value = "Like";

        liLike.setAttributeNode(dataRactionAttr);

        ul.appendChild(liLike);
        //li love
        var lilove = document.createElement('li');
        lilove.classList.add("reaction", "reaction-love", data.idImage);
        var dataRactionAttr = document.createAttribute("data-reaction");
        dataRactionAttr.value = "Love";


        lilove.setAttributeNode(dataRactionAttr);

        ul.appendChild(lilove);
        //li Haha
        var liHaha = document.createElement('li');
        liHaha.classList.add("reaction", "reaction-haha", data.idImage);
        var dataRactionAttr = document.createAttribute("data-reaction");
        dataRactionAttr.value = "Haha";
        liHaha.setAttributeNode(dataRactionAttr);

        ul.appendChild(liHaha);
        //li Wow
        var liWow = document.createElement('li');
        liWow.classList.add("reaction", "reaction-wow", data.idImage);
        var dataRactionAttr = document.createAttribute("data-reaction");
        dataRactionAttr.value = "Wow";
        liWow.setAttributeNode(dataRactionAttr);

        ul.appendChild(liWow);
        //li Sad
        var liSad = document.createElement('li');
        liSad.classList.add("reaction", "reaction-sad", data.idImage);
        var dataRactionAttr = document.createAttribute("data-reaction");
        dataRactionAttr.value = "Sad";
        liSad.setAttributeNode(dataRactionAttr);

        ul.appendChild(liSad);
        //li Angry
        var liAngry = document.createElement('li');
        liAngry.classList.add("reaction", "reaction-angry", data.idImage);
        var dataRactionAttr = document.createAttribute("data-reaction");
        dataRactionAttr.value = "Angry";


        liAngry.setAttributeNode(dataRactionAttr);

        ul.appendChild(liAngry);

        btnReaction.appendChild(ul);
        divmt3.appendChild(btnReaction);
        limt3.appendChild(divmt3);

        /*li2*/
        var li2 = document.createElement('li');
        li2.classList.add("ftco-animate", "fadeInUp", "ftco-animated");
        var ali2 = document.createElement('a');
        var urlPost = "http://" + host + ":8080/post/"+data.idImage;
        ali2.setAttribute('href', urlPost);
        var spanLi2 = document.createElement('span');
        spanLi2.classList = "icon-mode_comment";
        ali2.appendChild(spanLi2);
        li2.appendChild(ali2);
        /*end li2*/
        /*li3*/
        var li3 = document.createElement('li');
        li3.classList.add("ftco-animate", "fadeInUp", "ftco-animated");
        var ali3 = document.createElement('a');
        var urlPost = "http://" + host + ":8080/post/"+data.idImage;
        ali3.setAttribute('href', urlPost);
        var spanLi3 = document.createElement('span');
        spanLi3.classList = "icon-instagram";
        ali3.appendChild(spanLi3);
        li3.appendChild(ali3);
        /*end li3*/
        ulmt3.appendChild(limt3);
        ulmt3.appendChild(li2);
        ulmt3.appendChild(li3);
        /*root*/
        dk1Div.appendChild(ulmt3);




        dataContentInnerCaption.appendChild(dk1Div);

        /*------end*/


        dataContentCaption.appendChild(dataContentInnerCaption);

        var dataBlogItem = document.createElement('div');
        dataBlogItem.classList.add("row", "h_blog_item", data.idImage);
        dataBlogItem.appendChild(dataContent)
        dataBlogItem.appendChild(dataContentCaption);


        listElm.appendChild(dataBlogItem);
        addListenerEmoji(data.idImage);


        /*function to load multi images*/
        /*      if (data.isMultiImage == 1) {
                  var swipey = {
                      slideContainer: null, //<ul> element object that holds the image slides
                      wrapper: null, //meant for masking/clipping
                      slides: null, //array of all slides i.e <li> elements
                      distanceX: 0, //distance moved in X direction i.e left or right
                      startX: 0, //registers the initial touch co-ordinate
                      preferredWidth: 0, //dynamic variable to set width
                      preferredHeight: 0, //dynamic variable to set height
                      direction: "", //direction of movement
                      timer: null, //timer that set starts when touch starts
                      timerCounter: 0, //counter variable for timer
                      isTouchStart: false, //boolen to chk whether touch has started
                      maxDistance: 0, //maximum distance in X direction that slide container can move
                      currentDistance: 0, //current distance moved by slide container through translate

                      initSwipey: function () {
                          //scroll the window up to hide the address bar of the browser.
                          window.setTimeout(function () {
                              window.scrollTo(0, 1);
                          }, 100);
                          //get all the instances of the HTML elements
                          swipey.wrapper = document.getElementById("wrapper");
                          swipey.slideContainer = document.getElementById("slideContainer");
                          swipey.slides = slideContainer.getElementsByTagName("li");

                          //for iPhone, the width and height
                          swipey.preferredWidth = 376;
                          swipey.preferredHeight = 470; //510 for android
                          //setting the width and height to our wrapper with overflow = hidden
                          swipey.wrapper.style.width = swipey.preferredWidth + "px";
                          swipey.wrapper.style.height = swipey.preferredHeight + "px";
                          //display the <ul> container now
                          swipey.slideContainer.style.display = "block";
                          //setting the width to our <ul> element which holds all the <li> elements
                          swipey.slideContainer.style.width = swipey.slides.length * swipey.preferredWidth + "px";
                          swipey.slideContainer.style.height = swipey.preferredHeight + "px";
                          //setting width and height for <li> elements - the slides
                          for (var i = 0; i < swipey.slides.length; i++) {
                              swipey.slides[i].style.width = swipey.preferredWidth + "px";
                              swipey.slides[i].style.height = swipey.preferredHeight + "px";
                          }
                          //calculating the max distance of travel for Slide Container i.e <ul> element
                          swipey.maxDistance = swipey.slides.length * swipey.preferredWidth;
                          //initialize and assign the touch events
                          swipey.initEvents();
                      },
                      initEvents: function () {
                          //registering touch events to the wrapper
                          swipey.wrapper.addEventListener("touchstart", swipey.startHandler, false);
                          swipey.wrapper.addEventListener("touchmove", swipey.moveHandler, false);
                          swipey.wrapper.addEventListener("touchend", swipey.endHandler, false);
                      },
                      //funciton called when touch start event is fired i.e finger is pressed on the screen
                      startHandler: function (event) {
                          //stores the starting X co-ordinate when finger touches the device screen
                          swipey.startX = event.touches[0].pageX; //.changedTouches[0]
                          //timer is set on
                          swipey.timer = setInterval(function () {
                              swipey.timerCounter++;
                          }, 10);
                          swipey.isTouchStart = true;
                          event.preventDefault(); //prevents the window from scrolling.
                      },
                      //funciton called when touch move event is fired i.e finger is dragged over the screen
                      moveHandler: function (event) {
                          if (swipey.isTouchStart) {
                              swipey.distanceX = event.touches[0].pageX - swipey.startX;
                              //move the slide container along with the movement of the finger
                              swipey.slideContainer.style.webkitTransform = "translate3d(" + (swipey.distanceX + swipey.currentDistance) + "px, 0,0)";
                          }
                      },
                      //funciton called when touch end event is fired i.e finger is released from screen
                      endHandler: function (event) {
                          clearInterval(swipey.timer); //timer is stopped
                          if (swipey.distanceX > 0) {
                              swipey.direction = "right";
                          }
                          if (swipey.distanceX < 0) {
                              swipey.direction = "left";
                          }
                          //the following conditions have been discussed in details
                          if ((swipey.direction == "right" && swipey.currentDistance == 0) || (swipey.direction == "left" && swipey.currentDistance == -(swipey.maxDistance - swipey.preferredWidth))) {
                              swipey.comeBack();
                          }
                          else if (swipey.timerCounter < 30 && swipey.distanceX > 10) {
                              swipey.moveRight();
                          }
                          else if (swipey.timerCounter < 30 && swipey.distanceX < -10) {
                              swipey.moveLeft();
                          }
                          else if (swipey.distanceX <= -(swipey.preferredWidth / 2)) { //-160
                              swipey.moveLeft();
                          }
                          else if (swipey.distanceX >= (swipey.preferredWidth / 2)) { //160
                              swipey.moveRight();
                          }
                          else {
                              swipey.comeBack();
                          }

                          swipey.timerCounter = 0; //reset timerCounter
                          swipey.isTouchStart = false; //reset the boolean var
                          swipey.distanceX = 0; //reset the distance moved for next iteration
                      },
                      moveLeft: function () {
                          swipey.currentDistance += -swipey.preferredWidth;
                          swipey.slideContainer.style.webkitTransitionDuration = 300 + "ms";
                          //using CSS3 transformations - translate3d function for movement
                          swipey.slideContainer.style.webkitTransform = "translate3d(" + swipey.currentDistance + "px, 0,0)";
                      },
                      moveRight: function () {
                          swipey.currentDistance += swipey.preferredWidth;
                          swipey.slideContainer.style.webkitTransitionDuration = 300 + "ms";
                          swipey.slideContainer.style.webkitTransform = "translate3d(" + swipey.currentDistance + "px, 0,0)";
                      },
                      comeBack: function () {
                          swipey.slideContainer.style.webkitTransitionDuration = 250 + "ms";
                          swipey.slideContainer.style.webkitTransitionTimingFunction = "ease-out";
                          swipey.slideContainer.style.webkitTransform = "translate3d(" + swipey.currentDistance + "px, 0,0)";
                      }
                  }; //end of swipey object
                  //expose to global window object
                  window.swipeyObj = swipey;
                  swipeyObj.initSwipey();
              }*/

        /*---*/


    }

    function genCaption(caption) {
        let pointToStartCaption2 = 0;
        var h4Content = "";
        let dataCaption = caption;
        let check = 0;
        for (var i = 0; i < dataCaption.length; i++) {
            if (dataCaption[i] == " ") {
                check++;
            }
            if (check == 2) {
                break;
            }
            pointToStartCaption2++;
            h4Content = h4Content + dataCaption[i];
        }
        return h4Content;
    }

    function pickReaction(indexReaction, idImage) {
        var imgReaction = $("#btnLike_" + idImage);
        switch (indexReaction) {

            case "Haha" : {
                imgReaction.css('background-image', 'url("../images/emoji/reactions_haha.png")');
                break;
            }
            case "Like" : {
                imgReaction.css('background-image', 'url("../images/emoji/reactions_like.png")');
                break;
            }
            case "Love" : {
                imgReaction.css('background-image', 'url("../images/emoji/reactions_love.png")');

                break;
            }
            case "Wow" : {
                imgReaction.css('background-image', 'url("../images/emoji/reactions_wow.png")');

                break;
            }
            case "Angry" : {
                imgReaction.css('background-image', 'url("../images/emoji/reactions_angry.png")');

                break;
            }
            case "Sad" : {
                imgReaction.css('background-image', 'url("../images/emoji/reactions_sad.png")');
                break;
            }

        }
    }


    /*Load more function*/


// Add 20 items.
    var nextItem = 1;
    var loadMore = function () {
        pagingStart = pagingEnd;
        pagingEnd = pagingEnd + 13;
        getData(pagingStart, pagingEnd);
    }

// Detect when scrolled to bottom.

    window.addEventListener('scroll', function () {
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            loadMore();
        }

    });

// Initially load some items.
    loadMore();
    /*-----End of load more function*/
    /*Play video when scroll*/
    /*Play video when scroll*/
    var videos = document.getElementsByTagName("video"), fraction = 0.8;

    function checkScroll() {
        //play when video is visibles
        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];
            var x = 0,
                y = 0,
                w = video.offsetWidth,
                h = video.offsetHeight,
                r, //right
                b, //bottom
                visibleX, visibleY, visible,
                parent;

            parent = video;
            while (parent && parent !== document.body) {
                x += parent.offsetLeft;
                y += parent.offsetTop;
                parent = parent.offsetParent;
            }

            r = x + w;
            b = y + h;

            visibleX = Math.max(0, Math.min(w, window.pageXOffset + window.innerWidth - x, r - window.pageXOffset));
            visibleY = Math.max(0, Math.min(h, window.pageYOffset + window.innerHeight - y, b - window.pageYOffset));

            visible = visibleX * visibleY / (w * h);

            if (visible > fraction) {
                video.play();
            } else {
                video.pause();
            }
        }

    }


    window.addEventListener('scroll', checkScroll, false);
    window.addEventListener('resize', checkScroll, false);

    //check at least once so you don't have to wait for scrolling for the video to start
    window.addEventListener('load', checkScroll, false);


    /*-------------------------*/
    /*----*/

    /*Emoji function*/

    function addListenerEmoji(idImage) {
        $("li." + idImage).on("click", function () {   // like click
            var data_reaction = $(this).attr("data-reaction"); // collecting unique identifier
            // var captionDiv = $(this).attr("data-post"); // collecting unique identifier
            // var reactionDiv = $(this)[0].lastElementChild.lastElementChild.childNodes[1].firstElementChild.childNodes[0]; // child bộ đếm reaction
            pickReaction(data_reaction, idImage);

        });

    }

    /*------------------*/
    /*--End of application--*/
    $(window).stellar({
        responsive: true,
        parallaxBackgrounds: true,
        parallaxElements: true,
        horizontalScrolling: false,
        hideDistantElements: false,
        scrollProperty: 'scroll'
    });


    var fullHeight = function () {

        $('.js-fullheight').css('height', $(window).height());
        $(window).resize(function () {
            $('.js-fullheight').css('height', $(window).height());
        });

    };
    fullHeight();

    // loader
    var loader = function () {
        setTimeout(function () {
            if ($('#ftco-loader').length > 0) {
                $('#ftco-loader').removeClass('show');
            }
        }, 1);
    };
    loader();

    // Scrollax
    $.Scrollax();


    var burgerMenu = function () {

        $('.js-colorlib-nav-toggle').on('click', function (event) {
            event.preventDefault();
            var $this = $(this);

            if ($('body').hasClass('offcanvas')) {
                $this.removeClass('active');
                $('body').removeClass('offcanvas');
            } else {
                $this.addClass('active');
                $('body').addClass('offcanvas');
            }
        });
    };
    burgerMenu();

    // Click outside of offcanvass
    var mobileMenuOutsideClick = function () {

        $(document).click(function (e) {
            var container = $("#colorlib-aside, .js-colorlib-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {

                if ($('body').hasClass('offcanvas')) {

                    $('body').removeClass('offcanvas');
                    $('.js-colorlib-nav-toggle').removeClass('active');

                }

            }
        });

        $(window).scroll(function () {
            if ($('body').hasClass('offcanvas')) {

                $('body').removeClass('offcanvas');
                $('.js-colorlib-nav-toggle').removeClass('active');

            }
        });

    };
    mobileMenuOutsideClick();

    var carousel = function () {
        $('.home-slider').owlCarousel({
            loop: true,
            autoplay: true,
            margin: 0,
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            nav: false,
            autoplayHoverPause: false,
            items: 1,
            navText: ["<span class='ion-md-arrow-back'></span>", "<span class='ion-chevron-right'></span>"],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 1
                },
                1000: {
                    items: 1
                }
            }
        });

        $('.author-slider').owlCarousel({
            autoplay: true,
            loop: true,
            items: 1,
            margin: 30,
            stagePadding: 0,
            nav: true,
            dots: true,
            navText: ['<span class="ion-ios-arrow-back">', '<span class="ion-ios-arrow-forward">'],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 1
                },
                1000: {
                    items: 1
                }
            }
        });

    };
    carousel();


    var contentWayPoint = function () {
        var i = 0;
        $('.ftco-animate').waypoint(function (direction) {

            if (direction === 'down' && !$(this.element).hasClass('ftco-animated')) {

                i++;

                $(this.element).addClass('item-animate');
                setTimeout(function () {

                    $('body .ftco-animate.item-animate').each(function (k) {
                        var el = $(this);
                        setTimeout(function () {
                            var effect = el.data('animate-effect');
                            if (effect === 'fadeIn') {
                                el.addClass('fadeIn ftco-animated');
                            } else if (effect === 'fadeInLeft') {
                                el.addClass('fadeInLeft ftco-animated');
                            } else if (effect === 'fadeInRight') {
                                el.addClass('fadeInRight ftco-animated');
                            } else {
                                el.addClass('fadeInUp ftco-animated');
                            }
                            el.removeClass('item-animate');
                        }, k * 50, 'easeInOutExpo');
                    });

                }, 100);

            }

        }, {offset: '95%'});
    };
    contentWayPoint();

    var counter = function () {

        $('#section-counter').waypoint(function (direction) {

            if (direction === 'down' && !$(this.element).hasClass('ftco-animated')) {

                var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
                $('.number').each(function () {
                    var $this = $(this),
                        num = $this.data('number');
                    console.log(num);
                    $this.animateNumber(
                        {
                            number: num,
                            numberStep: comma_separator_number_step
                        }, 7000
                    );
                });

            }

        }, {offset: '95%'});

    }
    counter();


    // magnific popup
    $('.image-popup').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: false,
        fixedContentPos: true,
        // mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
        },
        image: {
            verticalFit: true
        },
        zoom: {
            enabled: true,
            duration: 300 // don't foget to change the duration also in CSS
        }
    });

    $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,

        fixedContentPos: false
    });
    /*Button comment*/
    var input = document.querySelector('.search-form');
    var search = document.querySelector('input');
    var button = document.querySelector('button');
    button.addEventListener('click', function (e) {
        e.preventDefault();
        input.classList.toggle('active');
    })
    search.addEventListener('focus', function () {
        input.classList.add('focus');
    })

    search.addEventListener('blur', function () {
        search.value.length != 0 ? input.classList.add('focus') : input.classList.remove('focus');
    })


})(jQuery);

