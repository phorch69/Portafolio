//import '/index.css' esto da error solo funciona en html
//import javascriptLogo from '/javascript.svg'
//import viteLogo from '/public/vite.svg'
//import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <div class="siderbar">
      <div class="top">
        <div class="">
          <i class=""></i>
          <span>Phorch69</span>
        </div>
      </div>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
      <div class="social-media-icons">
        <a href="#"><i class="fa fa-Instagram">Instagram</i></a>
        <a href="#"><i class="fa fa-Youtube">Youtube</i></a>
        <a href="#"><i class="fa fa-Github">Github</i></a>
        <a href="#"><i class="fa fa-Linkedin">Linkedin</i>
      </div>
    </div>
    
      <label for="seccion-1-box">Mostrar sección 1</label>
      <label for="seccion-2-box">Mostrar sección 2</label>

      <input type="radio" name="pestana" id="seccion-1-box" role="button" />
      <input type="radio" name="pestana" id="seccion-2-box" role="button" />

      <section id="seccion-1">Soy la sección 1</section>
      <section id="seccion-2">Soy la sección 2</section>
  </div>
`

//setupCounter(document.querySelector('#counter'))

/*    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${viteLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>*/