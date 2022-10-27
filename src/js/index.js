const menuArrow = $("header .arrowMenu")

menuArrow.on('click', function() {
    $("header .arrowMenu img").toggleClass("open")
    $("header nav").toggleClass("open")
    $("header nav ul").toggleClass("open")
})