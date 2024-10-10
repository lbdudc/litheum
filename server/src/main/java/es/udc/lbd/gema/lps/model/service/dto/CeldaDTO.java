package es.udc.lbd.gema.lps.model.service.dto;

import es.udc.lbd.gema.lps.model.domain.*;

public class CeldaDTO {

  private Double cooling;
  private Double lighting;
  private Double heating;
  private Double gsi;
  private Double fsi;
  private Double comp;
  private Long id;

  public CeldaDTO() {}

  public CeldaDTO(Celda celda) {
    this.cooling = celda.getCooling();
    this.lighting = celda.getLighting();
    this.heating = celda.getHeating();
    this.gsi = celda.getGsi();
    this.fsi = celda.getFsi();
    this.comp = celda.getComp();
    this.id = celda.getId();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Double getCooling() {
    return cooling;
  }

  public void setCooling(Double cooling) {
    this.cooling = cooling;
  }

  public Double getLighting() {
    return lighting;
  }

  public void setLighting(Double lighting) {
    this.lighting = lighting;
  }

  public Double getHeating() {
    return heating;
  }

  public void setHeating(Double heating) {
    this.heating = heating;
  }

  public Double getGsi() {
    return gsi;
  }

  public void setGsi(Double gsi) {
    this.gsi = gsi;
  }

  public Double getFsi() {
    return fsi;
  }

  public void setFsi(Double fsi) {
    this.fsi = fsi;
  }

  public Double getComp() {
    return comp;
  }

  public void setComp(Double comp) {
    this.comp = comp;
  }

  public Celda toCelda() {
    Celda celda = new Celda();
    celda.setCooling(this.getCooling());
    celda.setLighting(this.getLighting());
    celda.setHeating(this.getHeating());
    celda.setGsi(this.getGsi());
    celda.setFsi(this.getFsi());
    celda.setComp(this.getComp());
    return celda;
  }
}
