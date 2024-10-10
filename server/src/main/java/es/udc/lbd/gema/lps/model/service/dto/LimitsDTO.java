package es.udc.lbd.gema.lps.model.service.dto;

public class LimitsDTO {
  private Double minValue;
  private Double maxValue;

  public LimitsDTO() {
    super();
  }

  public LimitsDTO(Double min, Double max) {
    super();
    this.minValue = min;
    this.maxValue = max;
  }

  public Double getMinValue() {
    return minValue;
  }

  public void setMinValue(Double minValue) {
    this.minValue = minValue;
  }

  public Double getMaxValue() {
    return maxValue;
  }

  public void setMaxValue(Double maxValue) {
    this.maxValue = maxValue;
  }
}
