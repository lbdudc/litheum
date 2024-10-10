package es.udc.lbd.gema.lps.model.service.dto;

import java.util.List;

public class DemandGraphDataDTO {
  private List<Double> dfs_t;
  private List<Double> dsg_t;
  private List<Double> demand;
  private List<Double> hhl_t;
  private List<Double> ihg_t;

  public DemandGraphDataDTO() {
    super();
  }

  public DemandGraphDataDTO(
      List<Double> dfs_t,
      List<Double> dsg_t,
      List<Double> demand,
      List<Double> hhl_t,
      List<Double> ihg_t) {
    super();
    this.dfs_t = dfs_t;
    this.dsg_t = dsg_t;
    this.demand = demand;
    this.hhl_t = hhl_t;
    this.ihg_t = ihg_t;
  }

  public List<Double> getDfs_t() {
    return dfs_t;
  }

  public void setDfs_t(List<Double> dfs_t) {
    this.dfs_t = dfs_t;
  }

  public List<Double> getDsg_t() {
    return dsg_t;
  }

  public void setDsg_t(List<Double> dsg_t) {
    this.dsg_t = dsg_t;
  }

  public List<Double> getDemand() {
    return demand;
  }

  public void setDemand(List<Double> demand) {
    this.demand = demand;
  }

  public List<Double> getHhl_t() {
    return hhl_t;
  }

  public void setHhl_t(List<Double> hhl_t) {
    this.hhl_t = hhl_t;
  }

  public List<Double> getIhg_t() {
    return ihg_t;
  }

  public void setIhg_t(List<Double> ihg_t) {
    this.ihg_t = ihg_t;
  }
}
