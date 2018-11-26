
const   ARTICLE_PREFIX = "/public/articles/";
const   ARTICLE_DATA_PREFIX = "/public/articles/data/articles-";

const   ARTICLE_YEAR_START = 2018;

const   ARTICLE_SPILL_DESCENDING = 0;
const   ARTICLE_SPILL_ASCENDING = 1;


const   Blog = (function() {

    let _articles = [];

    let _year = 0;
    let _article = 0;

    let _direction = ARTICLE_SPILL_DESCENDING;

    let _loadArticlesJSON = function(year, _callback) {
            var url = Routes.parseUrl();
            var path = url.path + ARTICLE_DATA_PREFIX + year.toString() + ".json";

            console.log("Attempting to load " + path);

        $.ajax({
            url: path,
            mimeType: 'application/json; charset: UTF-8',
            dataType: "json",
            timeout: 5000,
            success: function(data) {
                _articles.push(data);
                console.log("Successfully loaded " + path);
                _loadArticlesJSON(++year, _callback);
            },
            error: function() {
                loaded_json = false;
                console.log("Failed to load " + path + ", breaking");
                if (typeof(_callback) === "function")
           
                return _callback(_articles);
            }
        });
    };

    let _resetArticles = function() {
        if (_direction == ARTICLE_SPILL_DESCENDING) {
            _year = (_articles.length - 1);
            _article = (_articles[_year].length - 1);
        } else
            _year = _article = 0;
    };

    let _handleBlogRequest = function(url) {
        var tokens = url.search.split("/");
    
        if (typeof(tokens[1]) === "string" && tokens[1] != "") {
            if (tokens[1] == "search")
                console.log("Doung a search");
            else {
                var year = tokens[1];

                if (typeof(tokens[2]) === "string" && tokens[2] != "") {
                    var page = tokens[2];
                    Blog.loadArticle(year, page,
                        function(data, url) {
                            $("#blog").html(data);
                            window.history.pushState(null, null, url);
                        },
                        function(error_msg) {
                            $("#blog").html(error_msg);
                        }
                    );
                }
            }
        }
        else {
            _resetArticles();
        }
    };


    let _loadArticle = function(year, article, _success, _failure) {
        var url = Routes.parseUrl();
        var path = url.path + ARTICLE_PREFIX + year + "/" + article;

        $.ajax({
            url: path,
            contentType: "text/html",
            dataType: "text",
            success: function(data) {
                var url_return = url.address + "?blog/" + year + "/" + article;

           //     console.log("Success on " + url_return);
                if (typeof(_success) === "function")
                    _success(data, url_return);
            },
            error: function() {
                if (typeof(_failure) === "function")
                    _failure("Error loading article: " + path);
            }
        });
    };


    let _loadArticles = function(limit, _callback) {
        var total = 0;
        var articles = [];

        while (true) {
            if (typeof(limit) === "number" && limit > 0) {
                if (total >= limit)
                    break;
                console.log("TOTAL == " + total);
                total++;
            }

        //    console.log(`_year = ${_year}, _article = ${_article}`)
            articles.push(_articles[_year][_article]);

            if (_direction == ARTICLE_SPILL_DESCENDING) {
                if (_article <= 0) {
                    if (_year <= 0) break;
                    _year--;
                    _article = (_articles[_year].length - 1);
                }
                else _article--;
            } else {
                if (_article >= (_articles[_year].length - 1)) {
                    if (_year >= (_articles.length - 1)) break;
                    _year++;
                    _article = 0;
                } else _article++;
            }
        }

        if (typeof(_callback) === "function")
            _callback(articles);

        return articles;
    };


    let _getTitleHTML = function(article) {
        return '\
            <div \
                id="article-title-' + article.name + '" \
                class="blog-title" \
                title="' + Routes.parseUrl().path + ARTICLE_PREFIX +  article.published.substr(6) + "/" + article.name + '.html"\
                real_url="' + Routes.parseUrl().address + "?blog/" + article.published.substr(6) + "/" + article.name + '.html"\
            >\
                ' + article.title + '\
            </div>\
            <div \
                id="article-subtitle-' + article.name + '" \
                class="blog-subtitle" \
            >\
                ' + article.subtitle + '\
            </div>\
        '
    };


    let _getThumbHTML = function(article) {
        var url = Routes.parseUrl();
        var img_url = url.path + ARTICLE_PREFIX + article.thumb;

        return '\
            <img \
                id="blog-thumb-' + article.name + '" \
                class="blog-thumb" \
                src="' + img_url + '" \
                width="100%" height="100%" \
            />\
        ';
    };


    let _getDescriptionHTML = function(article) {
        return '\
            <div \
                id="article-description-' + article.name + '" \
                class="blog-description" \
            >\
                ' + article.description + '\
            </div>\
        '
    };       
    
    let _getLanguagesHTML = function(name, languages) {
    //    var name = project.name;
        var html = "";

        languages.map(function(language) {
            html += '\
                <div \
                    id="articles-' + name + '-language-' + language + '" \
                    class="blog-language" \
                    title="Click to search for ' + language + '" \
                >\
                    ' + language + '\
                </div>\
            ';
        });

        return html;
    };


    let _showPreview = function(from, to, articles, duration, _callback) {
        if (from >= articles.length) {
            if (typeof(_callback) === "function")
                return _callback(false);
            return false;
        }

        $("#blog").append('\
            <div \
                id="article-' + _year + '-' + from + '" \
                class="blog-preview" \
            >\
                ' + _getTitleHTML(articles[from]) + '\
                ' + _getThumbHTML(articles[from]) + '\
                ' + _getDescriptionHTML(articles[from]) + '\
                <div \
                    id="article-languages-' + articles[from].name + '" \
                    class="blog-languages"\
                >\
                    ' + _getLanguagesHTML(
                            articles[from].name,
                            articles[from].languages
                        ) + '\
                </div>\
            </div>\
        ');

        $("#article-" + _year + "-" + from).animate({
            "opacity": "0.75"
        }, duration, "linear", function() {
            if (from >= (articles.length - 1)) {
                if (typeof(_callback) === "function")
                    return _callback(false);
                return false;
            }

            if (from < to) from++;
            else from--;

            if (from == to) {
                if (typeof(_callback) === "function")
                    return _callback(true);   
                return true;
            }

            return _showPreview(from, to, articles, duration, _callback);
        });
    };


    let _showPreviews = function(from, to, articles, duration, _callback) {
        if (from >= articles.length) {
            if (typeof(_callback) === "function")
                _callback(false);
            return false;
        }
        return _showPreview(from, to, articles, duration, _callback);
    };


    let _getArticleByName = function(name, _callback) {
        _articles.map(function(articles) {
            articles.map(function(post) {
                if (post.name == name)
                    return _callback(post);
            });
        });
    };


    let _hasArticle = function(articles, title) {
        for (var article = 0; article < articles.length; article++) {
            if (articles[article].title == title)
                return true;
        }

        return false;
    };


    let _getSimilarHTML = function(articles) {
        var html = "";

        var url = Routes.parseUrl();

        articles.map(function(article) {
            var img_url = url.path + ARTICLE_PREFIX + article.thumb;

            html += '\
                <h3 \
                    id="article-similar-title-' + article.title + '" \
                    class="article-similar" \
                    style="cursor: pointer; text-shadow: 1px 1px 0px #1E90FF;" \
                    title="' + Routes.parseUrl().path + ARTICLE_PREFIX +  article.published.substr(6) + "/" + article.name + '.html"\
                    real_url="' + Routes.parseUrl().address + "?blog/" + article.published.substr(6) + "/" + article.name + '.html"\
                >\
                    ' + article.title + '\
                </h3>\
                <img \
                    id="article-similar-' + article.title + '" \
                    src="' + img_url + '" \
                    class="article-similar" \
                    width="100%" height="auto" \
                    style="margin-bottom: 12px; opacity: 0.75; cursor: pointer; box-shadow: 2px 2px 0px #000;" \
                    title="' + Routes.parseUrl().path + ARTICLE_PREFIX +  article.published.substr(6) + "/" + article.name + '.html"\
                    real_url="' + Routes.parseUrl().address + "?blog/" + article.published.substr(6) + "/" + article.name + '.html"\
                />\
            ';
        });
        return html;
    };


    let _getSimilar = function(post, limit, current_article) {
        var year = (_articles.length - 1);

        var articles = [];
        var total = 0;

        while (year >= 0) {
            if (typeof(limit) === "number" && limit > 0) {
                if (total >= limit)
                    break;
            }

            var article  = (_articles[year].length - 1);
            
            while (article >= 0) {
                if (typeof(limit) === "number" && limit > 0) {
                    if (total >= limit)
                        break;
                }

                for (var lingo = 0; lingo < post.languages.length; lingo++) {
                    if (typeof(current_article) === "string") {
                        if (current_article == _articles[year][article].name)
                            continue;
                    }
                    var l = _articles[year][article].languages.indexOf(post.languages[lingo]);
                    if (l >= 0) {
                        if (! _hasArticle(articles, _articles[year][article].title)) {
                            articles.push(_articles[year][article]);
                            total++
                        }
                    }
                }
                article--;
            }
            year--;
        }

        return articles;
    };


    let _getDateTranslation = function(date) {
        var day = date.substr(0, 2);
        var month = date.substr(3, 2);
        var year = date.substr(6);

        var _month = [
            "January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December"
        ];

        if (month.substr(0, 1) == "0") month = month.substr(1);

        var n = day.substr(1);
        var nth;

        if (n == "1") nth = "st";
        else if (n == "2") nth = "nd";
        else if (n == "3") nth = "rd";
        else nth = "th";

        return day + nth + " " + _month[parseInt(month)] + ", " + year;
    };


    let _getLatestArticles = function(limit, _callback) {
        var year = (_articles.length - 1);
        var total = 0;

        var articles = [];

        while (year >= 0) {
            if (typeof(limit) === "number" && limit > 0) {
                if (total >= limit)  break;
            }
            
            var article = (_articles[year].length - 1);

            console.log(`YEAR == ${year} and ARTICLE == ${article}`)
            while (article >= 0) {
                if (typeof(limit) === "number" && limit > 0) {
                    if (total >= limit)  break;
                    total++;
                }
            //    console.log(`total: ${total} limit: ${limit}`)
                articles.push(_articles[year][article--]);
            }
            year--;
        }

        if (typeof(_callback) === "function") _callback(articles);

        return articles;
    };


    return {
        "loadArticlesJSON":         _loadArticlesJSON,
        "loaded":                   function() {
            if (_articles.length > 0) return true;
            return false;
        },
        "reset":                    function() {
            _articles = [];
        },
        "resetArticles":            _resetArticles,
        "handleBlogRequest":        _handleBlogRequest,
        "loadArticle":              _loadArticle,
        "loadArticles":             _loadArticles,
        "showPreviews":             _showPreviews,
        "getArticleByName":         _getArticleByName,
        "getLanguagesHTML":         _getLanguagesHTML,
        "getSimilar":               _getSimilar,
        "getSimilarHTML":           _getSimilarHTML,
        "getDateTranslation":       _getDateTranslation,
        "getLatestArticles":        _getLatestArticles
    };

})();

