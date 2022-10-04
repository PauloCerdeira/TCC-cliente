<template>
  <q-page class="q-py-md q-px-sm">
    <div class="fit text-center">
      <h4 class="q-ma-sm">CONSUMO POR PERIODO</h4>
      <q-stepper
        flat
        :vertical="$q.screen.lt.md"
        alternative-labels
        v-model="step"
        header-nav
        ref="stepper"
        color="primary"
        animated
      >
        <q-step
          :name="1"
          title="Definir Data Inicial"
          active-icon="calendar_month"
          :done="step > 1"
          :header-nav="step > 1"
        >
          <div class="q-gutter-md row justify-center">
            <q-date
              :locale="ptBrLocale"
              v-model="dataInicial"
              mask="YYYY-MM-DD HH:mm"
            />
            <q-time format24h v-model="dataInicial" mask="YYYY-MM-DD HH:mm" />
          </div>

          <q-stepper-navigation>
            <q-btn @click="setDataInicial()" color="primary" label="Próximo" />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          title="Definir Data Final"
          active-icon="calendar_month"
          icon="calendar_month"
          :done="step > 2"
          :header-nav="step > 2"
        >
          <div class="q-gutter-md row justify-center fit">
            <q-date
              :navigation-min-year-month="
                dataInicial.substring(0, 7).replace('-', '/')
              "
              :default-year-month="
                dataInicial.substring(0, 7).replace('-', '/')
              "
              :options="
                (date) =>
                  date >=
                  dataInicial
                    .substring(0, 10)
                    .replace('-', '/')
                    .replace('-', '/')
              "
              :locale="ptBrLocale"
              v-model="dataFinal"
              @update:model-value="validaHoraRelDia()"
              mask="YYYY-MM-DD HH:mm"
            />
            <q-time
              :hour-options="hourOptions"
              :minute-options="minuteOptions"
              format24h
              v-model="dataFinal"
              mask="YYYY-MM-DD HH:mm"
            />
          </div>

          <q-stepper-navigation>
            <q-btn @click="step = 3" color="primary" label="Continue" />
            <q-btn
              flat
              @click="step = 1"
              color="primary"
              label="Back"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="3"
          title="Consultar Consumo"
          active-icon="data_thresholding"
          icon="data_thresholding"
          :header-nav="step > 3"
        >
          {{ dataInicial }} <br />
          {{ dataFinal }}

          <q-stepper-navigation>
            <q-btn
              flat
              @click="step = 2"
              color="primary"
              label="Back"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { date } from "quasar";

export default defineComponent({
  name: "ConsumoTempoReal",
  data() {
    return {
      step: ref(1),
      dataInicial: null,
      dataFinal: null,
      hourOptions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      minuteOptions: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
        56, 57, 58, 59, 60,
      ],
      ptBrLocale: {
        days: [
          "Domingo",
          "Segunda",
          "Terça",
          "Quarta",
          "Quinta",
          "Sexta",
          "Sabado",
        ],
        daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
        months: [
          "Janeiro",
          "Fevereiro",
          "Março",
          "Abril",
          "Maio",
          "Junho",
          "Julho",
          "Agosto",
          "Setembro",
          "Outubro",
          "Novembro",
          "Dezembro",
        ],
        monthsShort: [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ],
      },
    };
  },
  async created() {
    // console.log(this.dataInicial);
    // console.log(date.formatDate(this.dataInicial, "YYYY-MM-DD hh:mm:ss"));
  },
  methods: {
    // teste(hr, min) {
    //   console.log(this.dataFinal);
    //   if (
    //     this.dataFinal &&
    //     this.dataInicial.substring(0, 10) == this.dataFinal.substring(0, 10)
    //   ) {
    //     if (hr < this.dataInicial.substring(11, 13)) {
    //       console.log("hora menor que data inicial ", hr + ":" + min);
    //       return false;
    //     }
    //     if (
    //       hr == this.dataInicial.substring(11, 13) &&
    //       min <= this.dataInicial.substring(14, 16)
    //     ) {
    //       console.log(
    //         "hora igual, min menor ou igual data inicial ",
    //         hr + ":" + min
    //       );
    //       return false;
    //     }
    //   }
    //   return true;
    // },
    validaHoraRelDia() {
      if (
        this.dataFinal &&
        this.dataInicial.substring(0, 10) == this.dataFinal.substring(0, 10)
      ) {
        this.dataFinal = date.formatDate(
          date.addToDate(this.dataInicial, { minute: 1 }),
          "YYYY-MM-DD HH:mm"
        );
      }
    },
    setDataInicial() {
      this.dataFinal = date.formatDate(
        date.addToDate(this.dataInicial, { hours: 1 }),
        "YYYY-MM-DD HH:mm"
      );
      this.step = 2;
    },
  },
});
</script>

<style scoped></style>
