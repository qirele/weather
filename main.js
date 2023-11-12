const form = document.querySelector('form'); 
const resultDiv = document.querySelector('#results');

form.addEventListener('submit', handleSubmit);
async function handleSubmit(e) {
  e.preventDefault();
  if (form.location.value === "") return;

  let location = form.location.value;
  location = location.replace(" ", "+");
  const URL = `http://api.weatherapi.com/v1/forecast.json?key=b8981b263931411ba6b211548230111&q=${location}&days=1&aqi=no&alerts=no`;

  try {
    const response = await fetch(URL)
    const json = await response.json();
    console.log(json);

    while (resultDiv.firstChild) {
      resultDiv.removeChild(resultDiv.firstChild);
    }

    if (json.error) {
      console.log(json.error.message);
      resultDiv.appendChild(createPara(`Error: ${json.error.message}`));
      return;
    }

    if (json.current.temp_c > 20) {
      resultDiv.appendChild(createPara(`temperature: ${json.current.temp_c}C (too hot)`));
      resultDiv.appendChild(createImg("./imgs/sunhot.jpg"));
    } else {
      resultDiv.appendChild(createPara(`temperature: ${json.current.temp_c}C (too cold)`));
      resultDiv.appendChild(createImg("./imgs/coldasheck.jpg"));
    }

    resultDiv.appendChild(createPara(`Humidity: ${json.current.precip_mm}mm`));
    resultDiv.appendChild(createPara(`Condition: ${json.current.condition.text}`));
    resultDiv.appendChild(createImg(json.current.condition.icon));

  } catch (err) {
    console.log(`Something went wrong in fetching: ${err}`);
  }
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
