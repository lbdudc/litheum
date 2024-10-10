package es.udc.lbd.gema.lps.model.service.dto;

public class BoundsDTO {
  private Double xmax;
  private Double xmin;
  private Double ymin;
  private Double ymax;

  public BoundsDTO() {
    super();
  }

  public BoundsDTO(Double xmin, Double xmax, Double ymin, Double ymax) {
    super();
    this.xmax = xmax;
    this.xmin = xmin;
    this.ymin = ymin;
    this.ymax = ymax;
  }

  public Double getXmax() {
    return xmax;
  }

  public void setXmax(Double xmax) {
    this.xmax = xmax;
  }

  public Double getXmin() {
    return xmin;
  }

  public void setXmin(Double xmin) {
    this.xmin = xmin;
  }

  public Double getYmin() {
    return ymin;
  }

  public void setYmin(Double ymin) {
    this.ymin = ymin;
  }

  public Double getYmax() {
    return ymax;
  }

  public void setYmax(Double ymax) {
    this.ymax = ymax;
  }
}
