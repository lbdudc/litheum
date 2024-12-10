<template>
  <div>
    <v-row class="mt-3" cols="12">
      <v-col :cols="cols" class="pb-0 pt-0">
        <v-select
          :label="$t('selectors.recalculate.dimm.label')"
          dense
          outlined
          :disabled="disableSelectors"
          :items="dimmItems"
          :item-text="(el) => $t(el.label)"
          :item-value="(el) => el.value"
          v-model="dimm"
        ></v-select>
      </v-col>
      <v-col :cols="cols" class="pt-0 pb-0">
        <v-select
          :label="$t('selectors.recalculate.dimt.label')"
          dense
          outlined
          :disabled="disableSelectors"
          :items="dimtItems"
          :item-text="(el) => $t(el.label)"
          :item-value="(el) => el.value"
          v-model="dimt"
        ></v-select>
      </v-col>
      <v-col :cols="cols" class="pb-0 pt-0">
        <v-select
          :label="$t('selectors.recalculate.tipv.label')"
          dense
          outlined
          :disabled="disableSelectors"
          :items="tipvItems"
          :item-text="(el) => $t(el.label)"
          :item-value="(el) => el.value"
          v-model="tipv"
        ></v-select>
      </v-col>
    </v-row>
    <v-row v-if="isEdificio">
      <v-col
        v-if="isDetailedMode || isDisabledCondition"
        :cols="rowCols"
        class="pt-0 pb-0"
      >
        <v-row no-gutters>
          <v-col class="mr-2">
            <v-select
              :label="$t('selectors.recalculate.vent.label')"
              dense
              outlined
              :disabled="disableSelectors || !isDetailedMode"
              :items="ventItems"
              :item-text="(el) => $t(el.label)"
              :item-value="(el) => el.value"
              v-model="vent"
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              :label="$t('selectors.recalculate.solar.label')"
              dense
              outlined
              :disabled="disableSelectors || !isDetailedMode"
              :items="solarItems"
              :item-text="(el) => $t(el.label)"
              :item-value="(el) => el.value"
              v-model="solar"
            ></v-select>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        v-if="isActiveMode || isDisabledCondition"
        :cols="rowCols"
        class="pt-0 pb-0"
      >
        <v-row no-gutters>
          <v-col class="mr-2">
            <v-text-field
              :label="$t('selectors.recalculate.thermostat.heating')"
              dense
              outlined
              :disabled="disableSelectors || !isActiveMode"
              type="number"
              min="0"
              max="100"
              :rules="rules"
              v-model="heatingTherm"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              :label="$t('selectors.recalculate.thermostat.cooling')"
              dense
              outlined
              :disabled="disableSelectors || !isActiveMode"
              type="number"
              min="0"
              max="100"
              :rules="rules"
              v-model="coolingTherm"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-col :cols="12" class="d-flex">
      <v-btn
        @click="onSubmit"
        :disabled="
          isGeomSelected == false ||
          dimm == null ||
          dimt == null ||
          tipv == null ||
          (isDetailedMode && (!vent || !solar)) ||
          (isActiveMode &&
            (!heatingTherm ||
              !coolingTherm ||
              heatingTherm < 0 ||
              heatingTherm > 101 ||
              coolingTherm < 0 ||
              coolingTherm > 101))
        "
        :style="{
          margin: 'auto',
        }"
        >{{ $t("selectors.recalculate.recalc-button") }}</v-btn
      >
    </v-col>
  </div>
</template>
<script>
import {
  dimmItems,
  dimtItems,
  tipvItems,
  ventItems,
  solarItems,
} from "../utils/selectorsItems";
import RepositoryFactory from "@/repositories/RepositoryFactory";
const visitRepository = RepositoryFactory.get("VisitEntityRepository");

export default {
  props: {
    disableSelectors: {
      type: Boolean,
      mandatory: false,
      default: false,
    },
    cols: {
      type: Number,
      default: 12,
      mandatory: false,
    },
    isDetailedMode: {
      type: Boolean,
      mandatory: false,
    },
    isActiveMode: {
      type: Boolean,
      mandatory: false,
    },
    rowCols: {
      type: Number,
      default: 12,
      mandatory: false,
    },
    isDisabledCondition: {
      type: Boolean,
      default: false,
    },
    isEdificio: {
      type: Boolean,
      default: false,
    },
    isGeomSelected: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dimmItems: dimmItems,
      dimtItems: dimtItems,
      tipvItems: tipvItems,
      ventItems: ventItems,
      solarItems: solarItems,
      dimm: null,
      dimt: null,
      tipv: null,
      vent: null,
      solar: null,
      heatingTherm: null,
      coolingTherm: null,
      rules: [
        (v) => v >= 0 || this.$t("selectors.recalculate.min-error"),
        (v) => v <= 100 || this.$t("selectors.recalculate.max-error"),
      ],
    };
  },
  mounted() {
    this.dimm = this.dimmItems[0].value;
    this.dimt = this.dimmItems[0].value;
    this.tipv = this.tipvItems[0].value;
    this.vent = this.ventItems[0].value;
    this.solar = this.solarItems[0].value;
    this.heatingTherm = 20;
    this.coolingTherm = 27;
  },
  methods: {
    onSubmit() {
      this.$emit("submit-recalc", {
        dimm: this.dimm,
        dimt: this.dimt,
        tipv: this.tipv,
        vent: this.vent,
        solar: this.solar,
        heatingTherm: this.isActiveMode ? this.heatingTherm : null,
        coolingTherm: this.isActiveMode ? this.coolingTherm : null,
        detailedMode: this.isDetailedMode,
        activeMode: this.isActiveMode,
      });
    },
  },
};
</script>
