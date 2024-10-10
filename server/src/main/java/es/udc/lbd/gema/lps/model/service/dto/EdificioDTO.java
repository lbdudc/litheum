package es.udc.lbd.gema.lps.model.service.dto;

import es.udc.lbd.gema.lps.model.domain.*;

public class EdificioDTO {

  private String refCat;
  private Double heating;
  private Double lighting;
  private Double cooling;
  private Integer constructionYear;
  private Long id;

  public EdificioDTO() {}

  public EdificioDTO(Edificio edificio) {
    this.id = edificio.getId();
    this.refCat = edificio.getRefCat();
    this.heating = edificio.getHeating();
    this.lighting = edificio.getLighting();
    this.cooling = edificio.getCooling();
    this.constructionYear = edificio.getConstructionYear();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getRefCat() {
    return refCat;
  }

  public void setRefCat(String refCat) {
    this.refCat = refCat;
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

  public Integer getConstructionYear() {
    return constructionYear;
  }

  public void setConstructionYear(Integer constructionYear) {
    this.constructionYear = constructionYear;
  }

  public Edificio toEdificio() {
    Edificio edificio = new Edificio();
    edificio.setRefCat(this.getRefCat());
    edificio.setHeating(this.getHeating());
    edificio.setLighting(this.getLighting());
    edificio.setCooling(this.getCooling());
    edificio.setConstructionYear(this.getConstructionYear());
    return edificio;
  }
}
