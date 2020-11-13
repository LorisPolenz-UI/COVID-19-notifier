const needle = require('needle');
const dotenv = require('dotenv').config();

// The code below sets the bearer token from your environment variables
// To set environment variables on Mac OS X, run the export command below from the terminal: 
// export BEARER_TOKEN='YOUR-TOKEN' 

//BAG ID 326650532
const token = process.env.BEARER_TOKEN; 

const endpointURL = "https://api.twitter.comlabs/2/tweets/326650532"

async function getRequest() {

    const params = {
        usernames: "TwitterDev,BAG_OFSP_UFSP", // Edit usernames to look up
        "user.fields": "created_at,description" // Edit optional query parameters here
    }

    const res = await needle('get', endpointURL, params, { headers: {
        "authorization": `Bearer ${token}`
    }})

    if(res.body) {
        return res.body;
    } else {
        throw new Error ('Unsuccessful request')
    }
}

(async () => {

    try {
        // Make request
        const response = await getRequest();
        console.log(response)

    } catch(e) {
        console.log(e);
        process.exit(-1);
    }
    process.exit();
  })();
