-- find nearest road segment to 1km centroid for dublin area

-- calculate this now at 10km intervals
DROP TABLE dublin_driving_distance;
CREATE TABLE dublin_driving_distance AS
SELECT (t2.table_dist).fish_id,
	   (t2.table_dist).road_id,
	   (t2.table_dist).route_id,
       (t2.table_dist).cost,
       (t2.table_dist).geom
FROM (SELECT _ncg_driving_distance(t.fish_id, t.road_id, 2000.0) as table_dist
     FROM _fishnet_road_source as t ) as t2;

CREATE INDEX idx_dublin_driving_distance ON dublin_driving_distance (fish_id);
CREATE INDEX idx_spatial_dublin_driving_distance ON dublin_driving_distance USING gist (geom);

-- generate isochrones for all of dublin
DROP TABLE _ncg_isodist_dublin;
CREATE TABLE _ncg_isodist_dublin (fish_id integer, road_id integer, max_cost double precision);
SELECT AddGeometryColumn('_ncg_isodist_dublin','geom',900913,'POLYGON',2);

SELECT  *
FROM (SELECT _ncg_isodist(t.fish_id, t.road_id) as table_dist
     FROM dublin_driving_distance as t ) as t2;

--Total query runtime: 5041300 ms.
-- 369624 rows retrieved.

CREATE INDEX idx_dublin_driving_distance ON _ncg_isodist (fish_id);
CREATE INDEX idx_spatial_ncg_isodist ON _ncg_isodist USING gist (geom);



-- then run a query to make sure only distinct values are considered:
CREATE TABLE _ncg_isodist_dublin_tmp as
SELECT DISTINCT *
FROM _ncg_isodist_dublin

SELECT  *
FROM (SELECT _ncg_isodist(t.fish_id, t.road_id, 1250) as table_dist
     FROM dublin_driving_distance as t ) as t2;
SELECT  *
FROM (SELECT _ncg_isodist(t.fish_id, t.road_id, 1500) as table_dist
     FROM dublin_driving_distance as t ) as t2;

SELECT  *
FROM (SELECT _ncg_isodist(t.fish_id, t.road_id, 1750) as table_dist
     FROM dublin_driving_distance as t ) as t2;

SELECT  *
FROM (SELECT _ncg_isodist(t.fish_id, t.road_id, 2000) as table_dist
     FROM dublin_driving_distance as t ) as t2;

ALTER TABLE _test_conc_500 ADD gid SERIAL;
CREATE UNIQUE INDEX idx_test_conc_500 ON _test_conc_500 (gid);
CREATE INDEX idx_spatial_test_conc_500 ON _test_conc_500 USING gist (cgeom);

ALTER TABLE _test_conc_750 ADD gid SERIAL;
CREATE UNIQUE INDEX idx_test_conc_750 ON _test_conc_750 (gid);
CREATE INDEX idx_spatial_test_conc_750 ON _test_conc_750 USING gist (cgeom);


ALTER TABLE _test_conc_1000 ADD gid SERIAL;
CREATE UNIQUE INDEX idx_test_conc_1000 ON _test_conc_1000 (gid);
CREATE INDEX idx_spatial_test_conc_1000 ON _test_conc_1000 USING gist (cgeom);

ALTER TABLE _test_conc_1250 ADD gid SERIAL;
CREATE UNIQUE INDEX idx_test_conc_1250 ON _test_conc_1250 (gid);
CREATE INDEX idx_spatial_test_conc_1250 ON _test_conc_1250 USING gist (cgeom);

ALTER TABLE _test_conc_1500 ADD gid SERIAL;
CREATE UNIQUE INDEX idx_test_conc_1500 ON _test_conc_1500 (gid);
CREATE INDEX idx_spatial_test_conc_1500 ON _test_conc_1500 USING gist (cgeom);

ALTER TABLE _test_conc_1750 ADD gid SERIAL;
CREATE UNIQUE INDEX idx_test_conc_1750 ON _test_conc_1750 (gid);
CREATE INDEX idx_spatial_test_conc_1750 ON _test_conc_1750 USING gist (cgeom);

ALTER TABLE _test_conc_2000 ADD gid SERIAL;
CREATE UNIQUE INDEX idx_test_conc_2000 ON _test_conc_2000 (gid);
CREATE INDEX idx_spatial_test_conc_2000 ON _test_conc_2000 USING gist (cgeom);

-- now handling convex shapes
drop table _test_convex_500;
create table _test_convex_500 as
SELECT  fish_id,	
	road_id,
	500 as max_cost,
	ST_ConcaveHull(ST_buffer(geom, 1), 0.85) as geom
FROM dublin_driving_distance as d
WHERE cost <= 500;
ALTER TABLE _test_convex_500 ADD gid SERIAL;
CREATE UNIQUE INDEX idx_test_convex_500 ON _test_convex_500 (gid);
CREATE INDEX idx_spatial_test_convex_500 ON _test_convex_500 USING gist (geom);

drop table _test_convex_750;
create table _test_convex_750 as
SELECT  fish_id,	
	road_id,
	750 as max_cost,
	ST_ConcaveHull(ST_buffer(geom, 1), 0.85) as geom
FROM dublin_driving_distance as d
WHERE cost <= 750;
ALTER TABLE _test_convex_750 ADD gid SERIAL;
CREATE UNIQUE INDEX idx_test_convex_750 ON _test_convex_750 (gid);
CREATE INDEX idx_spatial_test_convex_7500 ON _test_convex_750 USING gist (geom);

drop table _test_convex_1000;
create table _test_convex_1000 as
SELECT  fish_id,	
	road_id,
	1000 as max_cost,
	ST_ConcaveHull(ST_buffer(geom, 1), 0.85) as geom
FROM dublin_driving_distance as d
WHERE cost <= 1000;
ALTER TABLE _test_convex_1000 ADD gid SERIAL;
CREATE UNIQUE INDEX idx_test_convex_1000 ON _test_convex_1000 (gid);
CREATE INDEX idx_spatial_test_convex_1000 ON _test_convex_1000 USING gist (geom);