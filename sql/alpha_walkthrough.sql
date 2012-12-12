-- update dublin_traffic with length of geometries
-- add a new column
ALTER TABLE dublin_traffic ADD length numeric(10,3);
-- update with length
UPDATE dublin_traffic 
SET length = ST_Length(geom);

-- now create a table of nodes 
DROP TABLE dublin_nodes;
CREATE TABLE dublin_nodes AS
SELECT
  source,
  ST_SetSRID(ST_MakePoint(x2, y2), 900913) as geom
FROM dublin_traffic;
--CREATE UNIQUE INDEX idx_dublin_nodes ON dublin_nodes (source);
CREATE INDEX idx_spatial_dublin_nodes ON dublin_nodes USING gist (geom);

-- now start to construct reach using great instructions from here:
-- http://underdark.wordpress.com/2011/09/25/a-closer-look-at-alpha-shapes-in-pgrouting/
-- first calculate cost within 10 km distance from random node "4052"
-- a 10 km catchment zone around node #4052 in osm road network
-- join the results of driving_distance() with the table containing node geometries
DROP TABLE tmp_cost;
CREATE TABLE tmp_cost AS
SELECT *
   FROM dublin_nodes
   JOIN
   (SELECT * FROM driving_distance('
      SELECT gid AS id,
          source::int4 AS source,
          target::int4 AS target,
          length::float8 AS cost
      FROM dublin_traffic',
      4052,
      10000,
      false,
      false)) AS route
   ON
   dublin_nodes.id = route.vertex_id;

   -- there is something strange going on here
   -- can't tell if it is the points joining on the wrong ID, or something else
    DROP TABLE tmp_cost;
    CREATE TABLE tmp_cost AS
    SELECT 
       d.geom,
       route.cost
       FROM dublin_traffic as d
       JOIN
       (SELECT * FROM driving_distance('
          SELECT gid AS id,
              source::int4 AS source,
              target::int4 AS target,
              length::float8 AS cost
          FROM dublin_traffic',
          4052,
          10000,
          false,
          false)) AS route
       ON
       d.target = route.vertex_id;
       -- this works fine (must be a problem with nodes/node ID)


-- The following queries create the table and insert an alpha shape for all points with a cost of less than 1500:
-- this uses a ConvexHull (is concave more appropriate?)
DROP TABLE home_isodist;
CREATE TABLE home_isodist (gid serial, max_cost double precision);
SELECT AddGeometryColumn('home_isodist','geom',900913,'POLYGON',2);

-- convex
/*
INSERT INTO home_isodist (max_cost, geom) (
  SELECT 
    1500, 
    ST_ConvexHull(ST_Collect(geom)) As geom
  FROM tmp_cost 
  WHERE cost < 1500);
*/

-- concave
INSERT INTO home_isodist (max_cost, geom) (
  SELECT 
    500, 
    ST_ConcaveHull(ST_Collect(geom), 0.85) As geom
  FROM tmp_cost 
  WHERE cost < 500);

INSERT INTO home_isodist (max_cost, geom) (
  SELECT 
    1000, 
    ST_ConcaveHull(ST_Collect(geom), 0.85) As geom
  FROM tmp_cost 
  WHERE cost < 1000);

  INSERT INTO home_isodist (max_cost, geom) (
  SELECT 
    1500, 
    ST_ConcaveHull(ST_Collect(geom), 0.85) As geom
  FROM tmp_cost 
  WHERE cost < 1500);

  INSERT INTO home_isodist (max_cost, geom) (
  SELECT 
    2000, 
    ST_ConcaveHull(ST_Collect(geom), 0.85) As geom
  FROM tmp_cost 
  WHERE cost < 2000);

-- currently loading using mapserver


-- to produce a PNG directly (instead of via mapserver)
-- not sure if I can align boundaries with map image
SELECT encode(
              ST_AsPNG(
                        ST_AsRaster(geom, 400, 400, '2BUI')
                        ), 
              'base64')
FROM home_isodist
WHERE max_cost = 1500;

-- need to make this work with model simulation output
/*   
DROP TABLE tmp_cost;
CREATE TABLE tmp_cost AS
SELECT 
  *  
   FROM network_nodes as d
   JOIN
   (SELECT * FROM driving_distance('
      SELECT gid AS id,
          fromid::int4 as source,
          toid::int4 AS target,
          length::float8 AS cost
      FROM network_links',
      319029606,
      1000,
      false,
      false)) AS r
   ON
   d.id::int4 = r.vertex_id
*/




