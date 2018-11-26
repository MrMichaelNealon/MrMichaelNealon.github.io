///////////////////////////////////////////////////////////
//  public/app/config/social-media.js
//


    const   SocialMedia = (function() {

        let _links = [
            {
                "name": "github",
                "icon": "./public/images/icons/github.png",
                "href": "https://github.com/MrMichaelNealon",
                "title": "Visit my Github profile"
            },
            {
                "name": "stackoverflow",
                "icon": "./public/images/icons/stackoverflow.png",
                "href": "https://stackoverflow.com/users/5482045/nunchy",
                "title": "Visit my StackOverflow profile"
            },
            {
                "name": "linkedin",
                "icon": "./public/images/icons/linkedin.png",
                "href": "https://www.linkedin.com/in/michael-nealon-0aa049134/",
                "title": "Visit my LinkedIn profile"
            }
        ];


        let _socialLinkByIndex = function(link_index) {
            if (typeof(link_index) < 0 || link_index >= _links.length)
                return false;
            
            return '\
                <img \
                    title="' + _links[link_index].title + '" \
                    src="' + _links[link_index].icon + '" \
                    id="social-link-' + _links[link_index].name + '" \
                    class="menu-social-link" \
                    width="100%" height="100%" \
                />\
            ';
        };


        let _socialLinks = function(target_el) {
            if (typeof(target_el) !== "string")
                target_el = "menu-social";

            var el = document.getElementById(target_el);
            el.innerHTML = "";

            _links.forEach(function(link, index) {
                el.innerHTML += _socialLinkByIndex(index);
            });
        };


        let _popLink = function(link, duration, _callback) {
            $("#social-link-" + _links[link].name).stop().animate({
                "opacity": "0.75"
            }, duration, "linear", function() {
                if (link == 0)
                    return _callback();
                _popLink((link - 1), duration, _callback);
            });
        }


        let _popLinks = function(duration, _callback) {
            $(".menu-social-link").css({
                "opacity": "0.01",
                "display": "block"
            });

            _popLink((_links.length - 1), duration, _callback);
        };


        let _unpopLink = function(link, duration, _callback) {
            $("#social-link-" + _links[link].name).stop().animate({
                "opacity": "0.01"
            }, duration, "linear", function() {
                $("#social-link-" + _links[link].name).css("display", "none");
                if (link >= (_links.length - 1))
                    return _callback();
                _unpopLink((link + 1), duration, _callback);
            });
        };


        let _unpopLinks = function(duration, _callback) {
            _unpopLink(0, duration, function() {
                _callback();
            });
        };


        let _nav = function(name) {
            _links.forEach(function(link) {
                if (link['name'] == name) {
                    window.open(link['href'], "_blank");
                    return;
                }
            })
        };


        return {
            "socialLinks":          _socialLinks,
            "popLinks":             _popLinks,
            "unpopLinks":           _unpopLinks,
            "nav":                  _nav
        };

    })();

