//Variables Globales
var global_data;
var global_countries;
var global_year_filter;
var global_map = new d3plus.Geomap();

export function setYearFilter(year) {
  global_year_filter = year;
}

/*
 * Agrupar datos para la gráfica del apartado 1: agrupar por año
 */
function getGroupedVis1(data, columns) {
  var result = [];
  var temp = [];
  var grouped;

  columns.forEach(function (column, indice, array) {
    grouped = d3
      .nest()
      .key(function (d) {
        // Agrupar por "groupBy"
        return d['year'];
      })
      .rollup(function (v) {
        // Sumar "column" de cada grupo resultado
        v = v.filter((d) => d.iso_code != '0');
        return [
          {
            x: +v[0].year,
            id: column,
            y: d3.sum(v, function (d) {
              return d[column];
            }),
          },
        ];
      })
      .entries(data);

    temp = grouped.map((d) => d.values[0]);
    if (result.length == 0) {
      result = temp;
    } else {
      result = result.concat(temp);
    }
  });
  return result;
}

/*
 * Carga localización de paises de csv y una vez cargado llama a la función que carga el dataset y pinta las gráficas
 */
export function loadData(csvCountriesPath, csvDatasetPath) {
  d3.csv(
    csvCountriesPath,
    (d) => {
      //Transformar datos
      return {
        iso_code: d['Alpha-3 code'],
        latitude: d['Latitude (average)'],
        longitude: d['Longitude (average)'],
        country: d['Country'],
      };
    },
    (data) => {
      //Filtrar caracteres NO alfanuméricos en iso_code
      data = data.map(function (d) {
        d.iso_code = d.iso_code.replace(/[^A-Za-z0-9]/g, '');
        d.latitude = parseFloat(d.latitude.replace(/[^A-Za-z0-9.-]/g, ''));
        d.longitude = parseFloat(d.longitude.replace(/[^A-Za-z0-9.-]/g, ''));
        d.country = d.country;
        return d;
      });
      loadDataset(data, csvDatasetPath);
    }
  );
}

/*
 * Carga dataset
 */
function loadDataset(countries, csvDatasetPath) {
  d3.csv(
    csvDatasetPath,
    (d) => {
      //Transformar datos
      return {
        iso_code: d.iso_code,
        year: +d.year,
        coal: +d.coal_co2,
        cement: +d.cement_co2,
        oil: +d.oil_co2,
        gas: +d.gas_co2,
        flaring: +d.flaring_co2,
        other_industry: +d.other_industry_co2,
        co2: +d.co2,
      };
    },
    (data) => {
      // Graficar
      drawGraphsPoint1(data);
      global_data = data;
      global_countries = countries;
      drawGraphsPoint2(true);
    }
  );
}

/*
 * Dibujar gráficas del apartado 1 de la página
 */
function drawGraphsPoint1(data) {
  //Agrupar datos
  var new_data = getGroupedVis1(data, [
    'coal',
    'flaring',
    'gas',
    'oil',
    'other_industry',
    'cement',
  ]);

  //Gráfica 1: Gráfico de áreas agrupado desde 1920
  var filt1 = new_data.filter((d) => d.x >= 1920); //Filtro por año
  var g1 = new d3plus.StackedArea()
    .data(filt1)
    .groupBy('id')
    .select('#vizSectorIndustrial_1');

  g1.title('Evolución de las emisiones de CO2 por sector');
  g1.titleConfig({
    ariaHidden: true,
    fontSize: 16,
    padding: 0,
    resize: false,
    textAnchor: 'middle',
  });
  g1.render();

  //Gráfica 2: Tree map de la última década
  var filt2 = new_data.filter((d) => d.x >= 2010); //Filtro por año
  var g2 = new d3plus.Treemap()
    .data(filt2)
    .groupBy('id')
    .sum('y')
    .select('#vizSectorIndustrial_2');

  g2.title('Total de emisiones desde 2010 por sector');
  g2.titleConfig({
    ariaHidden: true,
    fontSize: 16,
    padding: 0,
    resize: false,
    textAnchor: 'middle',
  });
  g2.render();
}

/*
 * Dibujar gráficas del apartado 2 de la página
 */
export function drawGraphsPoint2(first_call) {
  var data = global_data;
  var countries = global_countries;
  //Filtrar últimos 30 años
  data = data.filter(
    (d) =>
      d.year == global_year_filter &&
      d.iso_code != 0 &&
      d.iso_code != 'OWID_WRL' &&
      d.co2 > 0
  );
  //Ordenar de mayor a menor por emisiones de CO2
  data.sort((a, b) => (a.co2 > b.co2 ? -1 : b.co2 > a.co2 ? 1 : 0));
  data = data.slice(0, 10);

  //Combinar el dataset de paises y el de datos co2.
  var result = [
    ...[data, countries]
      .reduce(
        (m, a) => (
          a.forEach(
            (o) =>
              (m.has(o.iso_code) && Object.assign(m.get(o.iso_code), o)) ||
              m.set(o.iso_code, o)
          ),
          m
        ),
        new Map()
      )
      .values(),
  ];
  //Dibujar
  if (first_call == true) {
    global_map
      .data(result)
      .groupBy('iso_code')
      .colorScale('co2')
      .colorScaleConfig({
        color: ['#ffbaba', '#ff7b7b', '#ff5252', '#ff0000', '#a70000'],
      })
      .pointSize(function (d) {
        return d.co2;
      })
      .pointSizeMax(20)
      .pointSizeMin(7)
      .label(function (d) {
        return d.country + ': ' + (d.co2 / 1000000).toFixed(2) + 'M';
      })
      .point(function (d) {
        return [d['longitude'], d['latitude']];
      })
      .width(1000)
      .height(700)
      .title(
        'Top 10 de paises que más CO2 emitieron en el año ' + global_year_filter
      )
      .titleConfig({
        ariaHidden: true,
        fontSize: 16,
        padding: 0,
        resize: false,
        textAnchor: 'middle',
      })
      .legend(false)
      .zoom(false)
      .select('#vizPais')
      .render();
  } else {
    global_map
      .data(result)
      .title(
        'Top 10 de paises que más CO2 emitieron en el año ' + global_year_filter
      )
      .render();
  }
}
