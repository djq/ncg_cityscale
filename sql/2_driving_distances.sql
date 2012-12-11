-- find nearest road segment to 1km centroid for dublin area
-- 

-- calculate this now at 10km intervals
DROP TABLE dublin_driving_distance;
CREATE TABLE dublin_driving_distance AS
SELECT (t2.table_dist).road_id,
       (t2.table_dist).cost,
       (t2.table_dist).geom
FROM (SELECT _ncg_driving_distance(t.road_id, 2000.0) as table_dist
     FROM _fishnet_road_source t ) t2;

CREATE UNIQUE INDEX idx_dublin_driving_distance ON dublin_driving_distance (gid);
CREATE INDEX idx_spatial_dublin_driving_distance ON dublin_driving_distance USING gist (geom);

