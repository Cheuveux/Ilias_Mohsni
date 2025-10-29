window.addEventListener("DOMContentLoaded", () => {
    //gsap.from("body", {opacity: 0, duration: 1});

    /*gsap.from(".header-page > *",{
        y: -20,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        delay: 1
    });*/
    const paragraph = document.querySelectorAll(".about-description p ");

    gsap.from(paragraph, {
        y: -40,
        opacity: 0,
        duration: 2,
        ease: "power2.out",
        delay: 0.5,
        stagger: 0.4,
    });
});