<template>
  <q-page class="q-py-md q-px-sm">
    <q-input
      filled
      @keyup="getLocations()"
      v-model="search_location"
      label="Pesquisar localização"
    >
      <q-menu no-parent-event fit no-focus v-model="showAutoComplete">
        <q-list v-if="search_results.length > 0 && !search_pending">
          <q-item
            v-for="result in search_results"
            :key="result"
            class="flex"
            @click="getWeather(result)"
            clickable
            v-close-popup
          >
            <div class="col">
              {{ result.name }} <br />
              <span v-if="result.state">{{ result.state }}, </span>
              {{ result.country }}
            </div>
            lat: {{ result.lat.toFixed(3) }} <br />
            lon: {{ result.lon.toFixed(3) }}
            <br />
          </q-item>
        </q-list>
        <div
          v-else-if="!search_pending"
          class="q-py-lg flex justify-center text-h5"
          style="font-size: 1.2rem"
        >
          Nenhum resultado encontrado.
        </div>
        <div class="q-pa-md fit flex" v-else>
          <q-spinner class="q-mx-auto" color="primary" size="3em" />
        </div>
      </q-menu>
    </q-input>

    <div
      v-if="selectedLocation"
      class="q-mx-auto q-my-md text-h5 row"
      style="border-radius: 15px; border: 1px solid lightgrey"
    >
      <!-- todo: colocar data aqui em cima -->

      <div class="col-6 q-py-md q-px-sm row content-center">
        <div class="col-12">{{ Math.ceil(selectedLocation.main.temp) }} °C</div>
        <div class="text-caption col-12" style="font-size: 0.7rem">
          Sensação térmica: {{ Math.ceil(selectedLocation.main.feels_like) }} °C
          <br />
          <q-icon color="red" name="arrow_upward" />
          {{ Math.ceil(selectedLocation.main.temp_max) }} °C
          <q-icon color="blue" name="arrow_downward" />
          {{ Math.ceil(selectedLocation.main.temp_min) }} °C
        </div>
      </div>
      <div class="col-6 row q-py-md q-px-sm items-center">
        <div style="font-size: 1.45rem" class="col-12">
          {{ selectedLocation.name }}
        </div>
        <div
          style="font-size: 0.9rem; line-height: 1rem"
          class="text-subtitle1"
        >
          <span v-if="selectedLocation.state"
            >{{ selectedLocation.state }}, {{ selectedLocation.sys.country }}
          </span>
          <span v-else> {{ selectedLocation.sys.country }}</span>
        </div>
      </div>
      <div class="col-5 q-pa-sm">
        <div
          class="text-capitalize"
          style="padding-bottom: 5px !important; font-size: 1.35rem"
          v-for="weather in selectedLocation.weather"
          :key="weather.id"
        >
          {{ weather.description }} <br />
        </div>
        <div
          class="text-right"
          style="display: inline-block; font-size: 0.8rem; line-height: 1.3rem"
        >
          <span> Umidade: {{ selectedLocation.main.humidity }}% </span
          ><q-icon color="blue-4" name="water_drop" size="xs" /><br />
          <span> nuvens: {{ selectedLocation.clouds.all }}% </span
          ><q-icon color="grey" name="cloud" size="xs" />
        </div>
      </div>
      <div class="col-7 flex row q-pa-sm" style="padding-top: 1px !important">
        <div class="row">
          <div class="col text-center flex content-center">
            <span
              class="text-h4"
              style="font-size: 1.45rem; padding-bottom: 5px !important"
            >
              Vento
              <q-icon color="teal-5" name="air" size="md" />
            </span>
          </div>
          <div class="col-auto flex justify-center text-teal-7">
            <div class="w-compass">
              <q-knob
                readonly
                :angle="selectedLocation.wind.deg"
                v-model="windDeg"
                size="26px"
                :thickness="0.22"
                color="teal-7"
                track-color="teal-1"
                class="q-ma-md"
              />
              <div class="w-c-north">N</div>
              <div class="w-c-east">E</div>
              <div class="w-c-south">S</div>
              <div class="w-c-west">W</div>
            </div>
          </div>
        </div>
        <div style="font-size: 1rem" class="col-12 fit text-left">
          velocidade:
          <span class="text-teal-7">
            {{ (selectedLocation.wind.speed * 3.6).toFixed(1) }}
            km/h
          </span>
        </div>
      </div>
    </div>
    <div
      v-else
      style="border-radius: 15px; border: 1px solid lightgrey"
      class="q-mx-auto q-my-md row"
    >
      <div class="col-6 q-pa-sm">
        <q-skeleton type="rect" height="73px" />
      </div>
      <div class="col-6 q-pa-sm">
        <q-skeleton type="rect" height="73px" />
      </div>
      <div class="col-5 q-pa-sm">
        <q-skeleton type="rect" height="73px" />
      </div>
      <div class="col-7 q-pa-sm">
        <q-skeleton type="rect" height="73px" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
  data() {
    return {
      windDeg: 10,
      search_location: "Carrão",
      search_cooldown: null,
      search_results: [],
      search_pending: false,
      last_search: "",
      showAutoComplete: false,
      openWeatherKey: "27d6d870bd455bfeda31b8f1eb2118e1",
      selectedLocation: null,
      initialized: false,
    };
  },
  async created() {
    await this.getLocations();
    await this.getWeather(this.search_results[0]);
    this.initialized = true;
  },
  methods: {
    async getLocations() {
      console.log("rodou", this.search_location);
      if (this.search_location.trim().length > 2) {
        if (this.search_location.trim() == this.last_search.trim()) return;
        this.last_search = this.search_location;
        this.showAutoComplete = this.initialized ? true : false;
        let now = Date.now();
        let elapsedTime = now - this.search_cooldown;
        if (this.search_cooldown == null || elapsedTime > 2000) {
          this.search_cooldown = now;
          this.search_results = (
            await this.$openWeatherApi.get(
              `/geo/1.0/direct?q=${this.search_location.trim()}&appid=${
                this.openWeatherKey
              }`
            )
          ).data;
          console.log(this.search_results);
        } else {
          this.search_pending = true;
          setTimeout(async () => {
            if (this.search_location.trim().length > 2) {
              this.last_search = this.search_location;
              this.search_results = (
                await this.$openWeatherApi.get(
                  `/geo/1.0/direct?q=${this.search_location.trim()}&limit=5&appid=${
                    this.openWeatherKey
                  }`
                )
              ).data;
            } else {
              this.search_results = [];
            }
            console.log(this.search_results);
            this.search_pending = false;
          }, 2000);
        }
      } else {
        this.showAutoComplete = false;
      }
    },
    async getWeather(location) {
      this.selectedLocation = (
        await this.$openWeatherApi.get(
          `/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${this.openWeatherKey}&units=metric&lang=pt_br`
        )
      ).data;
      this.selectedLocation.name = location.name;
      this.selectedLocation.state = location.state;
      this.search_location = location.name;
      this.search_results = [];
      console.log(this.selectedLocation);
    },
  },
});
</script>

<style scoped>
.w-compass {
  position: relative;
  font-size: 13px;
}
.w-compass > .w-c-north {
  left: 50%;
  position: absolute;
  top: -7px !important;
  transform: translate(-50%, 0);
}
.w-compass > .w-c-east {
  top: 50%;
  position: absolute;
  right: 4px !important;
  transform: translate(0, -50%);
}
.w-compass > .w-c-south {
  left: 50%;
  position: absolute;
  bottom: -7px !important;
  transform: translate(-50%, 0);
}
.w-compass > .w-c-west {
  top: 50%;
  position: absolute;
  left: -0px !important;
  transform: translate(0, -50%);
}
</style>
