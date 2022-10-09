<template>
  <q-page class="q-py-md q-px-sm">
    <div class="fit text-center">
      <h4 class="q-ma-sm">TEMPO REAL</h4>
      Proxima leitura em {{ cont }}
      <q-dialog
        seamless
        no-esc-dismiss
        allow-focus-outside
        v-model="desatualizado"
        position="bottom"
      >
        <q-card style="width: 100%">
          <q-banner
            v-if="desatualizado"
            dense
            class="bg-grey-3 q-py-sm text-center"
          >
            Não há leituras recentes, verifique se o dipositivo está ligado e
            conectado a internet.
            <template v-slot:avatar>
              <q-icon class="q-pl-md" name="signal_wifi_off" color="primary" />
            </template>
          </q-banner>
        </q-card>
      </q-dialog>
    </div>
    <div style="padding-bottom: 80px" class="col-auto row justify-center">
      <div class="custom-gauge row justify-center text-center">
        <h5 class="q-my-xs">Voltagem</h5>
        <q-knob
          show-value
          readonly
          :min="0"
          :max="220"
          v-model="consumoAtual.voltagem"
          size="150px"
          :thickness="0.22"
          color="teal"
          track-color="grey-3"
          class="q-ma-md"
          font-size="30px"
        >
          {{ consumoAtual.voltagem }} Volts
        </q-knob>
      </div>
      <div class="custom-gauge row justify-center text-center">
        <h5 class="q-my-xs">Corrente</h5>
        <q-knob
          readonly
          :min="0"
          :max="100"
          v-model="consumoAtual.corrente"
          show-value
          size="150px"
          :thickness="0.22"
          color="teal"
          track-color="grey-3"
          class="q-ma-md"
          font-size="30px"
        >
          {{ consumoAtual.corrente }} Ampères
        </q-knob>
      </div>
      <div class="custom-gauge row justify-center text-center">
        <h5 class="q-my-xs">Potencia</h5>
        <q-knob
          readonly
          :min="0"
          :max="1200"
          v-model="consumoAtual.potencia"
          show-value
          size="150px"
          :thickness="0.22"
          color="teal"
          track-color="grey-3"
          class="q-ma-md"
          font-size="30px"
          >{{ consumoAtual.potencia }} Watts
        </q-knob>
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
      cont: 15,
      interval: null,
      consumoAtual: {
        potencia: 0,
        voltagem: 0,
        corrente: 0,
        desatualizado: false,
      },
      desatualizado: false,
    };
  },
  async created() {
    this.consumoAtual = (await this.$api.get("/tempoReal")).data;
    this.setConsumoInterval();
  },
  methods: {
    async setConsumoInterval() {
      this.cont = 15;
      this.interval = setInterval(async () => {
        this.cont -= 1;
        if (this.cont <= 0) {
          clearInterval(this.interval);
          this.consumoAtual = (await this.$api.get("/tempoReal")).data;
          this.desatualizado = this.consumoAtual.desatualizado ? true : false;
          this.setConsumoInterval();
        }
      }, 1000);
    },
  },
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
