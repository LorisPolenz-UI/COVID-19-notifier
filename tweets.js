
const needle = require('needle');
const dotenv = require('dotenv').config();

// The code below sets the bearer token from your environment variables
// To set environment variables on Mac OS X, run the export command below from the terminal: 
// export BEARER_TOKEN='YOUR-TOKEN' 
const token = process.env.BEARER_TOKEN;

const endpointUrl = 'https://api.twitter.com/2/tweets/search/recent';

async function getTweet() {

    // Edit query parameters below
    const params = {
        'query': 'from:BAG_OFSP_UFSP -is:retweet',
        'tweet.fields': 'author_id'
    }

    const res = await needle('get', endpointUrl, params, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    })

    if (res.body) {
        var tweetReturn = null;
        for (var i = 0; i < 10; i++) {
            var textOfTweet = res.body.data[i].text;

            if (textOfTweet.includes("Aktueller Stand sind")) {

                var arrTextOfTweet = [];
                arrTextOfTweet = textOfTweet.split(" ");

                for (var i = 0; i < arrTextOfTweet.length; i++) {
                    if (!arrTextOfTweet[i].includes('http') && !arrTextOfTweet[i].includes('#')) {
                        if (tweetReturn == null) {
                            tweetReturn = arrTextOfTweet[i];
                        } else {
                            tweetReturn = tweetReturn + " " + arrTextOfTweet[i];
                        }
                    }
                }
                break;
            }
        }
        return tweetReturn;
    } else {
        throw new Error('Unsuccessful request')
    }
};







/* setInterval(() => {
    var date = new Date();
    if(date.getHours() == 15 && date.getMinutes() == 25) {

        (async () => {

            try {
        
                console.log(await getTweet());
                sendMail(await getTweet());
        
        
            } catch (e) {
                console.log(e);
                process.exit(-1);
            }
        })();





    }

    console.log(date);
    console.log(date.getHours() + " " + date.getMinutes())
}, 60000) */


(async () => {

    try {
        console.log(await getTweet());
        //sendMail(await getTweet());

        getSurname()
    } catch (e) {
        console.log(e);
        process.exit(-1);
    }
})();



var sendMessageTo = [
    {
        "emailAddress": {
            "address": "loris.polenz@swisscom.com"
        }
    },
    {
        "emailAddress": {
            "address": "loris.polenz@edu.tbz.ch"
        }
    }
    
]




async function getSurname() {

    var surnameToReturn = "User";

    for(var i = 0; i < sendMessageTo.length; i++) {
        var spliced = sendMessageTo[0].emailAddress.address.split(".");
        surnameToReturn = spliced[0].charAt(0).toUpperCase() + spliced[0].slice(1);
        sendMail(await getTweet(), sendMessageTo[i], surnameToReturn)

            //sendMail(await getTweet(), sendMessageTo[i], "User")
   
        
    }
}






//mail (sendMessageTo[i])
function sendMail(contentOfMessage, mail, surnameToReturnN) {
    var message = {

        "message": {
            "subject": "COVID CASES FROM TODAY",
            "body": {
                "contentType": "Text",
                "content": `Hello ${surnameToReturnN} \n\nFollowing are the new COVID-19 Cases in Switzerland. \n\n${contentOfMessage} \n\nI Hope you have a great day. \nLoris Polenz `
            },
            "toRecipients": [ mail ]
        }

    }

    var options = {
        headers: {
            'Authorization': process.env.MS_TOKEN,
            'Content-type': 'application/json'
        }
    }

    needle.post("https://graph.microsoft.com/v1.0/me/sendMail", message, options, () => {
        console.log(`Mail was sent, ${surnameToReturnN} :) `)
    })
}
