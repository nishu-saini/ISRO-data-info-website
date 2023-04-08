// url of all APIs..
const url_spacecrafts = "https://isro.vercel.app/api/spacecrafts",
      url_customer_setallites = "https://isro.vercel.app/api/customer_satellites",
      url_centres = "https://isro.vercel.app/api/centres";

// fetch APIs...
const spacecrafts = fetchAPI(url_spacecrafts),
      customer_satellites = fetchAPI(url_customer_setallites),
      centres = fetchAPI(url_centres);

// add data to page..
document.body.onload = function() {
    // select required HTML elements..
    let dropdown1 = document.querySelector("#dropdown1"),
        dropdown2 = document.querySelector("#dropdown2"),
        thead = document.querySelector("table thead"),
        tbody = document.querySelector("table tbody");

    // add event listener to dropdown1..
    dropdown1.addEventListener("change", (event) => {
        // empty tbody, so that new content can be render..
        tbody.innerHTML = ``;

        // check event value to display dropdown2..
        if (event.target.value != "Spacecraft") {
            dropdown2.style.display = "block";

            if (event.target.value == "Centres") {
                // initialize dropdown2..
                dropdown2.innerHTML = `<option value="">--Please choose an State--</option>
                                       <option value="All">All</option>`;

                // states Promise Array..
                let states = stateNames(centres);
                // Add state names to dropdown2..
                dropdown2_content(states);

                // Add table header..
                thead.innerHTML = `<tr>
                                        <th>Name</th>
                                        <th>Place</th>
                                        <th>State</th>
                                  </tr>`;

                // Now insert tbody content..
                tbody_for_centres(tbody);

            }
            else if (event.target.value == "Customer Satellite") {
                // initialize dropdown2..
                dropdown2.innerHTML = `<option value="">--Please choose an Country--</option>
                                       <option value="All">All</option>`;
                
                // countries promise Array..
                let countries = countryNames(customer_satellites);
                // Add countries to dropdown2..
                dropdown2_content(countries);

                // Add table header..
                thead.innerHTML = `<tr>
                                        <th>Name</th>
                                        <th>Country</th>
                                        <th>Launch Date</th>
                                        <th>Launch Mass</th>
                                        <th>Launcher</th>
                                  </tr>`;

                // Now insert tbody content..
                tbody_for_satellites(tbody);

            }
        }
        else {
            dropdown2.style.display = "none";

            // Add table header..
            let thead = document.querySelector("table thead");
            thead.innerHTML = `<tr>
                                    <th>ID</th>
                                    <th>Name</th>
                              </tr>`;

            // insert tbody content..
            spacecrafts.then(data => {
                data.spacecrafts.forEach(obj => {
                    tbody.innerHTML += `<tr>
                                            <td>${obj.id}</td>
                                            <td>${obj.name}</td>
                                        </tr>`;
                })
            });

        }
    })
    
};

// required functions
// function that takes url of API and return a promise of API request..
async function fetchAPI(url) {
    let request = fetch(url);

    const response = await request;
    return await response.json();
}

// function which return promise object of state names array..
function stateNames(centres) {
    let states = centres.then(data => {
        let arr = [],
            visited = {};

        data.centres.forEach(obj => {
            if (visited[obj.State] === undefined) {
                arr.push(obj.State);
                visited[obj.State] = 1;
            }
        });
        return arr;
    })

    return states;
}

// funtion which return promise object of country names array..
function countryNames(satellites) {
    let countries = satellites.then(data => {
        let arr = [],
            visited = {};

        data.customer_satellites.forEach(obj => {
            if (visited[obj.country] === undefined) {
                arr.push(obj.country);
                visited[obj.country] = 1;
            }
        })
        return arr;
    })

    return countries;
}

// function which takes promise of array and add content to dropdown2...
function dropdown2_content(promise) {
    promise.then(data => {
        data.sort();

        data.forEach(name => {
            dropdown2.innerHTML += `<option value="${name}">${name}</option>`
        });
    });

    return
}

// function which add tbody content for ISRO centres..
function tbody_for_centres(tbody) {
    dropdown2.addEventListener("change", (event) => {
        tbody.innerHTML = ``;
        if (event.target.value == "All") {
            centres.then(data => {
                data.centres.forEach(obj => {
                    tbody.innerHTML += `<tr>
                                            <td>${obj.name}</td>
                                            <td>${obj.Place}</td>
                                            <td>${obj.State}</td>
                                        </tr>`;
                })
            })

        } 
        else {
            let state = event.target.value;
            centres.then(data => {
                data.centres.forEach(obj => {
                    if (state == obj.State)
                        tbody.innerHTML += `<tr>
                                                <td>${obj.name}</td>
                                                <td>${obj.Place}</td>
                                                <td>${obj.State}</td>
                                            </tr>`;
                })
            })
        }
    });

    return
}

// function which add tbody content for customer satellites..
function tbody_for_satellites(tbody) {
    dropdown2.addEventListener("change", (event) => {
        tbody.innerHTML = ``;
        if (event.target.value == "All") {
            customer_satellites.then(data => {
                data.customer_satellites.forEach(obj => {
                    tbody.innerHTML += `<tr>
                                            <td>${obj.id}</td>
                                            <td>${obj.country}</td>
                                            <td>${obj.launch_date}</td>
                                            <td>${obj.mass}</td>
                                            <td>${obj.launcher}</td>
                                        </tr>`;
                })
            })

        } 
        else {
            let country = event.target.value;
            customer_satellites.then(data => {
                data.customer_satellites.forEach(obj => {
                    if (country == obj.country)
                        tbody.innerHTML += `<tr>
                                                <td>${obj.id}</td>
                                                <td>${obj.country}</td>
                                                <td>${obj.launch_date}</td>
                                                <td>${obj.mass}</td>
                                                <td>${obj.launcher}</td>
                                            </tr>`;
                })
            })
        }

    });

    return
}