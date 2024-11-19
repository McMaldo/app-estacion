console.log("connected")

let chipid = "";
let setActive = (idSelected) => {
	document.querySelectorAll("#stats span").forEach(e => {
		e.id == idSelected ? e.classList.add("active") : e.classList.remove("active")
	})
}
async function getStationData(){
	const response = await fetch("https://mattprofe.com.ar/proyectos/app-estacion/datos.php?chipid="+chipid+"&cant=1")
	const data = await response.json()

	// Agregar nombre y ubicacion de la estacion al doc
	document.querySelector("#heading h1").innerHTML = data[0].estacion
	document.querySelector("#heading h5").innerHTML = '<i class="fas fa-map-marker-alt"></i>'+data[0].ubicacion
	document.querySelector("#graph h5").innerHTML = data[0].fecha

	return data
}


//=======================>Chart

// Vectores de...
let fec = []; // fecha
let tem = []; // temperatura
let hum = []; // humedad
let vie = []; // viento
let fwi = []; // fuego
let pre = []; // presion

let MAX_DATOS = 7;

function checkScreenWidth() {
  if (window.innerWidth > 900) {
    MAX_DATOS = 10;
  }
}
window.addEventListener('resize', checkScreenWidth);
window.addEventListener('load', checkScreenWidth);
checkScreenWidth();

const INTERVAL_REFRESH = 60000;

let dataJsonActual = ""

//botones 0: texto, 1: dibujo
let btnControls = [
	["temperatura", '<i class="fas fa-thermometer-full color-temperatura"></i>'],
	["fuego", '<i class="fas fa-fire color-fuego"></i>'],
	["humedad", '<i class="fas fa-tint color-humedad"></i>'],
	["viento",'<i class="fas fa-wind color-viento"></i>' ],
	["presion",'<i class="fas fa-arrow-circle-down color-presion"></i>']
]

// Pestaña visible
let sectionVisible = ""

// Objeto que contiene el gráfico
let myChart = null


// Incrementa las visitas en una estacion especifica
async function addVisitStation(){
	const response = await fetch("https://mattprofe.com.ar/proyectos/app-estacion/datos.php?chipid=" + chipid + "&mode=visit-station")
	const data = await response.json()
	return data
}

// Hace la peticion asincrona al archivo php y recupera el Json con los datos
// =================================
async function refreshDatos(cantfilas){
	const response = await fetch("https://mattprofe.com.ar/proyectos/app-estacion/datos.php?chipid=" + chipid + "&cant=" + cantfilas)
	const data = await response.json()

	dataJsonActual = data

	procesar(data)
}

