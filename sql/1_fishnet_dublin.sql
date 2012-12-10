-- generate a fishnet that covers entire greater dublin area
-- find road segment closest to centroid 

/*

SELECT ST_Extent(geom) FROM dublin_traffic
"BOX(-788694.907595197 6956099.32479378,-669072.585789414 7169086.58934792)"

x: 788694 - 669072
[1] 119622

> 119622 / 250
[1] 478.488

y: 7169086 - 6956099
[1] 212987

> 212987 / 250
[1] 851.948

*/

DROP TABLE _fishnet_dublin;
CREATE TABLE _fishnet_dublin as
SELECT 
	--generate_series(1,25560) as gid, -- max value is nrows * ncols
	--ST_SetSRID(ST_CreateFishnet(213, 120, 1000, 1000, -788694, 6956099), 900913) AS geom;
	-- using temporary values for testing
	generate_series(1,2500) as gid, -- max value is nrows * ncols
	ST_SetSRID(ST_CreateFishnet(50, 50, 1000, 1000, -788694, 6956099), 900913) AS geom;

CREATE UNIQUE INDEX idx_test_fishnet ON _fishnet_dublin (gid);
CREATE INDEX idx_spatial_test_fishnet ON _fishnet_dublin USING gist (geom);


-- now calculate centrois of all of these cells and store as a table
CREATE TABLE _fishnet_centroid AS 
SELECT 
	f.gid,
	ST_Centroid(f.geom) as geom	
FROM _fishnet_dublin as f;

CREATE UNIQUE INDEX idx_fishnet_centroid ON _fishnet_centroid (gid);
CREATE INDEX idx_spatial_fishnet_centroid ON _fishnet_centroid USING gist (geom);


-- find road segment closest to each fishnet point
/* (considering php query to find road closest to addres)
SELECT source
	 		FROM dublin_traffic
	 		WHERE ST_DWithin(ST_Transform(st_setsrid(st_makepoint($y1, $x1),4326), 900913), geom, 100.0) 
			ORDER BY geom <-> ST_Transform(st_setsrid(st_makepoint($y1, $x1),4326), 900913)
			LIMIT 1;
*/

DROP TABLE _test_distances;
CREATE TABLE _test_distances AS 

	WITH tmp_distances as (
	SELECT
		f.gid as gid,	
		d.geom,
		d.source as road_id,
		st_distance(ST_Centroid(d.geom), f.geom) as distance
	FROM 
		_fishnet_centroid as f,
		dublin_traffic as d
	WHERE ST_DWithin(d.geom, f.geom, 1000)
	AND ST_Distance(ST_Centroid(d.geom), f.geom) > 0
	ORDER BY ST_Centroid(d.geom) <-> f.geom),

	-- now from table _test_distances get minimum distance
	min_distances as (
	SELECT
		gid,	
		MIN(distance) as distance
	FROM tmp_distances
	GROUP BY gid)

	-- join tmp_distances and min_distances
	SELECT
		t.*
	FROM min_distances as m	
	LEFT OUTER JOIN tmp_distances as t	
	ON m.gid = t.gid 
	and m.distance = t.distance


-- join fishnet centroid gid and nearest road to original fishnet polygon table
DROP TABLE _fishnet_road_source;
CREATE TABLE _fishnet_road_source as
SELECT 
	f.*,
	t.road_id
FROM 
	_test_distances as t
LEFT OUTER JOIN 
	_fishnet_dublin as f
ON t.gid = f.gid












