<template>
  <q-page class="q-py-sm q-px-sm">
    <div class="fit text-center">
      <h4 class="q-ma-sm">POR PERIODO</h4>
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
          :title="`Definir data Inicial ${
            step > 1
              ? ' - ' + dataInicial.replace('-', '/').replace('-', '/')
              : ''
          }`"
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
            <q-btn
              :disable="!dataInicial"
              @click="setDataInicial()"
              color="primary"
              label="Confirmar"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          :title="`Definir data final ${
            step > 2
              ? ' - ' + dataFinal.replace('-', '/').replace('-', '/')
              : ''
          }`"
          active-icon="calendar_month"
          icon="calendar_month"
          :done="step > 2"
          :header-nav="step > 2"
        >
          <div class="q-gutter-md row justify-center fit">
            <q-date
              @update:model-value="(value) => validaDataFinal(value)"
              :navigation-min-year-month="
                dataInicial.substring(0, 7).replace('-', '/')
              "
              :default-year-month="
                dataInicial.substring(0, 7).replace('-', '/')
              "
              :options="
                (date) =>
                  date ==
                  dataInicial
                    .substring(0, 10)
                    .replace('-', '/')
                    .replace('-', '/')
                    ? dataInicial.substring(11, 16) == '23:59'
                      ? false
                      : true
                    : date >
                      dataInicial
                        .substring(0, 10)
                        .replace('-', '/')
                        .replace('-', '/')
              "
              :locale="ptBrLocale"
              :events="dataInicialEvent"
              v-model="dataFinal"
              mask="YYYY-MM-DD HH:mm"
              today-btn
            />
            <q-time
              @update:model-value="(value) => validaDataFinal(value)"
              :hour-options="hourOptionsAvaiable"
              :minute-options="minuteOptionsAvaiable"
              format24h
              v-model="dataFinal"
              mask="YYYY-MM-DD HH:mm"
            />
          </div>

          <q-stepper-navigation>
            <q-btn
              @click="getConsumoPeriodo()"
              color="primary"
              label="Buscar Consumo"
            />
            <q-btn
              @click="step = 1"
              color="secondary"
              label="Voltar"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="3"
          title="Visualizar Consumo"
          active-icon="data_thresholding"
          icon="data_thresholding"
          :header-nav="step > 3"
        >
          <q-btn
            flat
            @click="teste()"
            color="primary"
            :label="
              !lineChartOptions.dataLabels.enabled
                ? 'Mostrar Dados'
                : 'Esconder Dados'
            "
            class="q-ml-sm"
            :icon="
              lineChartOptions.dataLabels.enabled
                ? 'visibility_off'
                : 'visibility'
            "
          />
          <apexchart
            type="line"
            height="350"
            :options="lineChartOptions"
            :series="lineChartSeries"
          ></apexchart>

          <q-stepper-navigation>
            <q-btn
              flat
              @click="step = 2"
              color="secondary"
              label="Voltar"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </div>
  </q-page>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import { defineComponent, ref } from "vue";
import { date } from "quasar";

export default defineComponent({
  components: {
    apexchart: VueApexCharts,
  },
  name: "ConsumoTempoReal",
  data() {
    return {
      step: ref(1),
      dataInicial: null,
      dataFinal: null,
      dataInicialEvent: [],
      periodoResults: null,
      hourOptions: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24,
      ],
      minuteOptions: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
        56, 57, 58, 59, 60,
      ],
      hourOptionsAvaiable: null,
      minuteOptionsAvaiable: null,
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
      lineChartSeries: [],
      lineChartOptions: {
        chart: {
          id: "linechart",
          type: "line",
          width: "100%",
        },
        dataLabels: {
          enabled: false,
          formatter: function (val, opts) {
            switch (opts.seriesIndex) {
              case 0:
                return val + "Watts";
              case 1:
                return val + " Volts";
              case 2:
                return val + " Ampères";

              default:
                return val;
            }
          },
        },
        stroke: {
          curve: "smooth",
        },
        title: {
          text: "Consumo",
          align: "left",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          type: "datetime",
        },
      },
    };
  },
  async created() {
    this.hourOptionsAvaiable = this.hourOptions;
    this.minuteOptionsAvaiable = this.minuteOptions;
  },
  methods: {
    teste() {
      this.lineChartOptions.dataLabels.enabled =
        !this.lineChartOptions.dataLabels.enabled;
      ApexCharts.exec("linechart", "updateOptions", this.lineChartOptions);
    },
    async getConsumoPeriodo() {
      this.periodoResults = (
        await this.$api.get("/periodo", {
          params: { dataInicial: this.dataInicial, dataFinal: this.dataFinal },
        })
      ).data;
      this.lineChartSeries = this.periodoResults;
      this.step = 3;
    },
    validaDataFinal(value) {
      if (!value) value = this.dataFinal;
      if (this.dataInicial.substring(0, 10) == value.substring(0, 10)) {
        this.hourOptionsAvaiable = this.hourOptions.slice(
          parseInt(this.dataInicial.substring(11, 13))
        );
        if (
          parseInt(this.dataInicial.substring(11, 13)) >
          parseInt(value.substring(11, 13))
        ) {
          setTimeout(() => {
            this.dataFinal = date.formatDate(
              date.addToDate(this.dataInicial, { minutes: 1 }),
              "YYYY-MM-DD HH:mm"
            );
            this.validaDataFinal();
          }, 100);
          return;
        }
        if (this.dataInicial.substring(11, 13) == value.substring(11, 13)) {
          this.minuteOptionsAvaiable = this.minuteOptions.slice(
            parseInt(this.dataInicial.substring(14, 16)) + 1
          );
          if (this.dataInicial.substring(14, 16) >= value.substring(14, 16)) {
            setTimeout(() => {
              this.dataFinal = date.formatDate(
                date.addToDate(this.dataInicial, { minutes: 1 }),
                "YYYY-MM-DD HH:mm"
              );
              this.validaDataFinal();
            }, 100);
          }
        } else {
          this.minuteOptionsAvaiable = this.minuteOptions;
        }
      } else {
        this.hourOptionsAvaiable = this.hourOptions;
        this.minuteOptionsAvaiable = this.minuteOptions;
      }
    },
    setDataInicial() {
      this.dataFinal = date.formatDate(
        date.addToDate(this.dataInicial, { hours: 1 }),
        "YYYY-MM-DD HH:mm"
      );
      this.dataInicialEvent = [
        this.dataInicial.substring(0, 10).replace("-", "/").replace("-", "/"),
      ];
      this.validaDataFinal();
      this.step = 2;
    },
  },
});
</script>

<style>
.q-stepper__title {
  font-size: 0.9rem !important;
}
.q-stepper--vertical .q-stepper__step-inner {
  padding: 0px 0px 0px 0px !important;
}
.q-stepper__step-inner {
  max-width: 100% !important;
}
</style>
