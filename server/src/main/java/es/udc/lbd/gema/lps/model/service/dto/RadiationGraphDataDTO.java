package es.udc.lbd.gema.lps.model.service.dto;

import java.util.List;

public class RadiationGraphDataDTO {
  List<List<Double>> ghi;
  List<List<Double>> tshg;
  List<List<Double>> tin;
  List<List<Double>> tout;

  public RadiationGraphDataDTO() {
    super();
  }

  public RadiationGraphDataDTO(
      List<List<Double>> ghi,
      List<List<Double>> tshg,
      List<List<Double>> tin,
      List<List<Double>> tout) {
    super();
    this.ghi = ghi;
    this.tshg = tshg;
    this.tin = tin;
    this.tout = tout;
  }

  public List<List<Double>> getGhi() {
    return ghi;
  }

  public void setGhi(List<List<Double>> ghi) {
    this.ghi = ghi;
  }

  public List<List<Double>> getTshg() {
    return tshg;
  }

  public void setTshg(List<List<Double>> tshg) {
    this.tshg = tshg;
  }

  public List<List<Double>> getTin() {
    return tin;
  }

  public void setTin(List<List<Double>> tin) {
    this.tin = tin;
  }

  public List<List<Double>> getTout() {
    return tout;
  }

  public void setTout(List<List<Double>> tout) {
    this.tout = tout;
  }
}
