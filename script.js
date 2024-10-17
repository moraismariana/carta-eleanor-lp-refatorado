// Slide

let screenWidth = window.innerWidth;
const splideOptions = {
  autoplay: false,
  arrows: true,
  drag: false,
  pauseOnHover: false,
  pagination: false,
  clones: 0,

  interval: 10000,
  speed: 800,
  // type: "loop",
  // rewind: false,
  trimSpace: false,
  omitEnd: true,
  focus: "center",
  // slideFocus: true,
  // updateOnMove: true,
  fixedWidth: "62.5%",
  gap: "28px",

  breakpoints: {
    1024: {
      fixedWidth: "80%",
      gap: "20px",
    },
    768: {
      drag: true,
    },
    480: {
      fixedWidth: "95%",
      gap: "20px",
      arrows: false,
    },
  },
};

new Splide(".splide", splideOptions).mount();

// Dados da API

Promise.all([
  fetch("http://127.0.0.1:8000/indextext/1").then((res) => res.json()),
  fetch("http://127.0.0.1:8000/indeximage/1").then((res) => res.json()),
  fetch("http://127.0.0.1:8000/indexbg/1").then((res) => res.json()),
  fetch("http://127.0.0.1:8000/indexpseudoimage/1").then((res) => res.json()),
]).then(([textos, imagens, backgrounds, pseudoimagens]) => {
  document.getElementById("index-content").classList.add("visible");

  // TEXTOS
  let textAPI = Object.values(textos);
  textAPI.shift();
  let textHTML = document.getElementsByClassName("text");
  for (let i = 0; i < textHTML.length; i++) {
    textHTML[i].innerText = textAPI[i];
  }

  // IMAGENS DO HTML
  let imgAPI = Object.values(imagens);
  imgAPI.shift();
  let imgHTML = document.getElementsByClassName("img");
  for (let i = 0; i < imgHTML.length; i++) {
    imgHTML[i].src = imgAPI[i];
  }

  // BACKGROUNDS
  let bgAPI = Object.values(backgrounds);
  bgAPI.shift();
  let bgHTML = document.getElementsByClassName("bg");
  for (let i = 0; i < bgHTML.length; i++) {
    bgHTML[i].style.backgroundImage = `url(${bgAPI[i]})`;
  }

  // PSEUDOELEMENTOS
  let pseudoimgAPI = Object.values(pseudoimagens);
  pseudoimgAPI.shift();
  let pseudoimgHTML = document.getElementsByClassName("pseudoimg-span");
  for (let i = 0; i < pseudoimgHTML.length; i++) {
    pseudoimgHTML[i].style.backgroundImage = `url(${pseudoimgAPI[i]})`;
  }
});
