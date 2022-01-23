document.addEventListener("DOMContentLoaded", function (event) {

    var scrollpos = window.scrollY;
    console.log(scrollpos);
    var header = document.getElementById("header");
    var navcontent = document.getElementById("nav-content");
    var navaction = document.getElementById("headerActionButton");
    var brandname = document.getElementById("brandname");
    var toToggle = document.querySelectorAll(".toggleColour");
    var textElements = document.getElementsByClassName("textElement");

    document.addEventListener("scroll", function () {
        scrollpos = window.scrollY;

        if (scrollpos > 10) {
            document.getElementById("logo").src = "/assets/images/logo.png";
            header.classList.add("bg-white");
            //navaction.classList.remove("bg-white");
            navaction.classList.add("gradient");
            navaction.classList.remove("text-gray-800");
            navaction.classList.add("text-white");
      
            for (var i = 0; i < toToggle.length; i++) {
                toToggle[i].classList.add("text-gray-800");
                toToggle[i].classList.remove("text-white");
            }
            for (var i = 0; i < textElements.length; i++) {
                textElements[i].classList.add("text-black");
                textElements[i].classList.remove("text-white");
            }
            header.classList.add("shadow");
            navcontent.classList.remove("bg-gray-100");
            navcontent.classList.add("bg-white");
        } else {
            document.getElementById("logo").src = "/assets/images/logo_white.png";

            header.classList.remove("bg-white");
            navaction.classList.remove("gradient");
            navaction.classList.add("bg-white");
            navaction.classList.remove("text-white");
            navaction.classList.add("text-gray-800");
            for (var i = 0; i < toToggle.length; i++) {
                toToggle[i].classList.add("text-white");
                toToggle[i].classList.remove("text-gray-800");
            }
            for (var i = 0; i < textElements.length; i++) {
                textElements[i].classList.remove("text-black");
                textElements[i].classList.add("text-white");
            }
            header.classList.remove("shadow");
            navcontent.classList.remove("bg-white");
            navcontent.classList.add("bg-gray-100");
        }
    });
});