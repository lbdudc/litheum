package es.udc.lbd.gema.lps.model.service.dto;

import java.util.List;

public class FullLimitsDTO {
  private List<LimitsDTO> cooling;
  private List<LimitsDTO> lighting;
  private List<LimitsDTO> heating;

  public FullLimitsDTO() {
    super();
  }

  public FullLimitsDTO(
      List<LimitsDTO> coolingIntervals,
      List<LimitsDTO> lightingIntervals,
      List<LimitsDTO> heatingIntervals) {
    super();
    this.cooling = coolingIntervals;
    this.lighting = lightingIntervals;
    this.heating = heatingIntervals;
  }

  public List<LimitsDTO> getCooling() {
    return cooling;
  }

  public void setCooling(List<LimitsDTO> cooling) {
    this.cooling = cooling;
  }

  public List<LimitsDTO> getLighting() {
    return lighting;
  }

  public void setLighting(List<LimitsDTO> lighting) {
    this.lighting = lighting;
  }

  public List<LimitsDTO> getHeating() {
    return heating;
  }

  public void setHeating(List<LimitsDTO> heating) {
    this.heating = heating;
  }
}