// Analiza el json, carga los valores y el gráfico
// =================================
function procesar(datos, addData = true){

	let hora = ""

	console.log("Filas Json: " + datos.length);

	if(addData == true){
		// Recorremos el Json pero al reves. datos viejos a la izquierda nuevos derecha
		for (let i = datos.length-1; i >= 0; i--) {

			console.log("Vigia Json [" + i + "]" + datos[i].fecha);

			hora = datos[i].fecha.split(" ")[1]

			// Carga de vectores para generar el gráfico
			fec.push(hora.split(":")[0]+":"+hora.split(":")[1]);
			tem.push(datos[i].temperatura);
			hum.push(datos[i].humedad);
			vie.push(datos[i].viento);
			fwi.push(datos[i].fwi);
			pre.push(datos[i].presion);
		}

		// Elimina los ultimos datos de los vectores si el último fec es igual al anteúltimo.
		if(fec[fec.length-1] == fec[fec.length-2]){
			fec.splice(fec.length-1,1);
			hum.splice(fec.length-1,1);
			tem.splice(fec.length-1,1);
			vie.splice(fec.length-1,1);
			fwi.splice(fec.length-1,1);
			pre.splice(fec.length-1,1);
		}else{ // Elimina el primer dato de los vectores
			fec.splice(0,1);
			hum.splice(0,1);
			tem.splice(0,1);
			vie.splice(0,1);
			fwi.splice(0,1);
			pre.splice(0,1);
		}
		
	}
	
	// Carga de los datos

	// Seccion de Temperatura
	// =================================
	document.querySelector("#btn-temperatura .stat-int").innerHTML = datos[0].temperatura.split(".")[0];
	document.querySelector("#btn-temperatura .stat-dec").innerHTML = datos[0].temperatura.split(".")[1];

	document.querySelector("#temp-val-int").innerHTML = datos[0].temperatura.split(".")[0]
	document.querySelector("#temp-val-dec").innerHTML = "."+datos[0].temperatura.split(".")[1]

	
	document.querySelector("#temp-max").innerHTML = datos[0].tempmax + "ºC"
	document.querySelector("#temp-min").innerHTML = datos[0].tempmin + "ºC"

	document.querySelector("#sens-val-int").innerHTML = datos[0].sensacion.split(".")[0]
	document.querySelector("#sens-val-dec").innerHTML = "."+datos[0].sensacion.split(".")[1]

	document.querySelector("#sen-max").innerHTML = datos[0].sensamax + "ºC"
	document.querySelector("#sen-min").innerHTML = datos[0].sensamin + "ºC"

	// Seccion de Fuego
	// =================================
	document.querySelector("#btn-fuego .stat-int").innerHTML = datos[0].fwi.split(".")[0]//fireDanger(datos[0].fwi)
	document.querySelector("#btn-fuego .stat-dec").innerHTML = datos[0].fwi.split(".")[1]

	document.querySelector("#ffmc").innerHTML = datos[0].ffmc  
	document.querySelector("#dmc").innerHTML = datos[0].dmc  
	document.querySelector("#dc").innerHTML = datos[0].dc  
	document.querySelector("#isi").innerHTML = datos[0].isi 
	document.querySelector("#bui").innerHTML = datos[0].bui  
	document.querySelector("#fwi").innerHTML = datos[0].fwi 

	// Seccion humedad
	// =================================
	document.querySelector("#btn-humedad .stat-int").innerHTML = datos[0].humedad.split(".")[0];
	document.querySelector("#btn-humedad .stat-dec").innerHTML = datos[0].humedad.split(".")[1];

	//humedad__val__int.innerHTML = datos[0].humedad.split(".")[0]
	//humedad__val__dec.innerHTML = "." + datos[0].humedad.split(".")[1]

	// Seccion viento
	// =================================
	document.querySelector("#btn-viento .stat-int").innerHTML = datos[0].viento.split(".")[0];
	document.querySelector("#btn-viento .stat-dec").innerHTML = datos[0].viento.split(".")[1];
	//viento__val__int.innerHTML = datos[0].viento.split(".")[0];
	//viento__val__dec.innerHTML = "." + datos[0].viento.split(".")[1];

	// dirección del viento en visor
	//viento__val__veleta.innerHTML = datos[0].veleta;

	// botón dirección del viento
	//viento__direccion.innerHTML = datos[0].veleta

	//viento__max.innerHTML = datos[0].maxviento.split(".")[0] + "Km/H";

	// Seccion de Presión
	// =================================
	document.querySelector("#btn-presion .stat-int").innerHTML = datos[0].presion.split(".")[0];
	document.querySelector("#btn-presion .stat-dec").innerHTML = datos[0].presion.split(".")[1];

	// display
	//presion__val__int.innerHTML = datos[0].presion.split(".")[0]
	//presion__val__dec.innerHTML = "." + datos[0].presion.split(".")[1]

	// Gráfico
	// =================================
	let itemsGrafico = ""
	switch(sectionVisible){
	case "temperatura":
		itemsGrafico = [{
			label: 'Temperatura',
			borderColor: '#ffbf69',
			data: tem
		}]
		break;
	case "humedad":
		itemsGrafico = [{
			label: 'Humedad',
			borderColor: '#00bbf9',
			data: hum
		}]
		break;
	case "viento":
		itemsGrafico = [{
			label: 'Viento',
			borderColor: '#e0fbfc',
			data: vie
		}]
		break;
	case "presion":
		itemsGrafico = [{
			label: 'Presion',
			borderColor: '#6ee55d',
			data: pre
		}]
		break;
	default:
		itemsGrafico = [{
			label: 'FWI',
			borderColor: '#ec512b',
			data: fwi
		}]
		break;
	}	

	// invocamos a la funcion que carga y actualiza los datos en el gráfico
	renderCharts(datos[0].ubicacion, fec, itemsGrafico);
}

