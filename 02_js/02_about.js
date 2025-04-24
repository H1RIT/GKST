document.addEventListener("DOMContentLoaded", function() {
  const about = document.querySelector("#about");
  const team = document.querySelector("#team");
  const member = document.querySelector("#member");

  let startY = 0;
  let endY = 0;
  
  about.addEventListener("mousedown", function(e) {
    if (isSwiping) return;
    startY = e.clientY;
  });
  
  about.addEventListener("mouseup", function(e) {
    if (isSwiping) return;

    endY = e.changedTouches[0].clientY;

    if (endY < startY) {
      window.scrollTo({ top: team.offsetHeight, behavior: "smooth" });
      setTimeout(function() {
        turnBlack();
      }, 300);
    } else if (endY > startY) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(function() {
        turnWhite();
      }, 300);
    }
  }); 

  let startX = 0;
  let currentX = 0;
  let isSwiping = false;
  let currentIndex = 2;

  const windowWidth = window.innerWidth;
  const carousel = document.querySelector("#about .carousel");
  const carouselItems = document.querySelectorAll("#about .carouselItem");

  const itemPadding = ((windowWidth - 100) - (0.9 * windowWidth - 100) + 30) / 2;
  const currentItemWidth = windowWidth - 100;
  const itemWidth = (windowWidth * 0.9) - 100;

  const firstClone = carouselItems[0].cloneNode(true);
  const secondClone = carouselItems[1].cloneNode(true);
  const thirdClone = carouselItems[carouselItems.length - 2].cloneNode(true);
  const fourthClone = carouselItems[carouselItems.length - 1].cloneNode(true);
  
  carousel.appendChild(firstClone);
  carousel.appendChild(secondClone);
  carousel.insertBefore(fourthClone, carouselItems[0]);
  carousel.insertBefore(thirdClone, fourthClone);

  const titleCarousel = document.querySelector("#about .titleCarousel")
  const titles = document.querySelectorAll("#about .title")

  const firstTitleClone = titles[0].cloneNode(true);
  const secondTitleClone = titles[1].cloneNode(true);
  const thirdTitleClone = titles[titles.length - 2].cloneNode(true);
  const fourthTitleClone = titles[titles.length - 1].cloneNode(true);
  
  titleCarousel.appendChild(firstTitleClone);
  titleCarousel.appendChild(secondTitleClone);
  titleCarousel.insertBefore(fourthTitleClone, titles[0]);
  titleCarousel.insertBefore(thirdTitleClone, fourthTitleClone);

  const updateTitles = document.querySelectorAll("#about .title")

  const updatedItems = document.querySelectorAll('#about .carouselItem');
  const lastItem = updatedItems.length - 1;

  updateCurrentSlide();

  function updateCurrentSlide() {
    carousel.style.transform = `translateX(-${(currentIndex) * itemWidth - 50}px)`;
    titles.forEach(title => {
      title.style.top = `-${currentIndex * 7}rem`;
    })

    updateTitles.forEach(title => {
      title.style.top = `-${currentIndex * 7}rem`;
    });

    updatedItems.forEach((item, index) => {
      const post = item.querySelector(".post");

      if (index === currentIndex) {
        item.style.width = `${currentItemWidth}px`;
        item.style.padding = 0;
        if (post) {
          post.style.display = "block";
        }
      } else {
        item.style.width = `${itemWidth}px`;
        item.style.padding = `${itemPadding}px 15px`;
        if (post) {
          post.style.display = "none";
        }
      }
    });
  }

  carousel.addEventListener("transitionend", () => {
    if (currentIndex > 5) {
      pauseTransition();
      currentIndex = 2;
      updateCurrentSlide();
      resumeTransition();
    } else if (currentIndex < 2) {
      pauseTransition();
      currentIndex = 5;
      updateCurrentSlide();
      resumeTransition();
    }
  });

  function pauseTransition() {
    carousel.style.transition = "none";
    updatedItems.forEach(item => {
      item.style.transition = "none"
    });
    updateTitles.forEach(title => {
      title.style.transition = "none"
    });
  }

  function resumeTransition() {
      setTimeout(() => {
          carousel.style.transition = "";
          updatedItems.forEach(item => {
            item.style.transition = ""
          });
          updateTitles.forEach(title => {
            title.style.transition = ""
          });
      }, 10);
  }

  autoSlide();

  function autoSlide() {
    if (isSwiping) return;

    setInterval(() => {
      currentIndex++;
      if (currentIndex > lastItem) {
        pauseTransition();
        currentIndex = 2;
        updateCurrentSlide();
        resumeTransition();
      }
      updateCurrentSlide();
    }, 5000);
  }

  carousel.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    isSwiping = true;
    currentX = NaN;
  });

  carousel.addEventListener("mousemove", (e) => {
    if (!isSwiping) return;
    currentX = e.clientX;
  }, { passive: false });

  carousel.addEventListener("mouseup", () => {
    if (!isSwiping) return;

    const deltaX = currentX - startX;

    if (deltaX < -50 && currentIndex < lastItem) {
      currentIndex++;
    } else if (deltaX > 50 && currentIndex > 0) {
      currentIndex--;
    }

    updateCurrentSlide();
    isSwiping = false;
  }, { passive: false });
});