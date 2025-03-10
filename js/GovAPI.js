//javascript for carpark card displays (incl govAPIRef code)
const app = document.getElementById('carparkDisplays')

const filterbtn = document.createElement('div')
const container = document.createElement('div')
filterbtn.setAttribute('class', 'filterbtn')
container.setAttribute('class', 'container')
 
app.appendChild(container)
app.appendChild(filterbtn)

//Creating filter buttons (distance, rate, avail slots)
//create separate div (text) for 'sort by' text within filterbtn div
const text = document.createElement('div')
text.setAttribute('class', 'text')
text.textContent="Sort by:"
filterbtn.appendChild(text)

//create separate div (btns) for all 3 buttons within filterbtn div
const btns = document.createElement('div')
btns.setAttribute('class', 'btns')
filterbtn.appendChild(btns)

//create distSort button and append to 'btns' div
const distSort = document.createElement('div')
distSort.setAttribute('class', 'distSort')
distSort.textContent="Distance"
btns.appendChild(distSort)

//create priceSort button and append to 'btns' div
const priceSort = document.createElement('div')
priceSort.setAttribute('class', 'priceSort')
priceSort.textContent="Price"
btns.appendChild(priceSort)


//create slotSort button and append to 'btns' div
const slotSort = document.createElement('div')
slotSort.setAttribute('class', 'slotSort')
slotSort.textContent="Available Slots"
btns.appendChild(slotSort)



const hMap = new Map(); //creating hashmap
const api_url = env.getProperty("API_URL");

