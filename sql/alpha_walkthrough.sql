-- first calculate cost within 10 km distance from random node "42620"
-- I know that node "42620" exists
SELECT * FROM driving_distance('
      SELECT gid AS id,
          source::int4 AS source,
          target::int4 AS target,
          cost::float8 AS cost
      FROM dublin_traffic',
      42620,
      10000,
      false,
      false)

-- now create a table of nodes 
DROP TABLE dublin_nodes;
CREATE TABLE dublin_nodes AS
SELECT
  id,
  ST_MakePoint(y1, x1, 900913) as geom
FROM dublin_traffic;

CREATE UNIQUE INDEX idx_dublin_nodes ON dublin_nodes (id);
CREATE INDEX idx_spatial_dublin_nodes ON dublin_nodes USING gist (geom);

-- update dublin_traffic with length of geometries
-- add a new column
ALTER TABLE dublin_traffic ADD length numeric(10,3);
-- update with length
UPDATE dublin_traffic 
SET length = ST_Length(geom);

-- now start to construct reach
-- join the results of driving_distance() with the table containing node geometries:
SELECT *
   FROM dublin_nodes
   JOIN
   (SELECT * FROM driving_distance('
      SELECT gid AS id,
          source::int4 AS source,
          target::int4 AS target,
          cost::float8 AS cost
      FROM dublin_traffic',
      42620,
      1000,
      false,
      false)) AS route
   ON
   dublin_nodes.id = route.vertex_id

-- http://underdark.wordpress.com/2011/09/25/a-closer-look-at-alpha-shapes-in-pgrouting/
-- a 10 km catchment zone around node #2699 in my osm road network
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



-- The following queries create the table and insert an alpha shape for all points with a cost of less than 1500:
-- test out ST_ConcaveHull
CREATE TABLE home_isodist (id serial, max_cost double precision);
SELECT AddGeometryColumn('home_isodist','the_geom',4326,'POLYGON',2);

INSERT INTO home_isodist (max_cost, the_geom) (
SELECT 1500, ST_SetSRID(the_geom,4326)
FROM 
  points_as_polygon(
    'SELECT id, ST_X(the_geom) AS x, ST_Y(the_geom) AS y FROM home_catchment10km where cost < 1500'));



