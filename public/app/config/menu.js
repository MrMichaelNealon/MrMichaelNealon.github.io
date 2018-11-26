///////////////////////////////////////////////////////////
//  public/app/config/menu.js
//


    const   Menu = (function() {

        let menu_locked = false;

        let _refreshLinks = function() {
            $(".menu-link").css({
                "opacity": "0.75",
                "color": "#FFF"
            });

            $("#menu-link-" + Routes.route()).css({
                "opacity": "0.99",
                "color": "#1E90FF"
            });
        };

        let _showMenu = function(_callback) {
            $("#menu").css({
                "background-color": "rgba(0, 0, 0, 0)",
                "display": "block",
                "opacity": "0.99"
            });

            _refreshLinks();

            SocialMedia.popLinks(150, function() {
                Routes.popLinks(150, function() {
                    if (typeof(_callback) === "function")
                        _callback();
                });
            });
        };


        let _hideMenu = function(_callback) {
            Routes.unpopLinks(150, function() {
                SocialMedia.unpopLinks(150, function() {
                    $("#menu").css({
                        "display": "none"
                    });
                    if (typeof(_callback) === "function")
                        _callback();
                });
            });
        };


        let _init = function() {
            $("#header-menu").css({
                "opacity": "0.75"
            });

            $("#header-menu").on("mouseover", function() {
                $(this).stop().animate({ "opacity": "0.99" }, 500, "linear");
            });
            $("#header-menu").on("mouseout", function() {
                $(this).stop().animate({ "opacity": "0.75" }, 500, "linear");
            });

            $("#header-menu").on("click", function() {
                menu_locked = true;
                _showMenu(function() {
                    menu_locked = false;
                });
            });

            $("#menu").on("mouseleave", function() {
                menu_locked = false;
                _hideMenu(function() {
                    menu_locked =false;
                });
            });

            $(".menu-social-link").on("mouseover", function() {
                if (menu_locked) return;
                $(this).stop().animate({
                    "opacity": "0.99",
                    "background-color": "#1E90FF"
                }, 500, "linear");
            });
            $(".menu-social-link").on("mouseout", function() {
                if (menu_locked) return;
                $(this).stop().animate({
                    "opacity": "0.75",
                    "background-color": "#FFF"
                }, 500, "linear");
            });
            $(".menu-social-link").on("click", function() {
                if (menu_locked) return;
                SocialMedia.nav($(this).attr("id").substr(12));
            });

            $(".menu-link").on("mouseover", function() {
                if (menu_locked) return;
                if ($(this).attr("id") == "menu-link-" + Routes.route())
                    return;
                $(this).stop().animate({
                    "opacity": "0.99",
                    "color": "#1E90FF"
                }, 500, "linear");
            });
            $(".menu-link").on("mouseout", function() {
                if (menu_locked) return;
                if ($(this).attr("id") == "menu-link-" + Routes.route())
                    return;
                $(this).stop().animate({
                    "opacity": "0.75",
                    "color": "#FFF"
                }, 500, "linear");
            });
            $(".menu-link").on("click", function() {
    //            if ($(this).attr("id").substr(10) !== "blog") {
    //            if ($(this).attr("id") == "menu-link-" + Routes.route())
    //                return;
    //            }
                if (menu_locked) return;
                    menu_locked = true;
                window.history.pushState(null, null, Routes.parseUrl().address + "?" + $(this).attr("id").substr(10));
                Routes.nav($(this).attr("id").substr(10), function() {
                    _refreshLinks();
                    menu_locked = false;
                    _hideMenu();
                });
            });
        };


        return {
            "init":         _init
        };

    })();
