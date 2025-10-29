const logo = document.querySelector(".header-logo svg path");
const logoSVG = document.querySelector(".header-logo svg");
const originalColor = "rgb(222, 221, 201)";
const originalScale = 1;
const resetDelay = 500; // ms
let resetTimeout;

if(window.innerWidth >= 1200){
    document.addEventListener("mousemove", (e) => {
        //normalisation : -1 a 1
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        const color = gsap.utils.interpolate(originalColor, "#064e3b", (x + 1) / 2);

        //Effet tilt + scale
        const shadowX = x * 10;
        const shadowY = y * 10;
        const shadowBlur = 20;
        const shadowColor = "rgba(6, 78, 59, 0.7)";

        gsap.to(logoSVG, {
            rotationX: x * 80,
            rotationY: -y * 50,
            rotationZ: x * 10,
            scale: 1 + (Math.abs(x) + Math.abs(y)) * 0.3,
            transformOrigin: "center center",
            filter: `drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor})`,
            ease: "power2.out",
            duration: 0.5
        });

        gsap.to(logo, {
            fill: color,
            duration: 0.5,
            ease: "power2.out"
        });

        // reset timeout
        clearTimeout(resetTimeout);
        resetTimeout = setTimeout(() => {
            gsap.to(logoSVG, {
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                scale: originalScale,
                filter: "none",
                duration: 0.5,
                ease: "power2.out"
            });
            gsap.to(logo, {
                fill: originalColor,
                duration: 0.5,
                ease: "power2.out"
            });
        }, resetDelay);
    });
}