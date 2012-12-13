-- find nearest road segment to 1km centroid for dublin area

-- calculate this now at 10km intervals
DROP TABLE dublin_driving_distance;
CREATE TABLE dublin_driving_distance AS
SELECT (t2.table_dist).fish_id,
	   (t2.table_dist).road_id,
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