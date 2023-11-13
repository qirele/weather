# Weather forecast app

this gonna be weather time baby

how im gonna do dat:

- function that hits the api
async function hitAPI(location) { // this returns a promise
    const url = "https:://www.url.com";
    const response = await fetch(url);
    const json = await response.json();
    return json;
}

- function that processes json and returns object with only the data that app needs
function processData(json) {
    const object = {};
    object.current = {
        temperature: {
            C: json.current.temp_c,
            F: json.current.temp_f
        },
        precip: json.current.precip_mm 
    };
    
    object.location = {
        name: json.location.name,
        country: json.location.country,
        region: json.location.region
    };

    object.hour = 
        json.forecast.forecastday[0].hour.map(hour => {
            const obj = {};
            obj.temp_c = hour.temp_c;
            obj.temp_f = hour.temp_f;
            obj.precip = hour.precip_mm;
            obj.time = time
            return obj;
        })

    return object;
}

when user clicks show me: form submits

form.onsubmit = handleSubmit;

async function handleSubmit(event) {
    event.preventDefault() // obviously cause we don't have a server
    
    const location = form.location.replace("", "+");
    const URL = `https://www.api.com/json?key=123&location=${location}`;

    // now hit the api
    const responseJson = await hitAPI(location);
    const json = processData(responseJson);
    
    console.log(json);
}

// what now tho, i got my hourly forecast
// display the weather info like that sorta:

5         6      5         6     5         6      

00:00   03:00    06:00   09:00   12:00   15:00    

<div class="hourly"> display flex;
    div
        div "2"
        div "00:00"
    div
        div "2"
        div "00:00"
</div>

how to make the array smaller so that it only prints 00:00, 03:00, 06:00 etc
print only the third element