//function to send request
  async function getData(){
    const response = await fetch(api_url);
    const data = await response.json();
    //console.log(data);
    //basically assigning the variables to the attributes in the data table for ease of access
    const{address, car_park_basement, car_park_decks, car_park_no, car_park_type, free_parking, gantry_height, night_parking, _full_count } = data.result.records[0];

    

    //create new request
    var request = new XMLHttpRequest()

    //open reequest line to API and limit to 10 records
    request.open('GET','https://api.data.gov.sg/v1/transport/carpark-availability', true);

    //access the JSON data
    request.onload = function () {
      var data1 = JSON.parse(this.response);

      let len1 = data.result.records.length; //length of first api
      let len2 = data1.items[0].carpark_data.length; //length of second api

      //hashmap to store all the carparks that have exceptions in carpark pricing
      const centralcpark= new Map();
      centralcpark.set('ACB', 0);
      centralcpark.set('BBB', 1);
      centralcpark.set('BRB1',2);
      centralcpark.set('CY', 3);
      centralcpark.set('DUXM', 4);
      centralcpark.set('HLM', 5);
      centralcpark.set('KAB', 6);
      centralcpark.set('KAM', 7);
      centralcpark.set('KAS', 8);
      centralcpark.set('PRM', 9);
      centralcpark.set('SLS', 10);
      centralcpark.set('SR1', 11);
      centralcpark.set('SR2', 12);
      centralcpark.set('TPM', 13);
      centralcpark.set('UCS', 14);
      centralcpark.set('WCB', 15);

      const removerepeats= new Map();
      //array to store the cards for filter option
      const cardArray = [];
      //index to keep track of length of card array 
      let cArrayCount=0;

      for(let i=0; i<len2;i++){ //adding the data of second API into hMap-> key: carpark num & value = index of element in array
        hMap.set(data1.items[0].carpark_data[i].carpark_number,i); //data1.items[0].carpark_data[i].carpark_number
      }

      const firstAPIhmap = new Map();
      for (let i=0; i<len1;i++){
        firstAPIhmap.set(data.result.records[i].car_park_no, i);
      }

      for(let u=0; u<markers.length; u++){  // for how many markers are shown    
        tempcarparkindex= firstAPIhmap.get(markers[u].title);

        let cNum = data.result.records[tempcarparkindex].car_park_no;
        if (cNum == markers[u].title){
          if(removerepeats.get(cNum)!=null)
            continue;
          removerepeats.set(data.result.records[tempcarparkindex].car_park_no,tempcarparkindex);
          let index = hMap.get(cNum); 

          if(index==null)
            continue;

          const card = document.createElement('div')
          card.setAttribute('class', 'card')
          card.setAttribute('id', cNum)
          container.appendChild(card)

          card.addEventListener("click",function(){ clickHandler(card.id, tempcarparkindex); });
          distSort.addEventListener("click",function(){ distSortHandler() });
          priceSort.addEventListener("click",function(){ priceSortHandler() });
          slotSort.addEventListener("click",function(){ slotSortHandler() });

          //creating 3diff divs-header, body, footer + the lines in between
          const header = document.createElement('div');
          header.setAttribute('class','header');
  
          const body = document.createElement('div');
          body.setAttribute('class','body');
        
          const footer = document.createElement('div');
          footer.setAttribute('class','footer');
  
          const hr1 = document.createElement('hr');
          const hr2 = document.createElement('hr');
          
          card.appendChild(header);
          card.appendChild(hr1);
          card.appendChild(body);
          card.appendChild(hr2);
          card.appendChild(footer);
  
         //adding the card to the card array created in line 148
         cardArray[cArrayCount]=card;
         cArrayCount++;

          //header content
          const cName = document.createElement('h1');
          const cAvail = document.createElement('h1');
          cName.textContent = data.result.records[tempcarparkindex].car_park_no
          cAvail.textContent = data1.items[0].carpark_data[index].carpark_info[0].lots_available +' spaces'
          
          header.appendChild(cName)
          header.appendChild(cAvail)    
        

          //body content
          const bodyL = document.createElement('div')
          bodyL.setAttribute('class','bodyL')
          const bodyR = document.createElement('div')
          bodyR.setAttribute('class','bodyR')
          body.appendChild(bodyL)
          body.appendChild(bodyR)

          //bodyL
          let index1= centralcpark.get(cNum);
          if(index1==null){
            const cPrice=document.createElement('h1')
            cPrice.setAttribute('style','white-space: pre;')
            cPrice.textContent="$0.60\r\n30mins"
            cPrice.setAttribute('class', 'cPrice')
            bodyL.appendChild(cPrice);
          } else{
            const cPrice=document.createElement('h1');
            cPrice.setAttribute('style','white-space: pre;')
            cPrice.textContent=`$1.20\r\n30mins (Mon to Sat 7am to 5pm)
                                $0.60\r\n30mins (Other hours)`;
                                cPrice.setAttribute('class', 'cPrice')
                                bodyL.appendChild(cPrice);
          }

          //bodyR
          //walking icon
          const walkingIcon = document.createElement('img')
          walkingIcon.src = 'https://img.favpng.com/11/19/25/logo-walking-symbol-clip-art-png-favpng-uBp8dvZ4FWCLZKf9DRijTa36a.jpg'
          walkingIcon.setAttribute('class', 'walkingIcon')
          bodyR.appendChild(walkingIcon);
        
          //text 
          const walkDist = document.createElement('h1')
          walkDist.setAttribute('style','white-space: pre;')
          walkDist.textContent='1 min\r\nto destination'
          bodyR.appendChild(walkDist);

          //footer content
          if(data.result.records[tempcarparkindex].gantry_height!=0){ //some carparks have gantry height as 0, hence we do not display the following for them
            //carpark icon
            const carIcon = document.createElement('img')
            carIcon.src = 'img/carparkHeight_icon.png'
            carIcon.setAttribute('class', 'carIcon')
            footer.appendChild(carIcon);

            //height text
            const cHeight = document.createElement('h1');
            cHeight.textContent = data.result.records[tempcarparkindex].gantry_height;
            footer.appendChild(cHeight);
          }
        }
      }

      function clickHandler(cnum,j1){
        var i=hMap.get(cnum)
        document.getElementById('carparkDisplays').style.display = "none";
        document.getElementById('sidebarnext').style.display = "block";


        let index1= centralcpark.get(cnum);

        document.getElementById('sdCNum').textContent=cnum;

        if(index1==null) {
          document.getElementsByClassName('sdCPrice')[0].textContent="$0.60\r\n30mins";
        } else {
          document.getElementsByClassName('sdCPrice')[0].textContent=  `$1.20\r\n30mins (Mon to Sat 7am to 5pm)
          $0.60\r\n30mins (Other hours)`;                      
        }
        // let i = hMap.get(cnum);
        // Changing the text on the sidebar
        document.getElementById('sdnAddt').textContent = data.result.records[j1].address;
        document.getElementById('sdnBasement').textContent="Basement: "+data.result.records[j1].car_park_basement;
        document.getElementById('sdnDecks').textContent="No. of decks: "+data.result.records[j1].car_park_decks;
        document.getElementById('sdnCPType').textContent="Carpark Type: "+data.result.records[j1].car_park_type;
        document.getElementById('sdnGHeight').textContent="Gantry Height: "+data.result.records[j1].gantry_height;
        document.getElementById('sdnNPark').textContent="Night Parking: "+data.result.records[j1].night_parking;
        document.getElementById('sdnFPark').textContent="Free Parking: "+data.result.records[j1].free_parking;
        document.getElementById('sdnAvail').textContent="Lots Available: "+data1.items[0].carpark_data[i].carpark_info[0].lots_available+" slots";
      }

      function distSortHandler() {
        alert('Hello3');
      }
      function priceSortHandler() {
        alert('Hello3');
      }
      function slotSortHandler(){
      //sorting logic
      for (let u = 0; u < cArrayCount; u++)   
      {  
        for (let v = u + 1; v < cArrayCount; v++)   
        {  
          let tmp = 0; 
          let cnum1=cardArray[u].getAttribute('id')
          let cnum2=cardArray[v].getAttribute('id')
          let index1 = hMap.get(cnum1);
          let index2 = hMap.get(cnum2);
          if (data1.items[0].carpark_data[index1].carpark_info[0].lots_available > data1.items[0].carpark_data[index2].carpark_info[0].lots_available)   
          {  
            tmp = cardArray[u];  
            cardArray[u] = cardArray[v];  
            cardArray[v] = tmp;  
          }  
        }  
      }
      //slotHandler
      container.innerHTML = '';
      for (let u = 0; u < cArrayCount; u++)
      {
        container.appendChild(cardArray[u]);
      }   
    }
    
    }   
    request.send();
  }
getData();


