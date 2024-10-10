package es.udc.lbd.gema.lps.model.service.dto;

public class DataDTO {

  private Long id;

  private Double heating;

  private Double lighting;

  private Double cooling;

  private String tc;

  public DataDTO() {}

  public DataDTO(Long id, Double heating, Double lighting, Double cooling, String tc) {
    super();
    this.id = id;
    this.heating = heating;
    this.lighting = lighting;
    this.cooling = cooling;
    this.tc = tc;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Double getHeating() {
    return heating;
  }

  public void setHeating(Double heating) {
    this.heating = heating;
  }

  public Double getLighting() {
    return lighting;
  }

  public void setLighting(Double lighting) {
    this.lighting = lighting;
  }

  public Double getCooling() {
    return cooling;
  }

  public void setCooling(Double cooling) {
    this.cooling = cooling;
  }

  public String getTc() {
    return tc;
  }

  public void setTc(String tc) {
    this.tc = tc;
  }
}
