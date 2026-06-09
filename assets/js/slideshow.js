document.addEventListener("DOMContentLoaded", function () {
  let currentFace = 0;
  const cube = document.getElementById("cube");
  const tiltWrapper = document.getElementById("tilt-wrapper");
  let isScrolling = false; // Add a flag for the scroll cooldown

  function triggerSkills() {
    const normalizedIndex = ((currentFace % 4) + 4) % 4;

    const bars = document.querySelectorAll(".progress-fill");
    if (normalizedIndex === 1) {
      bars.forEach((bar) => {
        const w = bar.getAttribute("data-width");
        bar.style.width = w;
      });
    } else {
      bars.forEach((bar) => {
        bar.style.width = "0";
      });
    }
  }

  function updateCube() {
    const rotationY = -currentFace * 90;
    cube.style.transform = `rotateY(${rotationY}deg)`;
    triggerSkills();
  }

  document.getElementById("arrow-left").addEventListener("click", () => {
    currentFace--;
    updateCube();
  });

  document.getElementById("arrow-right").addEventListener("click", () => {
    currentFace++;
    updateCube();
  });

  // --- NEW: Scroll Event Listener ---
  document.addEventListener("wheel", (event) => {
    // If we are currently in the middle of a rotation, ignore the scroll
    if (isScrolling) return;

    if (event.deltaY > 0) {
      // Scrolled down -> turn right
      currentFace++;
      updateCube();
    } else if (event.deltaY < 0) {
      // Scrolled up -> turn left
      currentFace--;
      updateCube();
    }

    // Lock scrolling for 800ms (matching your CSS transition time)
    isScrolling = true;
    setTimeout(() => {
      isScrolling = false;
    }, 800);
  });
  // -----------------------------------

  document.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    const tiltX = (y - 0.5) * 20;
    const tiltY = (x - 0.5) * 20;

    tiltWrapper.style.transform = `rotateX(${-tiltX}deg) rotateY(${tiltY}deg)`;
  });

  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (event) => {
      if (!event.beta) return;
      const tiltX = Math.min(Math.max(event.beta - 45, -20), 20);
      const tiltY = Math.min(Math.max(event.gamma, -20), 20);
      tiltWrapper.style.transform = `rotateX(${-tiltX}deg) rotateY(${tiltY}deg)`;
    });
  }
});