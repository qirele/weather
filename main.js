const form = document.querySelector('form'); 
const resultDiv = document.querySelector('#results');

form.addEventListener('submit', handleSubmit);

async function handleSubmit(e) {
  e.preventDefault(); 
  if (form.location.value === "") return;
  
  const location = form.location.value.replace("", "+");

  const responseJson = await hitAPI(location);
  console.clear();
  console.log(responseJson);
  const json = processData(responseJson);

  console.log("Weather for:");
  console.log(`${json.location.name}, ${json.location.country} ${json.location.region}`);
  console.log("Current temperature:");
  console.log(`${json.current.temp_c}C or ${json.current.temp_f}F`);
  for (const hour of json.hour) {
    console.log(`Hour: ${hour.time}, temp: ${hour.temp_c}C/${hour.temp_f}F`);
  }
}

async function hitAPI(location) { // this returns a promise
  const URL = `http://api.weatherapi.com/v1/forecast.json?key=b8981b263931411ba6b211548230111&q=${location}&days=1&aqi=no&alerts=no`;
  const response = await fetch(URL);
  const json = await response.json();
  return json;
}

// function that processes json and returns object with only the data that app needs
function processData(json) {
  const object = {};
  object.current = {
    temp_c: json.current.temp_c,
    temp_f: json.current.temp_f,
    precip: json.current.precip_mm ,
  };

  object.location = {
    name: json.location.name,
    country: json.location.country,
    region: json.location.region
  };

  object.hour = json.forecast.forecastday[0].hour.map(hour => {
    const obj = {};
    obj.temp_c = hour.temp_c;
    obj.temp_f = hour.temp_f;
    obj.precip = hour.precip_mm;
    obj.time = hour.time;
    return obj;
  });

  return object;
}


// async function handleSubmit(e) {
//   e.preventDefault();
//   if (form.location.value === "") return;
//
//   try {
//     const response = await fetch(URL)
//     const json = await response.json();
//     console.log(json);
//     jsonData = json;
//
//     while (resultDiv.firstChild) {
//       resultDiv.removeChild(resultDiv.firstChild);
//     }
//
//     if (json.error) {
//       console.log(json.error.message);
//       resultDiv.appendChild(createPara(`Error: ${json.error.message}`));
//       return;
//     }
//
//     resultDiv.appendChild(createPara(`Location name: ${json.location.name}`));
//     resultDiv.appendChild(createPara(`Location country: ${json.location.country}`));
//     resultDiv.appendChild(createPara(`Location region: ${json.location.region}`));
//
//     if (json.current.temp_c > 20) {
//       resultDiv.appendChild(createPara(`temperature: ${json.current.temp_c}C (too hot)`));
//       resultDiv.appendChild(createImg("./imgs/sunhot.jpg"));
//     } else {
//       resultDiv.appendChild(createPara(`temperature: ${json.current.temp_c}C (too cold)`));
//       resultDiv.appendChild(createImg("./imgs/coldasheck.jpg"));
//     }
//
//     resultDiv.appendChild(createPara(`Humidity: ${json.current.precip_mm}mm`));
//     resultDiv.appendChild(createPara(`Condition: ${json.current.condition.text}`));
//     resultDiv.appendChild(createImg(json.current.condition.icon));
//
//   } catch (err) {
//     console.log(`Something went wrong in fetching: ${err}`);
//   }
// }

function createPara(str) {
  const p = document.createElement('p');
  p.textContent = str;
  return p;
}

function createImg(url) {
  const img = document.createElement("img");
  img.src = url;
  return img;
}
