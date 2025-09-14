// جلب الزرار من الـ HTML
const toggleDarkBtn = document.getElementById("toggle-dark");

// دالة للتبديل بين الوضعين
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  // تغيير شكل الأيقونة حسب الوضع الحالي
  if (document.body.classList.contains("dark-mode")) {
    toggleDarkBtn.textContent = "☀️"; // Light Mode
    localStorage.setItem("theme", "dark");
  } else {
    toggleDarkBtn.textContent = "🌙"; // Dark Mode
    localStorage.setItem("theme", "light");
  }
}

// ربط الزرار بالدالة
toggleDarkBtn.addEventListener("click", toggleDarkMode);

// عند تحميل الصفحة افحص هل المستخدم اختار وضع معين قبل كده
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    toggleDarkBtn.textContent = "☀️"; // Light Mode
  } else {
    toggleDarkBtn.textContent = "🌙"; // Dark Mode
  }
});

// ====== HAMBURGER MENU FUNCTIONALITY ======
const hamburgerMenu = document.getElementById("hamburger-menu");
const navMenu = document.getElementById("nav-menu");

// Toggle menu when hamburger is clicked
hamburgerMenu.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  
  // Animate hamburger icon
  const spans = hamburgerMenu.querySelectorAll("span");
  spans.forEach((span, index) => {
    if (navMenu.classList.contains("active")) {
      // Transform to X when menu is open
      if (index === 0) span.style.transform = "rotate(45deg) translate(5px, 5px)";
      if (index === 1) span.style.opacity = "0";
      if (index === 2) span.style.transform = "rotate(-45deg) translate(7px, -6px)";
    } else {
      // Reset to hamburger when menu is closed
      span.style.transform = "none";
      span.style.opacity = "1";
    }
  });
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!hamburgerMenu.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove("active");
    
    // Reset hamburger icon
    const spans = hamburgerMenu.querySelectorAll("span");
    spans.forEach(span => {
      span.style.transform = "none";
      span.style.opacity = "1";
    });
  }
});

// Close menu when window is resized to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    navMenu.classList.remove("active");
    
    // Reset hamburger icon
    const spans = hamburgerMenu.querySelectorAll("span");
    spans.forEach(span => {
      span.style.transform = "none";
      span.style.opacity = "1";
    });
  }
});
