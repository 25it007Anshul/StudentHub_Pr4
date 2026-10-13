/* Practical 04: JavaScript DOM Manipulation & Event Handling */

const themeBtn = document.getElementById('themeBtn');
const themeIcon = themeBtn.querySelector('.theme-icon');
const themeLabel = themeBtn.querySelector('.theme-label');
const menuIcon = document.querySelector('.menu-icon');
const navbar = document.querySelector('.navbar');
const questions = document.querySelectorAll('.question');
const modal = document.getElementById('modal');
const openModalButtons = [document.getElementById('openModal'), document.getElementById('openModalSecondary')];
const closeModal = document.getElementById('closeModal');
const modalDone = document.getElementById('modalDone');
const banner = document.querySelector('.notification');
const closeBanner = document.getElementById('closeBanner');
const slider = document.getElementById('slider');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const imageCount = document.getElementById('imageCount');
const imageCaption = document.getElementById('imageCaption');
const sliderDots = document.querySelectorAll('.slider-dot');
const toast = document.getElementById('toast');

/* FAQ accordion: update the answer and its accessible expanded state. */
questions.forEach((question) => {
  question.addEventListener('click', () => {
    const answer = question.nextElementSibling;
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    question.setAttribute('aria-expanded', String(!isExpanded));
    answer.hidden = isExpanded;
  });
});

/* Modal popup: support both open buttons, close button, backdrop, and Escape. */
function showModal() {
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  closeModal.focus();
}
function hideModal() {
  if (modal.hidden) return;
  modal.hidden = true;
  document.body.style.overflow = '';
  const firstOpenButton = openModalButtons.find((button) => button === document.activeElement);
  (firstOpenButton || openModalButtons[0]).focus();
}
openModalButtons.forEach((button) => button.addEventListener('click', showModal));
closeModal.addEventListener('click', hideModal);
modalDone.addEventListener('click', hideModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) hideModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hideModal();
    closeNavigation();
  }
});

/* Notification banner. */
closeBanner.addEventListener('click', () => {
  banner.hidden = true;
  announce('Welcome message dismissed.');
});

/* Responsive hamburger navigation. */
function closeNavigation() {
  navbar.classList.remove('active');
  menuIcon.setAttribute('aria-expanded', 'false');
  menuIcon.setAttribute('aria-label', 'Open navigation');
}
menuIcon.addEventListener('click', () => {
  const isOpen = navbar.classList.toggle('active');
  menuIcon.setAttribute('aria-expanded', String(isOpen));
  menuIcon.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
navbar.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navbar.querySelectorAll('a').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
    closeNavigation();
  });
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 760) closeNavigation();
});

/* Image slider. All supplied photos are stored beside the HTML file. */
const images = [
  { src: 'image1.jpg', alt: 'A wide green mountain valley beneath a blue sky', caption: 'The quiet mountains' },
  { src: 'image2.jpg', alt: 'Warm sunset over the sea and a sandy beach', caption: 'A golden-hour escape' },
  { src: 'image3.jpg', alt: 'A waterfall flowing through a lush green forest', caption: 'Hidden in the forest' }
];
let currentImage = 0;
function showImage(index) {
  currentImage = (index + images.length) % images.length;
  slider.src = images[currentImage].src;
  slider.alt = images[currentImage].alt;
  imageCaption.textContent = images[currentImage].caption;
  imageCount.innerHTML = `${String(currentImage + 1).padStart(2, '0')} <i>/</i> ${String(images.length).padStart(2, '0')}`;
  sliderDots.forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === currentImage);
    if (dotIndex === currentImage) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
}
nextBtn.addEventListener('click', () => showImage(currentImage + 1));
prevBtn.addEventListener('click', () => showImage(currentImage - 1));
sliderDots.forEach((dot) => dot.addEventListener('click', () => showImage(Number(dot.dataset.slide))));
slider.addEventListener('error', () => {
  slider.alt = 'Image could not be loaded. Check that the image files are beside index.html.';
});

/* Theme switcher: remember the user's preference when storage is available. */
function applyTheme(theme, savePreference = false) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark', isDark);
  themeIcon.textContent = isDark ? '☀' : '☾';
  themeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
  themeBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  document.querySelector('meta[name="theme-color"]').content = isDark ? '#111321' : '#f7f8fc';
  if (savePreference) {
    try { localStorage.setItem('theme', theme); } catch (error) { /* Storage may be disabled. */ }
  }
}
let savedTheme = 'light';
try { savedTheme = localStorage.getItem('theme') || 'light'; } catch (error) { /* Use light mode when storage is unavailable. */ }
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
themeBtn.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(nextTheme, true);
  announce(`${nextTheme === 'dark' ? 'Dark' : 'Light'} mode enabled.`);
});

/* Small accessible status messages for user actions. */
let toastTimer;
function announce(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2300);
}

console.log('Practical 04: DOM Loaded Successfully');
console.log('FAQ, modal, slider, theme switcher, navigation, and notification are ready.');
