function initTooltips() {

    $("#tooltop-el").on("mouseover", function(el) {
         e.preventDefault();
         return;
    });

    $(".blog-lannguage, .project-language").on("mouseenter", function(e) {
       console.log("ToolTipping" + $(this).attr("tip"));

       console.log("mouse y, x == " + e.pageY + ", " + e.pageX);

        $("#tooltip-el").html($(this).attr("tip"));
       
        $("#tooltip-el").css({
            "display": "block",
            "opacity": "0.01",
            "top": e.pageY,
            "left": e.pageX
        });

        $("#tooltip-el").animate({
            "opacity": "0.99"
        }, 500, "linear");
    });

    $("#tooltip-el").on("mouseleave", function() {
        $("#tooltip.el").stop().animate({
            "opacity": "0.01"
        }, 500, "linear", function() {
            $(this).css("display", "none");
        });
    });
}

