let controller;
let slideScene;
let pageScene;
let detailScene;
// http://scrollmagic.io/docs/animation.GSAP.html
function animateSlides() {
  controller = new ScrollMagic.Controller();
  const sliders = document.querySelectorAll('.slide');
  const nav = document.querySelector('.nav-header');

  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector('.reveal-img');
    const img = slide.querySelector('img');
    const revealText = slide.querySelector('.reveal-text');

    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: 'expo.inOut' },
    });
    slideTl.fromTo(revealImg, { x: '0%' }, { x: '100%' });
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, '-=1');
    slideTl.fromTo(revealText, { x: '0%' }, { x: '200%' }, '-=0.75');
    //Create Scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slideTl)
      // .addIndicators({
      //   colorStart: '#fff',
      //   colorTrigger: '#fff',
      //   name: 'slide',
      // })
      .addTo(controller);

    const pageTl = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
    pageTl.fromTo(nextSlide, { y: '0%' }, { y: '50%' });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: '50%' }, { y: '0%' }, '-=0.5');
    //Create new scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: '100%',
      triggerHook: 0,
    })
      // .addIndicators({
      //   colorStart: '#fff',
      //   colorTrigger: '#fff',
      //   name: 'page',
      //   indent: 100,
      // })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
}
const mouse = document.querySelector('.cursor');
const mouseTxt = mouse.querySelector('span');
const menu = document.querySelector('.menu');
function cursor(e) {
  mouse.style.top = e.pageY + 'px';
  mouse.style.left = e.pageX + 'px';
}
function activeCursor(e) {
  const item = e.target;
  if (item.id === 'logo' || item.classList.contains('menu')) {
    mouse.classList.add('nav-active');
  } else {
    mouse.classList.remove('nav-active');
  }
  if (item.classList.contains('experience')) {
    mouse.classList.add('experience-active');
    gsap.to('.title-swipe', 1, { y: '0%' });
    mouseTxt.innerText = 'Experience';
  } else {
    mouse.classList.remove('experience-active');
    mouseTxt.innerText = '';
    gsap.to('.title-swipe', 1, { y: '100%' });
  }
}
function navToggle(e) {
  if (!e.target.classList.contains('active')) {
    e.target.classList.add('active');
    gsap.to('.line1', 0.5, { rotate: '45', y: 5, background: 'black' });
    gsap.to('.line2', 0.5, { rotate: '-45', y: -5, background: 'black' });
    gsap.to('#logo', 1, { color: 'black' });
    gsap.to('.nav-bar', 1, { clipPath: 'circle(2500px at 100% -10%)' });
    document.body.classList.add('hide');
  } else {
    e.target.classList.remove('active');
    gsap.to('.line1', 0.5, { rotate: '0', y: 0, background: '#fff' });
    gsap.to('.line2', 0.5, { rotate: '0', y: 0, background: '#fff' });
    gsap.to('#logo', 1, { color: '#fff' });
    gsap.to('.nav-bar', 1, { clipPath: 'circle(50px at 100% -10%)' });
    document.body.classList.remove('hide');
  }
}

// Page Transitions
const logo = document.querySelector('#logo');
barba.init({
  views: [
    {
      namespace: 'home',
      beforeEnter() {
        animateSlides();
        logo.href = './index.html';
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: 'dream',
      beforeEnter() {
        logo.href = '../index.html';
        detailAnimation();
      },
      beforeLeave() {
        controller.destroy();
        detailScene.destroy();
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();

        const tl = gsap.timeline({ defaults: { ease: 'expo.inOut' } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          '.swipe',
          0.2,
          { x: '-100%' },
          { x: '0%', onComplete: done },
          '-=0.5'
        );
      },
      enter({ current, next }) {
        let done = this.async();

        window.scrollTo(0, 0);

        const tl = gsap.timeline({ defaults: { ease: 'expo.inOut' } });
        tl.fromTo(
          '.swipe',
          1,
          { x: '0%' },

          { x: '100%', stagger: 0.2, onComplete: done }
        );
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
        tl.fromTo(
          '.nav-header',
          1,
          { y: '-100%' },
          { y: '0%', ease: 'expo.inOut' },
          '-=1.5'
        );
      },
    },
  ],
});

//EventListeners
menu.addEventListener('click', navToggle);
window.addEventListener('mousemove', cursor);
window.addEventListener('mouseover', activeCursor);
