window.addEventListener("load", function () {
  const loadingScreen = document.getElementById("loading");
  loadingScreen.classList.add("hidden");

  setTimeout(() => {
    loadingScreen.style.display = "none";
    document.getElementById("home").style.display = "block";
  }, 500);
});

let windowWidth = window.innerWidth;

window.addEventListener("resize", () => {
  const currentWidth = window.innerWidth;
  
  if (Math.abs(currentWidth - windowWidth) > 10) {
    window.location.reload();
  }
});

const menuBtn = document.querySelector("#menuBtn");
const menuBox = document.querySelector("#menuBox");
const sections = document.querySelectorAll("section.pages");

menuBtn.addEventListener("click",function() {
  toggleMenu();
});

let logoWhiteClassList = null;
let logoBlackClassList = null;

const logoWhite = document.querySelector(".logo.white");
const logoBlack = document.querySelector(".logo.black");

function toggleMenu() {
  menuBtn.classList.toggle("open");
  menuBox.classList.toggle("open");
  if (logoWhiteClassList == null) {
    logoWhiteClassList = Array.from(logoWhite.classList);
    logoBlackClassList = Array.from(logoBlack.classList);
    turnWhite();
  } else {
    logoWhite.classList = logoWhiteClassList.join(" ");
    logoBlack.classList = logoBlackClassList.join(" ");
    logoReset();
    if (logoWhite.classList.contains("active")) {
      menuBtn.classList.add("white");
    } else {
      menuBtn.classList.remove("white");
    }
  }
};

function scrollLock() {

  if (menuBox.opacity === "0") {
    document.body.style.overflow = "";
  } else {
    document.body.style.overflow = "hidden";
  }
};

scrollLock();

const logo = document.querySelector("#logo");
const menuBtns = document.querySelectorAll(".menu li a");

logo.addEventListener("click",function() {
  goHome();
  turnBlack();
  menuBtns.forEach(function(btn) {
    btn.classList.remove("tab");
  });
  logoReset();
});

function logoReset() {
  logoWhiteClassList = null;
  logoBlackClassList = null;
}

function turnWhite() {
  logoBlack.classList.remove("active"); 
  logoWhite.classList.add("active");
  menuBtn.classList.add("white");
};

function turnBlack() {
  logoBlack.classList.add("active");
  logoWhite.classList.remove("active");
  menuBtn.classList.remove("white");
};

function goHome() {
  menuBtn.classList.remove("open");
  menuBox.classList.remove("open");
  sections.forEach(function(pages) {
    setTimeout(function() {
      pages.style.display = "none";
    },300)
    pages.style.opacity = "0";
    pages.classList.add("goHome");
  });
};

menuBtns.forEach(function(menu) {
  menu.addEventListener("click",function() {
    goPage(menu);
    window.scrollTo({
      top: 0
    });
  });
});

function goPage(menu) {
  logoReset();

  const pageName = menu.classList[0];
  const onPage = document.getElementById(pageName);

  sections.forEach(function(pages) {
    pages.style.display = "none";
    pages.style.opacity = "0";
    pages.classList.remove("goHome");
  });
  onPage.style.display = "block";
  onPage.style.opacity = "1";

  menuBtns.forEach(function(allBtn) {
    allBtn.classList.remove("tab");
  });

  if (menu.classList.contains("about")) {
    turnWhite();
  } else {
    turnBlack();
  };

  menu.classList.add("tab");
  setTimeout(function() {
    menuBox.classList.remove("open");
  }, 300);
  setTimeout(function() {
    menuBtn.classList.remove("open");
  }, 100);
};

const snsIcons = document.querySelectorAll(".snsIcon");

snsIcons.forEach(function(icon) {
    icon.addEventListener("click",function() {
      goSNS(icon);
    });
});

function goSNS(icon) {
  const snsIcon = icon.querySelector(".tab");

  snsIcon.style.opacity = 1;

  setTimeout(function() {
    snsIcon.style.opacity = 0;
  }, 300);
};

const basicBtn = document.querySelectorAll(".basicBtn");
basicBtn.forEach(button => {
  button.addEventListener("click", () => {
    button.style.background = "#000";
    button.querySelector("a").style.color = "#fff";
      
    setTimeout(function() {
      button.style.background = "#fff";
      button.querySelector("a").style.color = "#000";
    }, 300);
  });
});

simulateSwipe(document)

function simulateSwipe(target) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  const dragThreshold = 10;

  target.addEventListener("mousedown", function(e) {
    startX = e.clientX;
    startY = e.clientY;
    isDragging = false;

    target.dispatchEvent(new TouchEvent("touchstart", {
      touches: [new Touch({ identifier: Date.now(), target: target, clientX: e.clientX, clientY: e.clientY })],
      bubbles: true,
      cancelable: true
    }));
  });

  target.addEventListener("mousemove", function(e) {
    const deltaX = Math.abs(e.clientX - startX);
    const deltaY = Math.abs(e.clientY - startY);

    if (deltaX > dragThreshold || deltaY > dragThreshold) {
      isDragging = true;
    }

    target.dispatchEvent(new TouchEvent("touchmove", {
      touches: [new Touch({ identifier: Date.now(), target: target, clientX: e.clientX, clientY: e.clientY })],
      bubbles: true,
      cancelable: true
    }));
  });

  target.addEventListener("mouseup", function(e) {
    target.dispatchEvent(new TouchEvent("touchend", {
      changedTouches: [new Touch({ identifier: Date.now(), target: target, clientX: e.clientX, clientY: e.clientY })],
      bubbles: true,
      cancelable: true
    }));

    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  target.addEventListener("click", function(e) {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      isDragging = false;
    }
  }, true);
}

function enableDragScroll(container) {
  let isDragging = false;
  let startY;
  let scrollTop;

  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    startY = e.clientY;
    scrollTop = container.scrollTop;
    container.style.cursor = "grabbing";
    e.preventDefault();
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    container.scrollTop = scrollTop - deltaY;
  });

  container.addEventListener("mouseup", () => {
    isDragging = false;
    container.style.cursor = "default";
  });

  container.addEventListener("mouseleave", () => {
    isDragging = false;
    container.style.cursor = "default";
  });
}