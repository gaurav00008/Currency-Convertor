
{/* Variable definations */}
// const BASE_URL = "https://v6.exchangerate-api.com/v6/f43a4db34d937078f6330193/latest/USD";
const BASE_URL = "https://v6.exchangerate-api.com/v6/f43a4db34d937078f6330193/latest"; //removed usd from base URL
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
{/* Variable defination end  */}

let data;
for(let select of dropdowns){
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if(select.name === "from" && currCode === "USD") {  //changed USD to NPR for Test
            newOption.selected = "selected";
        } else if(select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);  //Target is basically if we change somethig where the change happens that place
    });
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = parseFloat(amount.value);
    if (isNaN(amtVal)|| amtVal <= 0) {
        amtVal = 1;
        amount.value = "1";
    }


// const URL = `${BASE_URL}/convert?from=${fromCurr.value.toLowerCase()}&to=${toCurr.value.toLowerCase()}&amount=${amtVal}`;
const URL = `${BASE_URL}/convert?from=${fromCurr.value.toLowerCase()}`;   //Changed the  URL


    try{
        const response = await fetch(URL);
        if(!response.ok)
        {
            throw new Error("Network response was not ok");
        }
        data = await response.json();  //defined data globally
    } 
    catch (error){
        console.error('Error fetching exchange rate:',error);
    }

     const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: toCurr.value.toUpperCase(), //changed the spelling of value
    });


    // lines added for debugging only
    // ====================================================================================================
    // // console.log(data)
    // // console.log("bug here")
    // // console.log(data.conversion_rates.) //debug line

    // ====================================================================================================


    let rate;  //Rate was not defined
    rate=data.conversion_rates[toCurr.value]  //fetched the rate from api
    let finalAmount = amtVal * rate;
    // console.log("heres the final amount")  added for debuffung
    console.log(finalAmount)



//lines added for debugging
    // =======================================================================================================
    
    // //  console.log("bug1")
    // //  console.log(toCurr.value)
    // //  console.log(toCurr.value.toUpperCase())
    // //  console.log("Bug2")
    // //  console.log(toCurr)
    // =============================================================================================================
     msg.innerText = `${amtVal} ${fromCurr.value} = ${formatter.format(finalAmount)}`; //Typo in amtVal
    //  msg.innerText = `${amtVal} ${fromCurr.value} = ${data.conversion_rates[toCurr.value]}`; //Typo in amtVal

     }

const updateFlag = (element) => {
let currCode = element.value;
let countryCode = countryList[currCode];  // When we select nepalese rupee the country code will be NRP, for euro it will be EUR
let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
let img = element.parentElement.querySelector("img");
img.src = newSrc;
};

btn.addEventListener("click",(evt) => {
    evt.preventDefault();
   updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
    });
   
// v6.exchangerate-api.com

app.use(cors())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");   
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  })
const express = require("express");
const cors = require("cors");

const app = express();
app.use(
    cors({
        // origin: "http://127.0.0.3000", // Allow the client to access this server
        origin: "*",  //Allowed access to all 
    })
);

app.get("/convert", (req, res) => {
    const { from, to, amount } = req.query;
    if (!from || !to || !amount) {
        return res.status(400).json({ error: "Missing parameters" });
    }


// This section is not required

    // // Simulated exchange rates (replace with an actual API call)
    // const exchangeRates = {
    //     USD: { INR: 83, AED: 3.67 },
    //     INR: { USD: 0.012, AED: 0.045 },
    //     AED: { USD: 0.27, INR: 22.05 },
    // };

    const rate = exchangeRates[from]?.[to];
    if (!rate) {
        return res.status(400).json({ error: "Invalid currency pair" });
    }

    const convertedAmount = parseFloat(amount) * rate;
    res.json({ rate, convertedAmount });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server running at http://localhost:${PORT}");
});
// 127.0.0.3000
