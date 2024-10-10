package es.udc.lbd.gema.lps.model.repository;

import es.udc.lbd.gema.lps.model.domain.Edificio;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EdificioRepository
    extends JpaRepository<Edificio, Long>, JpaSpecificationExecutor<Edificio> {

  Optional<Edificio> findById(Long pk);

  @Query(
      value =
          "select te.id, te.cooling, te.lighting, te.heating, te.tc, te.ct, te.geom, te.ref_cat from t_edificio te where ST_Intersects(te.geom, ST_MakeEnvelope(:xmin, :ymin, :xmax, :ymax, 4326))",
      nativeQuery = true)
  List<Object[]> getDataByBoundingBox(
      @Param("xmin") Double xmin,
      @Param("xmax") Double xmax,
      @Param("ymin") Double ymin,
      @Param("ymax") Double ymax);

  @Query(
      value =
          "select ST_XMin(geom_extent) AS xmin, ST_XMax(geom_extent) AS xmax, ST_YMin(geom_extent) as ymin, ST_YMax(geom_extent) AS ymax from (select st_extent(geom) as geom_extent from t_edificio) as subquery",
      nativeQuery = true)
  List<Object[]> getMaxBounds();

  @Query(
      value =
          "select min(heating) as minHeating, max(heating) as maxHeating, min(cooling) as minCooling, max(cooling) as maxCooling, min(lighting) as minLighting, max(lighting) as maxLighting from t_edificio",
      nativeQuery = true)
  List<Object[]> getMinMax();

  @Query(value = "select distinct heating from t_edificio order by heating asc", nativeQuery = true)
  List<Double> getHeatingByOrderByHeatingAsc();

  @Query(value = "select distinct cooling from t_edificio order by cooling asc", nativeQuery = true)
  List<Double> getCoolingByOrderByHeatingAsc();

  @Query(
      value = "select distinct lighting from t_edificio order by lighting asc",
      nativeQuery = true)
  List<Double> getLightingByOrderByHeatingAsc();

  @Modifying
  @Query(value = "UPDATE t_edificio SET geom = ST_FlipCoordinates(geom)", nativeQuery = true)
  void flipGeomCoordinates();

  @Query(
      value =
          "select tdt.value as demand_value,"
              + "tdt2.value as dfs_value,"
              + "tdt3.value as dsg_value,"
              + "tht.value as hhl_value,"
              + "tit.value as ihg_value "
              + "from t_demand td"
              + "	join t_edificio te on te.id = td.edificio"
              + "	join t_demand_t tdt on td.id = tdt.demand"
              + "	join t_dfs_t tdt2 on td.id = tdt2.demand"
              + "	join t_dsg_t tdt3 on td.id = tdt3.demand"
              + "	join t_hhl_t tht on td.id = tht.demand"
              + "	join t_ihg_t tit on td.id = tit.demand"
              + "	join t_mes tm on tdt.mes = tm.id"
              + "		and tdt2.mes = tm.id"
              + "		and tdt3.mes = tm.id"
              + "		and tht.mes = tm.id"
              + "		and tit.mes = tm.id"
              + "	where te.ref_cat = :refCat"
              + "	order by tm.id",
      nativeQuery = true)
  List<Object[]> getDemandGraphData(@Param("refCat") String refCat);

  @Query(
      value =
          "select tg.value as ghi_value, "
              + "tt.value as tout_value, "
              + "tt2.value as tin_value, "
              + "tt3.value as tshg_value "
              + "from t_radiation tr "
              + "	join t_edificio te on te.id = tr.edificio "
              + "	join t_ghi tg on tr.id = tg.radiation "
              + "	join t_tout tt on tr.id = tt.radiation "
              + "	join t_tin tt2 on tr.id = tt2.radiation "
              + "	join t_tshg tt3 on tr.id = tt3.radiation "
              + "	join t_mes tm on tg.mes = tm.id "
              + "		and tt.mes = tm.id "
              + "		and tt2.mes = tm.id "
              + "		and tt3.mes = tm.id "
              + "	join t_hora th on tg.hora = th.id "
              + "		and tt.hora = th.id "
              + "		and tt2.hora = th.id "
              + "		and tt3.hora = th.id "
              + "	where te.ref_cat = :refCat "
              + "	order by tm.id, th.id",
      nativeQuery = true)
  List<Object[]> getRadiationGraphData(@Param("refCat") String refCat);
}
