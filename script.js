'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");


const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn)=>btn.addEventListener('click',openModal))

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////////////////////////
//Page navigation 

btnScrollTo.addEventListener("click", function(e){
  const s1coords = section1.getBoundingClientRect();

  section1.scrollIntoView({behavior:"smooth"})
});



//Second way to add the event listener to the navbar
document.querySelector('.nav__links').addEventListener('click', function(e){
  console.log(e.target);
  e.preventDefault();
  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
    console.log("link");
  }
})

/////////////////////////////////////////////////////
//Tabbed Component 


tabsContainer.addEventListener('click',function(e){
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  if(!clicked) return;
  tabs.forEach(t=>t.classList.remove('operations__tab--active'));
  clicked.classList.add("operations__tab--active");
  //activate the content area 
  console.log(clicked.dataset.tab);
  console.log(document.querySelector(`.operations__content--2`));
  tabsContent.forEach((tc)=> tc.classList.remove("operations__content--active"));
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active");
})

/////////////////////////////////////////////////////
//Menu fade away 
const handleHover = function(e){
	if(e.target.classList.contains('nav__link')){
		const link = e.target;
		const siblings = link.closest(".nav").querySelectorAll('.nav__link');
		const logo = link.closest(".nav").querySelector("img");
		siblings.forEach((li)=>{
		  if(li!==link){
			li.style.opacity = this;
		  }
		});
		logo.style.opacity = this;
	}
}


nav.addEventListener("mouseover", handleHover.bind(0.5));

nav.addEventListener("mouseout", handleHover.bind(1))

/////////////////////////////////////////////////////
//Sticky nav bar 

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
}
const stickyNav = function (entries){
  const [entry] = entries;
  if(!entry.isIntersecting){
    nav.classList.add('sticky');
  } 
  else {
    nav.classList.remove('sticky');
  }
}
const headerObserver = new IntersectionObserver(stickyNav, obsOptions);
headerObserver.observe(header);

////////////////////////////////////////////////////
//Reveal sections 


const revealSection = function (entries, observer){
  const [entry] = entries;
  console.log(entry);
  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root:null,
  threshold: 0.15,
});

const allSections = document.querySelectorAll(".section");
allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//Lazy loading of the images 
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load',function(){
    entry.target.classList.remove("lazy-img");
  })
  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 1
});

imgTargets.forEach(img=> imgObserver.observe(img));

/////////////////////////////////////////////////////
//Slider 

const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

let currentSlide = 0;
const maxSlide = slides.length;

//functions 
const createDots = function (){
  slides.forEach((_,i)=>{
    dotContainer.insertAdjacentHTML("beforeend", `<button class="dots__dot" data-slide="${i}"></button>`);
  })
}

const activateDot = function(slide){
  document.querySelectorAll(".dots__dot").forEach((dot)=>dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add("dots__dot--active");
}

const goToSlide = function (slide){
  slides.forEach((s,i)=>(s.style.transform = `translateX(${100*(i-slide)}%)`));
}

const nextSlide = function(){
  if(currentSlide === maxSlide-1){
    currentSlide = 0;
  } else{
    currentSlide++;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
}

const previousSlide = function(){
  if(currentSlide === 0){
    currentSlide = maxSlide - 1;
  }else{
    currentSlide--;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
}

//Event Handlers 

btnRight.addEventListener('click',nextSlide);
btnLeft.addEventListener('click',previousSlide);

document.addEventListener("keydown",function(e){
  e.key === 'ArrowRight' && nextSlide();
  e.key === 'ArrowLeft' && previousSlide();
})


dotContainer.addEventListener('click',function(e){
  if(e.target.classList.contains("dots__dot")){
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
})


const init = function(){
  goToSlide(0);
  createDots();
  activateDot(0);
}
init();

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////


document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
