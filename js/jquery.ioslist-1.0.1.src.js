(function($) {
    var defaults = {
        groupContainer: "dl",
        groupHeader: "dt",
        stationaryHeaderClass: "fakeHeader",
        stationaryHeaderElement: "h2"
    };
    methods = {};
    _methods = {
        init: function(options) {
            var $listWrapper;
            var $fakeHeader;
            var $listContainer;
            var elems = [];
            var options = $.extend(defaults, options);
            // var isIOS = navigator.userAgent.match(/ipad|iphone|ipod/gi) ? true : false;

            $listContainer = $(this);
            // $listContainer.wrap("<div class='listWrapper' data-ios='" + isIOS + "'></div>");
            $listContainer.wrap("<div class='listWrapper'></div>");
            $listWrapper = $listContainer.parent();
            $listWrapper.prepend("<" + options.stationaryHeaderElement + "/>");
            $fakeHeader = $listWrapper.find(options.stationaryHeaderElement).eq(0);
            $fakeHeader.addClass(options.stationaryHeaderClass);



            $listContainer.find(options.groupContainer).each(function(index, elem) {
                var $tmp_list = $(this);
                var $tmp_header = $tmp_list.find(options.groupHeader).eq(0);

                    // keep in mind this doesn't include the padding-top
                var $tmp_listHeight = $tmp_list.height();
                var $tmp_listTop = $tmp_list.offset().top;

                elems.push({
                    "list": $tmp_list,
                    "header": $tmp_header,
                    "listHeight": $tmp_listHeight,
                    "headerText": $tmp_header.text(),
                    "headerHeight": $tmp_header.outerHeight(),
                    "listTop": $tmp_listTop,
                    "listBottom": $tmp_listHeight + $tmp_listTop
                });
            });

            $fakeHeader.text(elems[0].headerText);

            $(window).scroll(function() {
                testPosition();
            });

            function testPosition() {

                if(currentTop >= containerTop && currentTop < containerBottom) {
	                var currentTop = $(window).scrollTop();
	                var topElement;
	                var offscreenElement;
	                var elementRelativeBottom;
	                var i = 0;
	                var elementTop;
	                var elementHeight;
	                var headerHeight;
	                var containerTop = $listContainer.offset().top;
	                var containerBottom = containerTop + $listContainer.height();

                    // while the element's top is passed
                    while ((elems[i].list.offset().top - currentTop) <= 0) {

                        topElement = elems[i];
                        elementTop = topElement.list.offset().top;
                        elementHeight = topElement.list.height();
                        headerHeight = topElement.header.outerHeight();

                        elementRelativeBottom = (elementHeight + elementTop) - currentTop;

                        if (elementRelativeBottom < -headerHeight) {
                            offscreenElement = topElement;
                        }
                        i++;
                        if (i >= elems.length) {
                            break;
                        }
                    }

                    // hide fake header at the end of each list, within the bottom [headerHeight]px
                    if (elementRelativeBottom < 0 && elementRelativeBottom > -headerHeight) {
                        $fakeHeader.removeClass("show");
                        topElement.list.addClass("animated");
                    } else {
                        $fakeHeader.addClass("show");
                        if (topElement) {
                            topElement.list.removeClass("animated");
                        }
                    }

                    if (topElement) {
                        $fakeHeader.text(topElement.headerText);
                    }

                } else {
                    $fakeHeader.removeClass("show");

                }

                
            }
        }
    };

    $.fn.ioslist = function(arg) {
        if (methods[arg]) {
            return methods[arg].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof arg === "object" || !arg) {
            return $.each(this, function() {
                _methods.init.call(this, arg);
            });
        } else {
            $.error("Method " + method + " does not exist on jquery.ioslist");
        }
    };
})(jQuery);
