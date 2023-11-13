const form = document.querySelector('form'); 
const resultDiv = document.querySelector('#results');

form.addEventListener('submit', handleSubmit);

async function handleSubmit(e) {
  e.preventDefault(); 
  if (form.location.value === "") return;
  
  const location = form.location.value.replace("", "+");

  const originalJson = await hitAPI(location);
  const processedJson = processData(originalJson);

  console.clear();
  console.log(originalJson);
  
  render(processedJson);
}

function render(json) {
  console.log(json);
  console.log("Weather for:");
  console.log(`${json.location.name}, ${json.location.country} ${json.location.region}`);
  console.log(`Current temperature: ${json.current.temp_c}C / ${json.current.temp_f}F`);
  console.log(`icon: ${json.current.iconURL}`);
  for (const hour of json.hour) {
    console.log(`Hour: ${hour.time.slice(-5)}, temp: ${hour.temp_c}C / ${hour.temp_f}F`);
  }

  while (resultDiv.firstChild) {
    resultDiv.removeChild(resultDiv.firstChild);
  }

  const p1 = createPara(`Location: ${json.location.name}, ${json.location.country}`);
  const p2 = createPara(`Temperature now: ${json.current.temp_c}C / ${json.current.temp_f}F`);
  const hourColumns = document.createElement("div");
  hourColumns.className = "hourly";
  
  for (const [idx, hour] of json.hour.entries()) {
    if (idx % 3 === 0) {
      const hourDiv = document.createElement("div");
      const hourPara1 = createPara(hour.temp_c);
      const hourPara2 = createPara(hour.time.slice(-5));
      hourDiv.appendChild(hourPara1);
      hourDiv.appendChild(hourPara2);
      hourColumns.appendChild(hourDiv);
    }
  }

  resultDiv.appendChild(p1);
  resultDiv.appendChild(p2);
  resultDiv.appendChild(hourColumns);
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
    precip: json.current.precip_mm,
    text: json.current.condition.text,
    iconURL: json.current.condition.icon,
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
    obj.text = hour.condition.text;
    obj.iconURL = hour.condition.iconURL;
    return obj;
  });

  return object;
}

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
