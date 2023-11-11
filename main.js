const form = document.querySelector('form'); 
const resultDiv = document.querySelector('#results');

form.addEventListener('submit', handleSubmit);
function handleSubmit(e) {
  e.preventDefault();
  if (form.location.value === "") return;

  const location = form.location.value;
  const URL = `http://api.weatherapi.com/v1/current.json?key=b8981b263931411ba6b211548230111&q=${location}&aqi=no`;
  fetch(URL)
    .then(response => response.json())
    .then(json => {
      console.log(json);

      const p1 = document.createElement('p');
      p1.textContent = `temperature: ${json.current.temp_c}C`;

      const p2 = document.createElement('p');
      p2.textContent = `Humidity: ${json.current.precip_mm}mm`;

      resultDiv.appendChild(p1);
      resultDiv.appendChild(p2);
    });
}

