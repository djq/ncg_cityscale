-- generate a fishnet that covers entire greater dublin area
-- find road segment closest to centroid and relate cell value to road_id

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

DROP TABLE _fishnet_dublin_test;
CREATE TABLE _fishnet_dublin_test as
SELECT 
	--generate_series(1,25560) as gid, -- max value is nrows * ncols
	--ST_SetSRID(ST_CreateFishnet(213, 120, 1000, 1000, -788694, 6956099), 900913) AS geom;
	-- using temporary values for testing
	generate_series(1,2500) as fish_id, -- max value is nrows * ncols
	ST_SetSRID(ST_CreateFishnet(50, 50, 1000, 1000, -788694, 6956099), 900913) AS geom;

CREATE UNIQUE INDEX idx_fishnet_dublin_test ON _fishnet_dublin_test (fish_id);
CREATE INDEX idx_spatial_fishnet_dublin_test ON _fishnet_dublin_test USING gist (geom);


-- now calculate centrois of all of these cells and store as a table
DROP TABLE _fishnet_centroid_test;
CREATE TABLE _fishnet_centroid_test AS 
SELECT 
	f.fish_id,
	ST_Centroid(f.geom) as geom	
FROM _fishnet_dublin_test as f;

CREATE UNIQUE INDEX idx_fishnet_centroid_test ON _fishnet_centroid_test (fish_id);
CREATE INDEX idx_spatial_fishnet_centroid_test ON _fishnet_centroid_test USING gist (geom);


-- find road segment closest to each fishnet point
DROP TABLE _fishnet_distances_test;
CREATE TABLE _fishnet_distances_test AS 

	WITH tmp_distances as (
	SELECT
		f.fish_id,	
		d.geom,
		d.source as road_id,
		st_distance(ST_Centroid(d.geom), f.geom) as distance
	FROM 
		_fishnet_centroid_test as f,
		dublin_traffic as d
	WHERE ST_DWithin(d.geom, f.geom, 1000)
	AND ST_Distance(ST_Centroid(d.geom), f.geom) > 0
	ORDER BY ST_Centroid(d.geom) <-> f.geom),

	-- now from table _test_distances get minimum distance
	min_distances as (
	SELECT
		fish_id,	
		MIN(distance) as distance
	FROM tmp_distances
	GROUP BY fish_id)

	-- join tmp_distances and min_distances
	SELECT
		t.fish_id,
		t.geom,
		t.road_id
	FROM min_distances as m	
	LEFT OUTER JOIN tmp_distances as t	
	ON m.fish_id = t.fish_id 
	and m.distance = t.distance;
	CREATE INDEX idx_spatial_fishnet_distances_test ON _fishnet_distances_test USING gist (geom);

-- join fishnet centroid gid and nearest road to original fishnet polygon table
DROP TABLE _fishnet_road_source_test;
CREATE TABLE _fishnet_road_source_test as
SELECT 
	f.fish_id,
	f.geom,
	t.road_id
FROM 
	_fishnet_distances_test as t
LEFT OUTER JOIN 
	_fishnet_dublin_test as f
ON t.fish_id = f.fish_id;

--CREATE UNIQUE INDEX idx_fishnet_road_source ON _fishnet_road_source (fish_id);
--CREATE INDEX idx_spatial_fishnet_road_source_test ON _fishnet_road_source_test USING gist (geom);












