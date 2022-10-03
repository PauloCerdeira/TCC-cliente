<template>
  <q-page class="q-py-md q-px-sm">
    <div class="fit text-center">
      <h4 class="q-ma-sm">TEMPO REAL</h4>
    </div>
    <div class="col-auto row justify-center" v-if="consumoAtual">
      <div class="custom-gauge row justify-center text-center">
        <h5 class="q-my-xs">Voltagem</h5>
        <q-knob
          readonly
          :min="0"
          :max="1000"
          v-model="consumoAtual.voltagem"
          show-value
          size="150px"
          :thickness="0.22"
          color="teal"
          track-color="grey-3"
          class="q-ma-md"
        />
      </div>
      <div class="custom-gauge row justify-center text-center">
        <h5 class="q-my-xs">Corrente</h5>
        <q-knob
          readonly
          :min="0"
          :max="1000"
          v-model="consumoAtual.corrente"
          show-value
          size="150px"
          :thickness="0.22"
          color="teal"
          track-color="grey-3"
          class="q-ma-md"
        />
      </div>
      <div class="custom-gauge row justify-center text-center">
        <h5 class="q-my-xs">Potencia</h5>
        <q-knob
          readonly
          :min="0"
          :max="1000"
          v-model="consumoAtual.potencia"
          show-value
          size="150px"
          :thickness="0.22"
          color="teal"
          track-color="grey-3"
          class="q-ma-md"
        />
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
      consumoAtual: null,
    };
  },
  async created() {
    setInterval(async () => {
      this.consumoAtual = (await this.$api.get("/tempoReal")).data;
    }, 2500);
  },
  methods: {},
});
</script>

<style scoped>
.custom-gauge {
  border: 1px solid lightGrey;
  border-radius: 9px;
  padding: 8px;
  margin: 5px;
  width: 280px;
}
</style>
