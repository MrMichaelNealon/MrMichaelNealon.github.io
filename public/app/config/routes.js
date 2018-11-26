///////////////////////////////////////////////////////////
//  public/app/config/routes.js
//


    const   Routes = (function() {

        var _route = "home";

        let _links = [
            {
                "name": "home",
                "route": "/home",
                "href": "./public/pages/home.html",
                "title": "Go home",
                "target": "content"
            },
            {
                "name": "projects",
                "route": "/projects",
                "href": "./public/pages/projects.html",
                "title": "My projects",
                "target": "content"
            },
            {
                "name": "blog",
                "route": "/blog",
                "href": "./public/pages/blog.html",
                "title": "View the blawg",
                "target": "content"
            },
            {
                "name": "contact",
                "route": "/contact",
                "href": "./public/pages/contact.html",
                "title": "Get in touch",
                "target": "content"
            }
        ];

        let page404 = {
            "name": "page404",
            "route": "/page404",
            "href": "./public/pages/404.html",
            "title": "",
            "target": "content"
        };


        let _navLink = function(link) {
            if (link < 0 || link >= _links.length)
                return false;
        
            return '\
                <div \
                    id="menu-link-' + _links[link].name + '" \
                    class="menu-link" \
                    title="' + _links[link].title + '" \
                >\
                    ' + _links[link].name + '\
                </div>\
            ';
        };

        let _navLinks = function(target_el) {
            if (typeof(target_el) !== "string")
                target_el = "menu-links";

            var el = document.getElementById(target_el);

            _links.map(function(link, index) {
                el.innerHTML += _navLink(index);
            });
        };        
        
        
        let _popLink = function(link, duration, _callback) {
            $("#menu-link-" + _links[link].name).stop().animate({
                "opacity": "0.75"
            }, duration, "linear", function() {
                if (link >= (_links.length - 1))
                    return _callback();
                _popLink((link + 1), duration, _callback);
            });
        }


        let _popLinks = function(duration, _callback) {
            $("#menu-header").css({
                "opacity": "0.01",
                "display": "block"
            });

            $("#menu-header").stop().animate({
                "opacity": "0.99"
            }, duration, "linear", function() {
                $(".menu-link").css({
                    "opacity": "0.01",
                    "display": "block"
                });

                $("#menu").stop().animate({
                    "background-color": "rgba(0, 0, 0, 0.80)"
                }, (duration * _links.length), "linear");
                
                _popLink(0, duration, _callback);
            });
        };


        let _unpopLink = function(link, duration, _callback) {
            $("#menu-link-" + _links[link].name).stop().animate({
                "opacity": "0.01"
            }, duration, "linear", function() {
                if (link <= 0)
                    return _callback();
                _unpopLink((link - 1), duration, _callback);
            })
        };


        let _unpopLinks = function(duration, _callback) {
            var link = (_links.length - 1);
      
            $("#menu").stop().animate({
                "background-color": "rgba(0, 0, 0, 0)"
            }, (duration * _links.length), "linear");

            _unpopLink(link, duration, function() {
                $(".menu-link").css("display", "none");
                
                $("#menu-header").stop().animate({
                    "opacity": "0.01"
                }, duration, "linear", function() {
                    $("#menu-header").css("display", "none");      
                    _callback();
                });
            });
        };


        let _parseUrl = function(url) {
            if (typeof(url) !== "string");
                url = window.location.href;
            
            var el = document.createElement('a');
            var address;

            el.href = url;

            if (el.protocol.substr(0, 4) === "file")
                address = "file://" + el.pathname;
            else
                address = el.protocol + "//" + el.hostname + "/index.html";
                
            el.path = address.replace('/index.html', '');

            return {
                "protocol": el.protocol,
                "host": el.host,
                "hostname": el.hostname,
                "port": el.port,
                "pathname": el.pathname,
                "search": el.search,
                "hash": el.hash,
                "address": address,
                "url": url,
                "path": el.path
            };
        };


        let _loadNav = function(link, name, _callback) {
            if (name == "page404")
                link = page404;

            if (link['name'] == name) {
                $.ajax({
                    type: 'GET',
                    url: link['href'],
                    mimeType: 'text/html; charset: UTF-8',
                    contentType: "text/html; charset: UTF-8",
                    dataType: "text",
                    success: function(data) {
                        $("#" + link['target']).html(data);
                        _route = name;

                        if (typeof(_callback) === "function")
                            _callback();

                        var url = _parseUrl();
                        if (name != "page404")
                            var href = url.address + "?" + name;

                        window.history.pushState(null, null, href);
                    }
                });
            }
        };


        let _nav = function(name, _callback) {
            var done = false;
        //    var url = _parseUrl();
            _links.forEach(function(link) {
                if (link['name'] == name) {
                    _loadNav(link, name, _callback);
                //    window.history.pushState(null, null, url.address + "?" + name);
                    done = true;
                    return;
                }
            });

            if (! done)
                return _loadNav(null, "page404", _callback);
        };


        let _getPage = function(_url) {
            if (typeof(_url) !== "string")
                var url = _parseUrl();
            else
                var url = _url;

            var search = url.search;

            if (typeof(search) !== "string" || search == "" || search == "?")
                search = "home";
            
            if (search.substr(0, 1) == "?") search = search.substr(1);

            var page_name = search.split("/")[0];
    
            _nav(page_name);
        };


        return {
            "route":                function() { return _route },
            "navLinks":             _navLinks,
            "popLinks":             _popLinks,
            "unpopLinks":           _unpopLinks,
            "nav":                  _nav,
            "parseUrl":             _parseUrl,
            "getPage":              _getPage
        };

    })();

