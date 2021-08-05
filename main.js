//Html element varuiables 
const apiKey = document.querySelector('#api-key');
const address = document.querySelector('#address');
const norad = document.querySelector('#norad');
const search = document.querySelector('#search');
const output =document.querySelector('.output');
const riseResult =document.querySelector('#rise');
const setResult =document.querySelector('#set');
const culmResult =document.querySelector('#peak');

//get api data from input section
const getLocationData = async () => {
    //fetch and convert raw data
   const rawData = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(address.value)}.json?access_token=${apiKey.value}`);
   const data = await rawData.json()
  //collect coordinates
   const lon = data.features[0].center[0]
   const lat = data.features[0].center[1]
    
   console.log('coordinates', lat,lon)
   

   // fetch satellite data
  const getSatData = async (coord) => {
        const rawData2 = await fetch(`https://satellites.fly.dev/passes/${norad.value}?lat=${lat}&lon=${lon}&limit=1&days=15&visible_only=true
        `);
        const satDat = await rawData2.json()
        // sat data sorted by position
        const set = satDat[0].set;
        const rise = satDat[0].rise;
        const culmination = satDat[0].culmination;

        //utc time for set, rise, and culm positions
        const setDate =set.utc_datetime
        const riseDate =rise.utc_datetime
        const culminationDate =culmination.utc_datetime

        //convert utc to locale time zone
                const convertToLocal = (timestamp) => {
                   const time = new Date(timestamp).toLocaleTimeString("en-US")
                   console.log(time)
                   return time
                }

             // slice date from data
             const getDate = (date) => {
                const newDate = date.slice(0, 10);
                console.log('date:', newDate)
                return newDate
             }
        console.log(getDate(set.utc_datetime))
        console.log(convertToLocal(set.utc_timestamp))

    console.log('set:', set.utc_datetime, 'rise:', rise, 'culmination:', culmination)
     // create message from api data
    const createMessage = () => {
        riseResult.innerHTML = `${getDate(rise.utc_datetime)} ${convertToLocal(rise.utc_timestamp)} `;
        culmResult.innerHTML = `${getDate(culmination.utc_datetime)} ${convertToLocal(culmination.utc_timestamp)} `;
        setResult.innerHTML = `${getDate(set.utc_datetime)} ${convertToLocal(set.utc_timestamp)} `;

    }
    createMessage()
 }
 getSatData()
}

 

//Search event listener 
search.addEventListener('click', getLocationData)
