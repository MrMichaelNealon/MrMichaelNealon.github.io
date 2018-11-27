
    let   Projects = (function() {
        let     url = Routes.parseUrl();
        const   PROJECTS_URL = url.path + "/public/projects/data/projects.json";
    
        let   _projects = false;
        
///////////////////////////////////////////////////////////
//  Load the projects.json - on success the json data is
//  stored in _projects.
//
//  Throws an error and bails on failure.
//
        $.ajax({
            url: PROJECTS_URL,
            mimeType: 'application/json; charset: UTF-8',
            dataType: 'json',
            success: function(data) {
                _projects = data;
            },
            error: function() {
                throw new Error("Error loading projects.json (" + PROJECTS_URL + ")");
            }
        });


        let _projectHTML = function(prefix, name, data) {
            return '\
                <div \
                    id="project-' + prefix + '-' + name +  '"\
                    class="project-' + prefix + '" \
                >\
                    ' + data.replace('-', ' ') + '\
                </div>\
            ';
        };


        let _projectLanguagesHTML = function(project) {
            var name = project.name;
            var html = "";

            project.languages.map(function(language) {
                html += '\
                    <div \
                        id="project-' + name + '-language-' + language + '" \
                        class="project-language" \
                        title="Click to search for ' + language + '" \
                        language="' + language + '" \
                    >\
                        ' + language + '\
                    </div>\
                ';
            });

            $(".project-language").on("click", function() {
                var language = $(this).attr("language");
                var route = Routes.parseUrl().address + "?blog=" + language;
                window.location.href = route;
            });

            return html;
        };


        let _projectImagesHTML = function(project) {
            var html = "";

            if (typeof(project.repo) === "string") {
                html = '\
                    <a href="' + project.repo + '" target="_blank">\
                        <img \
                            id="project-' + project.name + '-git" \
                            class="project-git" \
                            src="' + url.path + '/public/images/icons/github-bg.png" \
                            width="32px" height="32px"\
                            title="Visit the Github repo at ' + project.repo + '" \
                        />\
                    </a>\
                ';
            }

            if (typeof(project.href) === "string") {
                html += '\
                    <a href="' + project.href + '" target="_blank">\
                        <img \
                            id="project-' + project.name + '-demo" \
                            class="project-demo" \
                            src="' + url.path + '/public/images/icons/Logo.png" \
                            width="32px" height="32px"\
                            title="View a live demo at ' + project.href + '" \
                        />\
                    </a>\
                ';
            }

            return html;
        };


        let _projectThumbHTML = function(project) {
            return '\
                <img \
                    id="project-thumb-' + project.name + '" \
                    class="project-thumb" \
                    src="' + url.path + project.thumb + '" \
                    height="100%" width="100%" \
                />\
            ';
        };


        let _getProjectHTML = function(duration, from) {
            $("#projects").append('\
                <div \
                    id="project-' + _projects[from].name + '" \
                    class="project-el" \
                >\
                    ' + _projectThumbHTML(_projects[from]) + '\
                    <div \
                        id="project-info-' + _projects[from].name + '" \
                        class="project-info" \
                    >\
                        ' + _projectHTML("name", _projects[from].name, _projects[from].name) + '\
                        ' + _projectHTML("description", _projects[from].name, _projects[from].description) + '\
                        <div \
                            id="project-languages-' + _projects[from].name + '" \
                            class="project-languages"\
                        >\
                            ' + _projectLanguagesHTML(_projects[from]) + '\
                        </div>\
                        ' + _projectImagesHTML(_projects[from]) + '\
                    </div>\
                </div>\
            ');
        };


        let _showProject = function(duration, from, limit, current, _callback) {
            if ((limit > 0 && current >= limit) || from >= _projects.length) {
                return _callback();
            }

            _getProjectHTML(duration, from);

            var name = _projects[from].name;

            $("#project-" + name).animate({
                "opacity": "0.99"
            }, duration, "linear", function() {
                $("#project-info-" + name).css("display", "block");
            });
            
            setTimeout(function() {
                _showProject(duration, ++from, limit, ++current, _callback);
            }, duration);
        };


        let _showProjects = function(duration, from, limit, _callback) {
            _showProject(duration, from, limit, 0, function() {
                $(".project-el").on("mouseenter", function() {
                    $("#" + $(this).attr("id") + " > img").stop().animate({
                        "top": "-100%"
                    }, 500, "swing");
                });
                $(".project-el").on("mouseleave", function() {
                    $("#" + $(this).attr("id") + " > img").stop().animate({
                        "top": "0%"
                    }, 500, "swing");
                });

                return _callback();
            });
        };


        return {
            "allProjects":          function() { return _projects; },
            "showProjects":         _showProjects,
            "projectLanguages":     _projectLanguagesHTML
        };

    })();

