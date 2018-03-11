timelineMove = function() {
    var e,
        t,
        n,
        r,
        i,
        o,
        a,
        s,
        l,
        c;
    return r = $(".content"), o = r.find("li"), i = $(".timeline-time ul"), a = r.add(i), e = o.outerWidth(), a.find("li:first").addClass("active"), r.css("width", 100 * o.length + "vw"), s = $(".timeline-time").width(), l = 1 * s / 10, c = 6 * s / 10, i.css("width", (o.length - 1) * s * 4 / 10 + 6 * s / 10), i.find("li").css("width", l), i.find("li.active").css("width", c), i.css({
        marginLeft: l
    }), n = !1, t = function(t) {
        var o,
            a,
            s,
            u,
            f;
        if (!n)
            return n = !0, setTimeout(function() {
                return n = !1
            }, 1e3), o = r.find("li.active"), a = i.find("li.active"), "previous" === t ? (u = o.prev(), f = a.prev(), s = "+") : (u = o.next(), f = a.next(), s = "-"), u.length ? (r.css({
                marginLeft: s + "=" + e + "px"
            }), u.addClass("active"), o.removeClass("active"), i.css({
                marginLeft: s + "=" + l + "px"
            }), f.addClass("active"), i.find("li").css("width", l), f.css("width", c), a.removeClass("active")) : void 0
    }, 


    $(".timeline .previous").off().on("click", function() {
        if (t("previous"), $(".timeline .next").removeClass("last"), r.find("li:first-child").hasClass("active"))
            return $(this).addClass("last")
    }), 


    $(".timeline .next").off().on("click", function() {
        if (t("next"), $(".timeline .previous").removeClass("last"), r.find("li:last-child").hasClass("active"))
            return $(this).addClass("last")
    }), i.find("li").off().on("click", function() {
        var t;
        if (!n)
            return n = !0, setTimeout(function() {
                return n = !1
            }, 1e3), t = $(this).index() - r.find("li.active").index(), a.find("li").removeClass("active"), $(this).addClass("active"), o.eq($(this).index()).addClass("active"), r.css({
                marginLeft: "-=" + t * e + "px"
            }), i.css({
                marginLeft: "-=" + t * l + "px"
            }), i.find("li").css("width", l), i.find("li.active").css("width", c), $(".timeline .previous, .timeline .next").removeClass("last"), r.find("li:first-child").hasClass("active") && $(".timeline .previous").addClass("last"), r.find("li:last-child").hasClass("active") ? $(".timeline .next").addClass("last") : void 0
    })
}

// $(function() {
//     $('ul.nav a').bind('click', function(event) {
//         var $anchor = $(this);
            
//             if you want to use one of the easing effects:
//             $('html, body').stop().animate({
//                 scrollLeft: $($anchor.attr('href')).offset().left
//             }, 1500,'easeInOutExpo');
            
//         $('html, body').stop().animate({
//             scrollLeft: $($anchor.attr('href')).offset().left
//             }, 1000);
//             event.preventDefault();
//     });
// });