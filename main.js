const form = document.querySelector('form'); 
const resultDiv = document.querySelector('#results');

let renderCelcius = true;

form.addEventListener('submit', handleSubmit);

async function handleSubmit(e) {
  e.preventDefault(); 
  if (form.location.value === "") return;
  
  const location = form.location.value.replace("", "+");

  const originalJson = await hitAPI(location);
  const processedJson = processData(originalJson);

  console.clear();
  console.log(originalJson);
  console.log(processedJson);
  
  render(processedJson);
}

function render(json) {
  while (resultDiv.firstChild) {
    resultDiv.removeChild(resultDiv.firstChild);
  }

  const p1 = createPara(`Results for: ${json.location.name}, ${json.location.country}`);

  const div1 = document.createElement("div");
  div1.className = "current-temp";

  const div2 = document.createElement("div");
  div2.className = "current-temp-left";

  const div3 = document.createElement("div");
  div3.className = "current-temp-right";

  // ==================current temp left==============================
  const imgDiv = document.createElement("div");
  const img = createImg(json.current.iconURL);
  imgDiv.appendChild(img);

  const p2 = createPara("");
  p2.className = "temp-value";
  p2.textContent = `${renderCelcius ? json.current.temp_c : json.current.temp_f}`;

  const btnC = document.createElement("button");
  btnC.innerHTML = "C&deg;"; // forgive me for using this instead of textContent PLEAASE
  btnC.className = `${renderCelcius ? `selected` : ``}`;
  btnC.addEventListener("click", () => {
    renderCelcius = true;
    render(json);
  });

  const btnF = document.createElement("button");
  btnF.innerHTML = "F&deg;"; // how else would i embed html special codes in js??!?! (im sure there is a way)
  btnF.className = `${!renderCelcius ? `selected` : ``}`;
  btnF.addEventListener("click", () => {
    renderCelcius = false;
    render(json);
  });

  div2.appendChild(imgDiv);
  div2.appendChild(p2);
  div2.appendChild(btnC);
  div2.appendChild(btnF);
  // ==================current temp left==============================

  // ==================current temp right=============================
  const currentDay = new Intl.DateTimeFormat("en-US", {weekday: 'long'}).format();
  const p4 = createPara(`${currentDay} ${json.current.lastUpdated}`);
  const p3 = createPara(json.current.text);
  div3.appendChild(p4);
  div3.appendChild(p3);
  // ==================current temp right=============================
  
  div1.appendChild(div2);
  div1.appendChild(div3);

  const hourColumns = document.createElement("div");
  hourColumns.className = "hourly";
  
  for (const [idx, hour] of json.hour.entries()) {
    if (idx % 3 === 0) {
      const hourDiv = document.createElement("div");
      const hourPara1 = createPara(`${renderCelcius ? Math.round(hour.temp_c) : Math.round(hour.temp_f)}`);
      hourPara1.className = "temp-value";
      const hourPara2 = createPara(hour.time.slice(-5));
      const div1 = document.createElement("div");
      const img = createImg(hour.iconURL);
      div1.appendChild(img);
      const hourPara3 = createPara(hour.text);

      hourDiv.appendChild(hourPara1);
      hourDiv.appendChild(hourPara2);
      hourDiv.appendChild(div1);
      hourDiv.appendChild(hourPara3);
      hourColumns.appendChild(hourDiv);
    }
  }

  resultDiv.appendChild(p1);
  resultDiv.appendChild(div1);
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
    lastUpdated: json.current.last_updated.slice(-5),
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
    obj.iconURL = hour.condition.icon;
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


