const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const uuid = require('uuid');
const calendarKey = require('../config/calendar.json')

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = require("path").join('config/token.json');

const credentialsFile = require("path").join('config/credentials.json');

function getAuthClient() {
    const credentials = JSON.parse( fs.readFileSync(credentialsFile, 'utf8'));
    // console.log(credentials)
    const {client_secret, client_id, redirect_uris} = credentials.web;
    return new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
}

async function getJWTClient() {
    jwtClient = new google.auth.JWT(calendarKey.client_email, null, calendarKey.private_key, SCOPES, "108146771809354946847" );
    const jwtToken = await jwtClient.authorize();
    // console.log(jwtToken)
    return jwtClient;
}

function authInit(){ 
  // get client info
    const oAuth2Client = getAuthClient();
      
      // console.log(oAuth2Client)
    try {

      const token = fs.readFileSync(TOKEN_PATH,'utf8') ;
      console.log( `****${token}`)
  // 
    
      oAuth2Client.setCredentials(JSON.parse(token));
          return  oAuth2Client
    } 
     catch (err) {
        applyForAccessToken(oAuth2Client);  
     } 
}

function applyForAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
   console.log(authUrl)
   return {redirecURl : authUrl }

}

function getAccessToken(code) {
    // get client info
    
    const oAuth2Client = getAuthClient();
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        return token;
      });

}


/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
    try{
    const calendar = google.calendar({version: 'v3', auth});
    const events = await
      calendar.events.list({
      calendarId:process.env.GOOGLE_CALENDAR_ID,
      timeMin: (new Date()).toISOString(),
    //   maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
        // console.log(events.data.items)s
        events.data.items.map((event, i) => {
            console.log(`${event.start.dateTime} - ${event.summary}`);
          });

        return events.data.items;
    } catch (err) {
    console.log(JSON.stringify(err)); 


    return err ;
   }
  }
  
  function createEvent(auth,data) {
    const calendar = google.calendar({version: 'v3', auth});
    // console.log(uuid.v1().toString())
    var event = {
      "id" : uuid.v4().replace(/-/g, ''),
      'summary': data.summary,
      // 'location': '800 Howard St., San Francisco, CA 94103',
      'description': data.description,
      'start': {
        'dateTime': data.startDateTime,
        'timeZone': 'Asia/Dhaka',
      },
      'end': {
        'dateTime': data.endDateTime,
        'timeZone': 'Asia/Dhaka',
      },
      // 'recurrence': [
      //   'RRULE:FREQ=DAILY;COUNT=1'
      // ],
      'attendees': [
        {'email': data.doctorEmail,  comments : "doctor"},
        {'email': data.patientEmail, comments : "patient"},
      ],
      'reminders': {
        'useDefault': false,
        'overrides': [
          {'method': 'email', 'minutes': 24 * 60},
          {'method': 'popup', 'minutes': 10},
        ],
      },
      "extendedProperties": {
        "private": {
          "doctorUserId": data.doctorUserId,
          "patientUserId" : data.patientUserId,
          "appId" : "d0b9465d852a16e4ce97586e69ede763",
        }
      }
    };
    
    calendar.events.insert({
    auth: auth,
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    resource: event,
  }, function(err, event) {
      console.log(JSON.stringify(err))
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    //  console.log(event.data)
    return event;
    //  console.log('Event created: %s', event.data.htmlLink);
  });
//   console.log (event)
  return event;
  }

  async function timeSlotAvailable(auth,data){
    try{
        // const auth = authInit(); 
        console.log("-----*-------------------*--") 
        // // console.log(auth) //////
        // if(auth.oAuth2Client){
        //     const appointments = await listEvents(auth.oAuth2Client);
console.log(data.startDateTime)
    
            const calendar = google.calendar({version: 'v3', auth});
            const appt = await 
            calendar.events.list({
              calendarId:process.env.GOOGLE_CALENDAR_ID,
              timeMin: data.startDateTime,
              timeMax: data.endDateTime,
            //   maxResults: 10,
            privateExtendedProperty :{
                "private": {
                    "doctorUserId": data.doctorUserId,
                    "patientUserId" : data.patientUserId,
                    "appId" : "d0b9465d852a16e4ce97586e69ede763",
                  }       
            },
              singleEvents: true,
              orderBy: 'startTime',
            });
            
            // console.log(JSON.stringify(appt),"\r")


            const appointments = appt.data.items
            console.log(appointments)
            // if(appointments)
            appointments.map((event, i) => {
                const start = event.start.dateTime || event.start.date;
                console.log(`${start} - ${event.summary}`);
              });

            // console.log("********************************************************************")
            // const myappoitments = appointments.filter((event, i)=>{
            //     // console.log(event.attendees)
            //         const appt = event.attendees.find( attendee => attendee.email === attendeeEmail )
            //         console.log("-------------------------------------------------------------------------")
            //         console.log(appt)
            //         console.log(event.start.dateTime)
            //         console.log(startDateTime)
            //         console.log(appt && new Date(event.start.dateTime) === new Date(startDateTime))
            //         if(appt && new Date(event.start.dateTime) === new Date (startDateTime))
            //         return true
            //         else
            //         return false
            // });
            // console.log("wwwwwwwwwwwwwwwwwwwwwwwww")
            // console.log(myappoitments.length)
 
            // myappoitments.map((event, i) => {
            //       const start = event.start.dateTime || event.start.date;
            //       console.log(`${start} - ${event.summary}`);
            //     });
            return !appointments.length > 0;
                    // }
    }
     catch (err) {
        console.log(JSON.stringify(err)); 

    return err;
  }


  }

  module.exports = {
    createEvent,
    listEvents,
    authInit,
    getAccessToken,
    timeSlotAvailable,
    getJWTClient
  };
