CREATE OR REPLACE FUNCTION _myfunction(
	_fid    integer,
	_rid    integer	
	)
RETURNS VOID AS $$ 
BEGIN    
	BEGIN
		INSERT INTO _ncg_isodist_dublin (fid, rid, cost, geom) (
		SELECT 
		_fish_id,	
		_road_id,
		500, 
		ST_ConcaveHull(ST_Collect(geom), 0.85) As geom
		FROM dublin_driving_distance as d
		WHERE _fid = fid);
	END;
  END;
$$ LANGUAGE plpgsql;



SELECT *
FROM (SELECT _ncg_isodist(t.fish_id, t.road_id) as table_dist
     FROM dublin_driving_distance as t 
     LIMIT 100) as t2;

TopologyException: found non-noded intersection
CREATE TABLE _ncg_isodist_dublin_tmp as
SELECT DISTINCT *
FROM _ncg_isodist_dublin

SELECT COUNT(*)
FROM dublin_driving_distance
LIMIT 200;

DROP TABLE _ncg_isodist_dublin;
CREATE TABLE _ncg_isodist_dublin (fish_id integer, road_id integer, max_cost double precision);
SELECT AddGeometryColumn('_ncg_isodist_dublin','geom',900913,'GEOMETRYCOLLECTION',2);


INSERT INTO _ncg_isodist_dublin (fish_id, road_id, max_cost, geom) (
SELECT	7072, 32538, 500,
	x.cgeom as geom
FROM
	(SELECT 
		ST_Collect(geom) As cgeom
	FROM dublin_driving_distance as d
		WHERE cost <= 500
		AND d.fish_id = 7072
		AND d.road_id = 32538) as x)
WHERE GeometryType(x.cgeom) = 'POLYGON' 
AND ST_IsValid(x.cgeom) = true)

SELECT ST_ConcaveHull(geom, 0.85) FROM _ncg_isodist_dublin

create table dublin_driving_distance_u as
SELECT DISTINCT
	fish_id, road_id, route_id, cost
FROM
dublin_driving_distance

drop table dublin_driving_distance_u_geom;
create table dublin_driving_distance_u_geom as 
SELECT 
	u.fish_id, 
	u.road_id, 
	u.route_id, 
	u.cost,
	u.geom
FROM dublin_driving_distance  as u
JOIN  dublin_driving_distance_u as d
ON  u.fish_id =  d.fish_id
and u.road_id = d.road_id
and u.route_id = d.route_id;

CREATE INDEX idx_dublin_driving_distance ON dublin_driving_distance (fish_id);
CREATE INDEX idx_spatial_dublin_driving_distance ON dublin_driving_distance USING gist (geom);


drop table _test_conc;
create table _test_conc as
SELECT	x.*
FROM
	(SELECT 
		ST_ConcaveHull(geom, 0.85) as cgeom
	 FROM _ncg_isodist_dublin as d
	 WHERE max_cost = 500
		) as x
WHERE GeometryType(x.cgeom) = 'POLYGON' 
AND ST_IsValid(x.cgeom) = true

select distinct * from _test_conc;

