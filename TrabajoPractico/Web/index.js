// Import stylesheets
import './style.css';

// Import my libraries
import * as ml from './my_library';

// Write Javascript code!
const appDiv = document.getElementById('app');
const introDiv = document.getElementById('intro');
const headerDiv = document.getElementById('header');
const contSectorDiv = document.getElementById('contaminacion_sector');
const contPaisDiv = document.getElementById('contaminacion_pais');
const conclusionesDiv = document.getElementById('conclusiones');

headerDiv.innerHTML = `
  <h1 class="main-title">Contaminación Mundial</h1>
  <h4 class="main-autor">Nombre: Abel Parra</h3>
  <h4 class="main-url">Url: <a href="https://js-hhb4ht.stackblitz.io/">https://js-hhb4ht.stackblitz.io/</a></h3>
  <h4 class="main-url">Repositorio: <a href="https://github.com/aparra4169/Visualizacion-de-Datos/tree/main/TrabajoPractico">Github</a></h3>
  <h4 class="main-fuente">Fuente: <a href="https://www.kaggle.com/diegoandresm/global-warmingpollution-by-economic-sector">https://www.kaggle.com/diegoandresm/global-warmingpollution-by-economic-sector</a></h3>
  <h4 class="main-fecha">Fecha: 21/11/2021</h4>
  <br>
  <br>
`;

introDiv.innerHTML = `
  <!-- add intro text to the page body -->
  <div class="summary">
      <h2 class="text-title">Resumen</h2>
      <div class="text">
          <p>Este documento tiene como objetivo crear una visualización de la contaminación a nivel mundial dividido por países, año y por sector industrial. El dataset utilizado ha sido extraído de <a href="https://www.kaggle.com/diegoandresm/global-warmingpollution-by-economic-sector">kaggle</a> y procesado posteriormente para descartar las columnas que no son de utilidad para este fin.</p>

          <p>A través de estos datos se pretende mostrar la evolución de la contaminación mundial a lo largo de los años y como está ha incrementado en mayor o menor medida con respecto a años anteriores, además de facilitar una visualización clara de cómo los países han ido tomando conciencia o no de este problema y si han ido reduciendo sus emisiones de CO2.</p>

          <div class="metadato  " >
            <p>La audiencia es el público en general y especialmente los alumnos de la asignatura de Visualización de datos. El objetivo consiste es realizar un ejemplo sobre un pequeño trabajo práctico de visualización de datos aplicando algunas técnicas y herramientas aprendidas durante la asignatura.</p>
          </div>
      </div>
  </div>
`;

contSectorDiv.innerHTML = `
  <h2 class="plot-title">Contaminación por sector industrial</h2>
  <div class="text">
       <p>Para esta primera parte donde se quiere mostrar la contaminación por sector industrial se ha optado por un gráfico de áreas apiladas y un treemap. El primero se ha escogido para dar visibilidad a la evolución a lo largo de los años de la contaminación en cada uno de los sectores y como han contribuido a la contaminación total. Así se observa que desde principios del siglo XX el sector del carbón era prácticamente el único contaminante y como otros como el petróleo y el gas han ido apareciendo a mediados de siglo hasta quedarse hoy en día estos tres copando la mayor parte de las emisiones de CO2.</p>

        <p>Por otra parte se ha usado el treemap para hacer una fotografía del porcentaje de la acumulación de emisiones de cada uno de los sectores sobre el total desde el año 2010. Pudiendo así reafirmar que hay 3 sectores que acaparan alrededor del 94% de las emisiones de CO2.</p>
  </div>  
  <div id="vizSectorIndustrial_1"></div>
  <div id="vizSectorIndustrial_2"></div>
`;

contPaisDiv.innerHTML = `
  <h2 class="plot-title">Contaminación por país</h2>
  <div class="text">
    <p>Para este segundo apartado se ha optado por un mapa de símbolos proporcionales donde visualizar las emisiones de CO2 de los 10 países más contaminantes a lo largo de los años. Para poder ver esta evolución se ha añadido un control "slider" donde se pueden ir seleccionando los años desde 1945 hasta 2019.</p>
  </div>  
  <div class="slidecontainer">
    <input type="range" name="rangeInput" min="1945" value="2000" max="2019" class="slider" id="range_years">
  </div>
  <br/>
  <div id="vizPais"></div>
`;

conclusionesDiv.innerHTML = `
  <h2 class="text-title">Conclusiones</h2>
  <div class="text">
      <p>Con los datos expuestos se pueden extraer dos conclusiones. La primera es como otras fuentes de energía como el petróleo o el gas han ido ganando fuerza frente al carbón a medida que avanzaba el siglo. Esto es debido a que a finales de siglo XIX y primeros del XX el carbón era una de las principales fuentes de energía ya sea para generación eléctrica como para vehículos a motor.</p>

      <p>En cuanto a la contaminación por países, se observa como E.E.U.U. ha estado siempre a la cabeza de la contaminación mundial y como en este último siglo la industrialización de China lo ha desbancado de este puesto.</p>
  </div>
`;

var csvDatasetPath =
  'https://raw.githubusercontent.com/aparra4169/Visualizacion-de-Datos/main/TrabajoPractico/Datasets/final_dataset.csv';

var csvCountriesPath =
  'https://raw.githubusercontent.com/aparra4169/Visualizacion-de-Datos/main/TrabajoPractico/Datasets/countries.csv';

var year = 2000;
ml.setYearFilter(year);
ml.loadData(csvCountriesPath, csvDatasetPath);

/*Slider*/
var range_year = document.getElementById('range_years');
range_year.value = year;

range_year.addEventListener('input', function (val) {
  ml.setYearFilter(val.target.value);
  ml.drawGraphsPoint2(false);
});
