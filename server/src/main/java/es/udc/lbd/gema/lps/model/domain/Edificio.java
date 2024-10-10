package es.udc.lbd.gema.lps.model.domain;

import jakarta.persistence.*;
import jakarta.persistence.Column;
import org.locationtech.jts.geom.Geometry;

@Entity(name = "t_edificio")
@Table(name = "t_edificio")
public class Edificio {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", unique = true)
  private Long id;

  @Column(name = "ref_cat")
  private String refCat;

  @Column(name = "geom", columnDefinition = "geometry(Geometry, 4326)")
  private Geometry geom;

  @Column(name = "heating")
  private Double heating;

  @Column(name = "lighting")
  private Double lighting;

  @Column(name = "cooling")
  private Double cooling;

  @Column(name = "tc")
  private String tc;

  @Column(name = "construction_year")
  private Integer constructionYear;

  @Column(name = "ct")
  private String ct;

  public Edificio() {}

  public void setCooling(Double cooling) {
    this.cooling = cooling;
  }

  public void setTc(String tc) {
    this.tc = tc;
  }

  public String getRefCat() {
    return refCat;
  }

  public void setRefCat(String refCat) {
    this.refCat = refCat;
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

  public String getTc() {
    return tc;
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
}
