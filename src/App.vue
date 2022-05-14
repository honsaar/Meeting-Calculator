<script setup lang="ts">
import {ref, watch} from "vue";

// people variables

let meetingPeeps = ref([])
let chosen = ref()

//watch chosen and clear meeting peeps if it changes
watch(chosen, () => {
  meetingPeeps.value = []
})

let presets = [{
  "name": "The University of Adelaide",
  "payscales": [
    {
      "name": "HEO4",
      "min": 64961,
      "max": 71203,
    },
    {
      "name": "HEO5",
      "min": 72832,
      "max": 80983,
    },
    {
      "name": "HEO6",
      "min": 81254,
      "max": 87770,
    },
    {
      "name": "HEO7",
      "min": 89399,
      "max": 99987,
    },
    {
      "name": "HEO8",
      "min": 100261,
      "max": 112481,
    },
    {
      "name": "HEO9",
      "min": 116557,
      "max": 124698,
    },
    {
      "name": "HEO10",
      "min": 123731,
      "max": 137201,
    },
  ]
}]


// timer variables

let timer = ref("00:00:00")
let interval = ref()
let [milliseconds,seconds,minutes,hours] = [0,0,0,0];
let costSoFar = ref([])
let meetingStarted = ref(false)





function addPerson(){
  let newPerson
  if(chosen.value) {
    if(chosen.value != 'custom'){
      newPerson = {
        "name":"",
        "payscale": ''
      }
    } else {
      newPerson = {
        "name":"",
        "payscale": {
          min: 0,
          max: 0
        }
      }
    }

    meetingPeeps.value.push(newPerson)

  } else {
    alert("You need to choose a preset or 'custom' before you add people")
  }

}

function removePerson(idx: number){
  meetingPeeps.value.splice(idx, 1)
}

function payscaleImage(payscale){
  //return image from src/assets
  let img = payscale == 'custom' ?  payscale : payscale.name.toLowerCase()
  return `/public/${img}.svg`
}

function startMeeting(){
  if(meetingPeeps.value.length > 0) {
    meetingStarted.value = true
    interval.value = setInterval(displayTimer,10);
  } else {
    alert("You need to add people to the meeting before you can start it")
  }



}

function displayTimer() {
  milliseconds+=10;

  if(milliseconds == 1000){
    milliseconds = 0;
    seconds++;

    if(seconds == 60){
      seconds = 0;
      minutes++;

      if(minutes == 60){
        minutes = 0;
        hours++;
      }
    }
  }



  timer.value = `${hours.toLocaleString('en-US', {
    minimumIntegerDigits: 2
  })}:${minutes.toLocaleString('en-US', {
    minimumIntegerDigits: 2
  })}:${seconds.toLocaleString('en-US', {
    minimumIntegerDigits: 2
  })}`

  // get ongoing updates of the cost of the meeting
  let cost = calculate()
  costSoFar.value = [cost[0], cost[1]]


}

function calculate(){
  //get hours, minutes and seconds

  let [timerhours, timerminutes, timerseconds] = timer.value.split(":")
  let totalSeconds = (Number(timerhours) * 3600) + (Number(timerminutes) * 60) + Number(timerseconds)


  //total seconds in a year
  let hoursInYear = 365 * 24
  let minutesInYear = hoursInYear * 60
  let secondsInYear = minutesInYear * 60

  //get total annual income
  let totalMin = 0;
  let totalMax = 0;

  //loop through meetingPeeps
  meetingPeeps.value.forEach(person => {
    //add income to total
    totalMin += person.payscale.min
    totalMax += person.payscale.max
  })

  // convert annual pay to per second
  let minSeconds = (totalMin / secondsInYear) * totalSeconds
  let maxSeconds = (totalMax / secondsInYear) * totalSeconds


  return [minSeconds.toFixed(2), maxSeconds.toFixed(2)]



}

function pauseMeeting(){
  meetingStarted.value = false
  clearInterval(interval.value)
}

