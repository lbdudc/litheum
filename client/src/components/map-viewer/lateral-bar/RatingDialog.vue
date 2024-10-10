<template>
  <div class="dialog-overlay">
    <div class="dialog-content rating-dialog">
      <div class="dialog-header text-h5">
        <div style="text-align: center">
          <img
            src="@/assets/LitheumLogo.png"
            class="pa-2 litheum-logo"
            style="max-width: 25%"
          />
        </div>
      </div>
      <div class="dialog-body">
        <div class="text-center">
          {{ $t("rating-dialog.title") }}
        </div>
        <div class="text-center mt-6">
          <v-row>
            <v-col cols="12">
              <v-rating
                v-model="rating"
                color="yellow darken-3"
                background-color="grey darken-1"
                empty-icon="$ratingFull"
                half-increments
                hover
                large
              ></v-rating>
            </v-col>
            <v-col cols="12" class="pb-0">
              <a
                href="https://forms.office.com/pages/responsepage.aspx?id=PuqhzrJgdU-mwqYCLo-WG_Zq2WSZbZlLtzrUqFytsLhUMlZZWlRSQVMzQk84VEdLVFlWSFUyODlUNy4u"
                target="_blank"
                rel="noopener noreferrer"
                class="link-container"
              >
                <img
                  src="@/assets/qr.png"
                  class="pa-2 link-image rating-logo"
                  style="max-width: 40%"
                />
              </a>
            </v-col>
            <v-col cols="12" class="pt-0">
              <v-btn
                color="green"
                dark
                href="https://forms.office.com/pages/responsepage.aspx?id=PuqhzrJgdU-mwqYCLo-WG_Zq2WSZbZlLtzrUqFytsLhUMlZZWlRSQVMzQk84VEdLVFlWSFUyODlUNy4u"
                target="_blank"
                rel="noopener noreferrer"
                class="access-button"
                small
              >
                {{ $t("rating-dialog.formulary") }}
                <v-icon right>mdi-open-in-new</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </div>
      <div class="dialog-footer">
        <v-btn color="green darken-1" text @click="onClose">
          {{ $t("info-dialog.close") }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { rating: null };
  },
  methods: {
    onClose() {
      this.$emit("close", this.rating);
    },
  },
};
</script>

<style scoped>
.dialog-overlay {
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
  .rating-dialog {
    max-width: 80% !important;
  }
  .litheum-logo {
    max-width: 80% !important;
  }
  .rating-logo {
    max-width: 70% !important;
  }
}

.link-container {
  position: relative;
  display: inline-block;
}

.link-image {
  cursor: pointer;
  transition: filter 0.3s;
}
</style>
