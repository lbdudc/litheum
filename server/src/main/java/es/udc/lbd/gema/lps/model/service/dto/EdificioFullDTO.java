package es.udc.lbd.gema.lps.model.service.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import es.udc.lbd.gema.lps.model.domain.*;
import es.udc.lbd.gema.lps.model.util.jackson.CustomGeometryDeserializer;
import es.udc.lbd.gema.lps.model.util.jackson.CustomGeometrySerializer;
import org.locationtech.jts.geom.Geometry;

public class EdificioFullDTO {
  private Long id;
  private String refCat;

  @JsonSerialize(using = CustomGeometrySerializer.class)
  @JsonDeserialize(using = CustomGeometryDeserializer.class)
  private Geometry geom;

  private Double heating;
  private Double lighting;
  private Double cooling;
  private String tc;
  private Integer constructionYear;
  private String ct;

  public EdificioFullDTO() {}

  public EdificioFullDTO(Edificio edificio) {
    this.id = edificio.getId();
    this.refCat = edificio.getRefCat();
    this.geom = edificio.getGeom();
    this.heating = edificio.getHeating();
    this.lighting = edificio.getLighting();
    this.cooling = edificio.getCooling();
    this.tc = edificio.getTc();
    this.constructionYear = edificio.getConstructionYear();
    this.ct = edificio.getCt();
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

  public Geometry getGeom() {
    return geom;
  }

  public void setGeom(Geometry geom) {
    this.geom = geom;
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

  public Integer getConstructionYear() {
    return constructionYear;
  }

  public void setConstructionYear(Integer constructionYear) {
    this.constructionYear = constructionYear;
  }

  public String getCt() {
    return ct;
  }

  public void setCt(String ct) {
    this.ct = ct;
  }

  public Edificio toEdificio() {
    Edificio edificio = new Edificio();
    edificio.setId(this.getId());
    edificio.setRefCat(this.getRefCat());
    edificio.setGeom(this.getGeom());
    edificio.setHeating(this.getHeating());
    edificio.setLighting(this.getLighting());
    edificio.setCooling(this.getCooling());
    edificio.setTc(this.getTc());
    edificio.setConstructionYear(this.getConstructionYear());
    edificio.setCt(this.getCt());
    return edificio;
  }
}