function endMeeting(){
  meetingStarted.value = false
  clearInterval(interval.value)
  milliseconds = 0
  seconds = 0
  minutes = 0
  hours = 0

  //calculate cost, show modal, etc
calculate();

  timer.value = `${hours.toLocaleString('en-US', {
    minimumIntegerDigits: 2
  })}:${minutes.toLocaleString('en-US', {
    minimumIntegerDigits: 2
  })}:${seconds.toLocaleString('en-US', {
    minimumIntegerDigits: 2
  })}`

}


</script>

<template>
  <div class="container mx-auto">
    <h1 class="text-3xl font-bold">
      Meeting Calculator
    </h1>
  <br/>

    <div class="shadow rounded w-full my-10 p-4 text-center timer transition-all duration-300 ease-in-out hover:shadow-lg">
      <p class="font-bold text-8xl text-gray-400">
        {{ timer }}
      </p>
      <p class="font-bold text-sm text-indigo-300">
        ${{ costSoFar[0] }} - ${{ costSoFar[1] }}
      </p>
      <button class="primary-butt" @click="startMeeting" v-if="!meetingStarted" :disabled="meetingStarted">Start meeting</button>
      <button class="primary-butt-ghost" v-if="meetingStarted" @click="pauseMeeting" :disabled="!meetingStarted">Pause timer</button>
      <button class="primary-butt" @click="endMeeting" :disabled="!meetingStarted">End meeting</button>
    </div>



    <h2 class="text-2xl font-bold">Your organisation</h2>


      <select v-model="chosen" class=" border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
        <option disabled selected>Choose a preset</option>
        <option value="custom"> Custom </option>
        <option v-for="preset in presets" :value="preset">{{preset.name}}</option>

      </select> <button class="primary-butt-ghost" @click="addPerson">Add person</button>




<!--  extra handling for 'custom' choice -->



    <div class="flex flex-wrap justify-center">

      <div class="shadow-md p-4 m-2 transition-all duration-300 ease-in-out hover:shadow-lg" v-for="(person,index) in meetingPeeps">
        <button class="secondary-butt" @click="removePerson(index)">Remove</button>

        <div class="h-20">
          <div v-if="chosen == 'custom'" class="m-auto max-h-20">
            <img :src="payscaleImage('custom')" width="100" height="100" class="m-auto max-h-20" alt=""/>
          </div>

        <img v-else-if="person.payscale && chosen != 'custom'" :src="payscaleImage(person.payscale)" width="100" height="100" class="m-auto max-h-20" alt=""/>





        </div>

        <div class="inline-block relative w-64">


          <select v-if="chosen != 'custom'" v-model="person.payscale" class="w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded">

            <option v-for="payscale in chosen.payscales" :value="payscale">{{payscale.name}}</option>

          </select>

          <div class="flex" v-else>
            <input class="w-full border border-gray-200 font-bold text-sm py-2 text-emerald-600 pr-8 rounded" placeholder="minimum pay rate" v-model="person.payscale.min"/> - <input class="w-full border border-gray-200 font-bold text-sm py-2 text-emerald-600 pr-8 rounded" placeholder="maximum pay rate" v-model="person.payscale.max"/>
          </div>

          <p class="text-center font-bold text-sm py-2 text-emerald-600"> <span v-if="person.payscale && chosen != 'custom'">{{ person.payscale.min.toLocaleString() }} - {{ person.payscale.max.toLocaleString() }} </span></p>

        </div>




      </div>

    </div>



  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,700;1,400;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,300;0,400;0,700;1,400;1,700&display=swap');
#app {
  font-family: 'IBM Plex Sans', sans-serif;
  color: #2c3e50;
  margin-top: 60px;
}

.timer {
  font-family: 'IBM Plex Serif', serif;
}

button {
  font-family: 'IBM Plex Sans', sans-serif !important;
}

.primary-butt {
  padding: .3em;
  background: #ffb548;
  min-width: 250px;
  min-height: 50px;
  margin: 1em;
  border: 2px solid #ffb548;
  font-weight: bold;
}

.primary-butt:disabled {
  opacity: .5;
}

.primary-butt-ghost {
  border: 2px solid #ffb548;
  min-width: 250px;
  min-height: 50px;
  margin: 1em;
  padding: .3em;
  color: #ffb548;
  font-weight: bold;
}

.secondary-butt {
  color: #ff4848;
  font-size: 0.8em;
  font-weight: bold;
}



</style>
