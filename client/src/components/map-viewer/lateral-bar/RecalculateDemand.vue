<template>
  <div>
    <v-row no-gutters>
      <v-row class="mt-3">
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
      <v-col cols="12" class="d-flex mt-2">
        <v-btn
          @click="onSubmit"
          :disabled="!dimm || !dimt || !tipv"
          :style="{
            margin: 'auto',
          }"
          >{{ $t("selectors.recalculate.recalc-button") }}</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { dimmItems, dimtItems, tipvItems } from "../utils/selectorsItems";
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
  },
  data() {
    return {
      dimmItems: dimmItems,
      dimtItems: dimtItems,
      tipvItems: tipvItems,
      dimm: null,
      dimt: null,
      tipv: null,
    };
  },
  methods: {
    onSubmit() {
      this.$emit("submit-recalc", {
        dimm: this.dimm,
        dimt: this.dimt,
        tipv: this.tipv,
      });
    },
  },
};
</script>
