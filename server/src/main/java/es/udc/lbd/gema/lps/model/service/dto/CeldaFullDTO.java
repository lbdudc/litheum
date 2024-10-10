package es.udc.lbd.gema.lps.model.service.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import es.udc.lbd.gema.lps.model.domain.*;
import es.udc.lbd.gema.lps.model.util.jackson.CustomGeometryDeserializer;
import es.udc.lbd.gema.lps.model.util.jackson.CustomGeometrySerializer;
import org.locationtech.jts.geom.Geometry;

public class CeldaFullDTO {
  private Long id;

  @JsonSerialize(using = CustomGeometrySerializer.class)
  @JsonDeserialize(using = CustomGeometryDeserializer.class)
  private Geometry geom;

  private Double cooling;
  private Double lighting;
  private Double heating;
  private Double gsi;
  private Double fsi;
  private String tc;
  private Double comp;

  public CeldaFullDTO() {}

  public CeldaFullDTO(Celda celda) {
    this.id = celda.getId();
    this.geom = celda.getGeom();
    this.cooling = celda.getCooling();
    this.lighting = celda.getLighting();
    this.heating = celda.getHeating();
    this.gsi = celda.getGsi();
    this.fsi = celda.getFsi();
    this.tc = celda.getTc();
    this.comp = celda.getComp();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Geometry getGeom() {
    return geom;
  }

  public void setGeom(Geometry geom) {
    this.geom = geom;
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

  public String getTc() {
    return tc;
  }

  public void setTc(String tc) {
    this.tc = tc;
  }

  public Double getComp() {
    return comp;
  }

  public void setComp(Double comp) {
    this.comp = comp;
  }

  public Celda toCelda() {
    Celda celda = new Celda();
    celda.setId(this.getId());
    celda.setGeom(this.getGeom());
    celda.setCooling(this.getCooling());
    celda.setLighting(this.getLighting());
    celda.setHeating(this.getHeating());
    celda.setGsi(this.getGsi());
    celda.setFsi(this.getFsi());
    celda.setTc(this.getTc());
    celda.setComp(this.getComp());
    return celda;
  }
}
