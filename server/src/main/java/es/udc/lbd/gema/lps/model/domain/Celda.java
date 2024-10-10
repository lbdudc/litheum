package es.udc.lbd.gema.lps.model.domain;

import jakarta.persistence.*;
import jakarta.persistence.Column;
import org.locationtech.jts.geom.Geometry;

@Entity(name = "t_celda")
@Table(name = "t_celda")
public class Celda {
  @Id
  @Column(name = "id", unique = true)
  private Long id;

  @Column(name = "geom", columnDefinition = "geometry(Geometry, 4326)")
  private Geometry geom;

  @Column(name = "cooling")
  private Double cooling;

  @Column(name = "lighting")
  private Double lighting;

  @Column(name = "heating")
  private Double heating;

  @Column(name = "gsi")
  private Double gsi;

  @Column(name = "fsi")
  private Double fsi;

  @Column(name = "tc")
  private String tc;

  @Column(name = "comp")
  private Double comp;

  public Celda() {}

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
}
