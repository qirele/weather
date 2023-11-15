const form = document.querySelector('form'); 
const resultDiv = document.querySelector('#results');

let renderCelcius = true;
let renderDayIdx = 0;
let clickedOnADay = false;

form.addEventListener('submit', handleSubmit);

async function handleSubmit(e) {
  e.preventDefault(); 
  if (form.location.value === "") return;

  const location = form.location.value.replace(" ", "+");

  // here we gonna be displaying that loading animation bruuuuuuh
  resultDiv.prepend(loadingComponent());

  const originalJson = await hitAPI(location);
  if (originalJson === -1) {
    return;
  }

  const processedJson = processData(originalJson);
  console.clear();
  console.log(originalJson);
  console.log(processedJson);

  // reset the state after user typed new location
  renderCelcius = true;
  renderDayIdx = 0;
  clickedOnADay = false;

  render(processedJson);
}

function renderError(text) {
  while (resultDiv.firstChild) {
    // TODO: remove event listeners here, btnC, btnF, dayDiv listener too
    resultDiv.removeChild(resultDiv.firstChild);
  }
  resultDiv.appendChild(createPara(text));
}

function render(json) {
  while (resultDiv.firstChild) {
    // TODO: remove event listeners here, btnC, btnF, dayDiv listener too
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
  btnC.addEventListener("click", handleCelciusClick);
  function handleCelciusClick() {
    renderCelcius = true;
    render(json);
  }

  const btnF = document.createElement("button");
  btnF.innerHTML = "F&deg;"; // how else would i embed html special codes in js??!?! (im sure there is a way)
  btnF.className = `${!renderCelcius ? `selected` : ``}`;
  btnF.addEventListener("click", handleFahrClick);
  function handleFahrClick() {
    renderCelcius = false;
    render(json);
  }

  div2.appendChild(imgDiv);
  div2.appendChild(p2);
  div2.appendChild(btnC);
  div2.appendChild(btnF);

  // ==================current temp right=============================
  const currentDay = new Intl.DateTimeFormat("en-US", {weekday: 'long'}).format();
  const p4 = createPara(`${currentDay} ${json.current.lastUpdated}`);
  const p3 = createPara(json.current.text);
  div3.appendChild(p4);
  div3.appendChild(p3);

  if (clickedOnADay) { // replace values to the renderDayIdx day
    const clickedDay = json.days[renderDayIdx];
    img.src = clickedDay.iconURL;
    p2.textContent = `${renderCelcius ? clickedDay.avgtemp_c : clickedDay.avgtemp_f}`;
    const clickedDayName = new Intl.DateTimeFormat("en-US", {weekday: 'long'}).format(new Date(clickedDay.date));
    p4.textContent = clickedDayName;
    p3.textContent = clickedDay.text;
  }

  div1.appendChild(div2);
  div1.appendChild(div3);

  const hourColumns = document.createElement("div");
  hourColumns.className = "hourly";
  
  // hourly div display here
  for (const [idx, hour] of json.days[renderDayIdx].hour.entries()) {
    if (idx % 3 === 0) {
      const hourDiv = document.createElement("div");
      const hourPara1 = createPara(`${renderCelcius ? Math.round(hour.temp_c) : Math.round(hour.temp_f)}`);
      hourPara1.innerHTML += "&deg;";
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
  
  const daysDiv = document.createElement("div");
  daysDiv.className = "days";

  for (const [idx, day] of json.days.entries()) {
    const dayDiv = document.createElement("div");
    dayDiv.className = `day ${renderDayIdx === idx ? `selected` : ``}`;
    dayDiv.addEventListener("click", () => {
      renderDayIdx = idx;
      clickedOnADay = true;
      render(json);
    });

    const dayInQuestion = new Intl.DateTimeFormat("en-US", {weekday: 'long'}).format(new Date(day.date));
    const p0 = createPara(dayInQuestion.toString());

    const p1 = document.createElement("p");
    p1.innerHTML = `${renderCelcius ? day.maxtemp_c : day.maxtemp_f}&deg; ; ${renderCelcius ? day.mintemp_c : day.mintemp_f}&deg;`;

    const divImg = document.createElement("div");
    const img = createImg(day.iconURL);
    divImg.appendChild(img);

    const p2 = createPara(day.text);

    dayDiv.appendChild(p0);
    dayDiv.appendChild(p1);
    dayDiv.appendChild(divImg);
    dayDiv.appendChild(p2);

    daysDiv.appendChild(dayDiv);
  }

  resultDiv.appendChild(p1);
  resultDiv.appendChild(div1);
  resultDiv.appendChild(hourColumns);
  resultDiv.appendChild(daysDiv);
}

async function hitAPI(location) { // this returns a promise
  const URL = `http://api.weatherapi.com/v1/forecast.json?key=b8981b263931411ba6b211548230111&q=${location}&days=3&aqi=no&alerts=no`;
  try {
    const response = await fetch(URL);
    if (response.status === 400) {
      renderError("Bad Request. Check your input brochoho.");
      return -1;
    }
    const json = await response.json();
    return json;
  } catch (err) {
    // Handle other errors (e.g., network issues)
    console.error("An error occurred:", err);
    renderError("An error occurred while fetching data. Please try again."); 
  }
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

  object.days = json.forecast.forecastday.map(day => {
    const dayObj = {};
    dayObj.date = day.date;
    dayObj.avgtemp_c = day.day.avgtemp_c; 
    dayObj.avgtemp_f = day.day.avgtemp_f; 
    dayObj.mintemp_c = day.day.mintemp_c;
    dayObj.maxtemp_c = day.day.maxtemp_c;
    dayObj.mintemp_f = day.day.mintemp_f;
    dayObj.maxtemp_f = day.day.maxtemp_f;
    dayObj.text = day.day.condition.text;
    dayObj.iconURL = day.day.condition.icon;

    dayObj.hour = day.hour.map(hour => {
      const obj = {};
      obj.temp_c = hour.temp_c;
      obj.temp_f = hour.temp_f;
      obj.precip = hour.precip_mm;
      obj.time = hour.time;
      obj.text = hour.condition.text;
      obj.iconURL = hour.condition.icon;
      return obj;
    });

    return dayObj;
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

// loading component
function loadingComponent() {
  const div = document.createElement("div");
  div.className = "lds-dual-ring";
  return div;
}

