<template>
  <div>
    <div class="mt-3">
      <v-tooltip left open-delay="200" color="#1976d2">
        <template v-slot:activator="{ on: onInfo, props }">
          <v-btn
            v-bind:color="'white'"
            @click="showInfo"
            v-bind="props"
            v-on="onInfo"
          >
            <v-icon>mdi-information-slab-circle-outline</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("info-dialog.btn-tooltip") }}</span>
      </v-tooltip>
    </div>
    <div v-if="dialog" class="dialog-overlay">
      <div class="dialog-content info-dialog">
        <div class="dialog-header text-h5">
          <div style="text-align: center">
            <img
              src="@/assets/LitheumLogo.png"
              class="pa-2 litheum-logo"
              style="max-width: 25%; min-width: 100px"
            />
          </div>
        </div>
        <div class="dialog-body">
          {{ $t("info-dialog.body.1") }}
          <br /><br />
          {{ $t("info-dialog.body.2") }}
          <br /><br />
          {{ $t("info-dialog.body.3") }}
        </div>
        <div class="dialog-footer">
          <div style="display: flex">
            <div style="display: flex">
              <v-simple-checkbox
                dense
                v-model="skipDialog"
                color="green"
              ></v-simple-checkbox>
              <v-label
                style="margin-top: auto; margin-bottom: auto; text-align: left"
              >
                {{ $t("info-dialog.not-show") }}
              </v-label>
            </div>
            <v-btn
              style="margin-left: auto"
              color="green darken-1"
              text
              @click="onClose"
            >
              {{ $t("info-dialog.close") }}
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
      skipDialog: false,
    };
  },
  mounted() {
    this.dialog = JSON.parse(localStorage.getItem("show-dialog") || "true");
    this.skipDialog = !this.dialog;
  },
  methods: {
    onClose() {
      this.dialog = false;
      localStorage.setItem("show-dialog", !this.skipDialog);
    },
    showInfo() {
      this.dialog = true;
    },
  },
};
</script>
<style scoped>
.pre-formatted {
  white-space: pre;
}
.dialog-overlay {
  overflow-y: auto;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.dialog-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 50%;
  width: 100%;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dialog-header,
.dialog-body,
.dialog-footer {
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
}

.access-button {
  margin-top: 0; /* Remove the default margin */
}

@media only screen and (max-width: 1280px) {
  .info-dialog {
    max-width: 80% !important;
    height: 95%;
  }
  .litheum-logo {
    max-width: 80% !important;
  }
}
</style>