// renderizamos el gráfico
// =================================
function renderCharts(estacion, fecha, itemsGrafico){
	// si el objeto gráfico ya esta instanciado lo destruyo para que se vuelva a crear limpio
	if(myChart!=null){
        myChart.destroy();
    }

	const ctx= document.querySelector("#myChart").getContext("2d")

	myChart= new Chart(ctx, {
	type: "line",
	data:{
		labels: fecha,
		datasets: itemsGrafico
		},
		options: {
			/*title: {
				display: true,
				text: 'Estacion #' + estacion,
				fontSize: 30,
				padding: 30,
				fontColor: 'black'
			},*/
			scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true,
	                    fontColor: 'white'
	                },
	            }],
	         	xAxes: [{
	                ticks: {
	                    fontColor: 'white'
	                },
	            }]
	        } ,
			legend: {
				display: false,
				position: 'top',
				labels: {
					padding: 15,
					boxWidth: 40,
					fontFamily: 'system-ui',
					fontColor: 'white',
				}
			},
			tooltips: {
				backgroundColor: '#0584f6',
				titleFontSize: 20,
				xPadding: 20,
				yPadding: 20,
				mode: 'index', 
			},
			elements: {
				
				line: {
					borderWidth: 2,
					fill: false,
				},
				point: {
					radius: 6,
					borderWidth: 4,
					backgroundColor: 'white',
					hoverRadius: 8,
					hoverRadiusWidth: 4,	
				}
			},
			animation: {
				duration: 0
			},
			responsiveAnimationDuration: 0,
			responsive: true,
			maintainAspectRatio: false
		}
	})

	// actualiza el contenido del gráfico si lo estamos usando sin destruir en cada ocasión
	//myChart.update()
}

// Retorna el peligro de incendio con una frase
// =================================
function fireDanger(fwi){
	let fwiFloat = parseFloat(fwi)
	
	if(fwiFloat>=50){
		return "Extremo"
	}else{
		if(fwiFloat>=38){
			return "Muy alto"
		}else{
			if(fwiFloat>=21.3){
				return "Alto"
			}else{
				if(fwiFloat>=11.2){
					return "Moderado"
				}else{
					if(fwiFloat>=5.2){
						return "Bajo"
					}else{
						return "Muy bajo"
					}
				}
			}
		}
	}
}
//=======================>Chart


// Evento que se ejecuta cuando se carga la pagina totalmente
// =================================
document.addEventListener("DOMContentLoaded", function(event){

	// buscamos el chipid
	chipid = window.location.href.split("?chipid=")[1];
	console.log("Web Cargada para el chipid: " + chipid);

	// Incrementa las visitas de esta estacion
	// addVisitStation();

	getStationData();

	// primer carga de 6 datos
	refreshDatos(MAX_DATOS);

	// si es un chip mio recarga cada 10 seg y con 1 solo dato nuevo
	refreshId = setInterval(refreshDatos, INTERVAL_REFRESH, 1);
	console.log("Refresco cada "+INTERVAL_REFRESH+" seg.");

	// inicializa la ventana mostrando la pestaña por defecto
	btnControls.forEach(function(btn, i){			
		if(btn[0]=="temperatura"){
			sectionVisible = btn[0]
			document.querySelector("#title-sub").innerHTML = btn[1] + '&nbsp' + btn[0].toUpperCase()
			document.querySelector("#panel-container-" + btn[0]).setAttribute("style", "display: grid;")
			
		}else{
			document.querySelector("#panel-container-" + btn[0]).setAttribute("style", "display: none;")
			
		}
	})
	
	// Carga en todos los botones de control el evento que hará que se muestre la pestaña correcta
	btnControls.forEach(function(element, index){
		document.querySelector( "#btn-" + element[0] ).addEventListener("click", event => {

			event.preventDefault()

			document.querySelector("#title-sub").innerHTML = element[1] + '&nbsp' + element[0].toUpperCase()

			if(element[0] != "temperatura" && element[0] != "viento"){
				document.querySelector("#title-sub").setAttribute("style", "display: visible;")
			}else{
				document.querySelector("#title-sub").setAttribute("style", "display: none;")
			}

			// Muestra la pestaña seleccionada y oculta las otras
			btnControls.forEach(function(btn, i){
				
				if(btn[0]==element[0]){
					sectionVisible = btn[0]
					document.querySelector("#panel-container-" + btn[0]).setAttribute("style", "display: grid;")

				}else{
					document.querySelector("#panel-container-" + btn[0]).setAttribute("style", "display: none;")
			
				}
			})

			console.log(sectionVisible)

			procesar(dataJsonActual, false)
		})
	})
})

// set nav button ::after
document.querySelectorAll("#stats span").forEach(e => {
	e.addEventListener("click", () => setActive(e.id))
})