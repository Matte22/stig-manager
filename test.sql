
-- the queries used to create my views 
CREATE VIEW enabled_assets AS
SELECT *
FROM asset
WHERE state = 'enabled';
CREATE VIEW enabled_collection AS
SELECT *
FROM collection
WHERE state = 'enabled';

-- test index i made 
CREATE INDEX idx_collectionId_state ON asset (collectionId, state);

-- playing 
explain analyze SELECT * FROM enabled_assets where collectionId = '21';
explain analyze SELECT * FROM asset where collectionId = '21';
explain SELECT * FROM asset where collectionId = '21';
explain SELECT * FROM enabled_assets where collectionId = '21';

explain analyze SELECT * FROM enabled_collection where collectionId = '21';
explain analyze SELECT * FROM collection where collectionId = '21';
explain SELECT * FROM collection where collectionId = '21';
explain SELECT * FROM enabled_collection where collectionId = '21';


-- -- getAssets 

-- get assets colleciton 21 which has 500 enabled and 500 disabled assets, statusStatus and Stigs projection
SELECT 
  CAST(a.assetId as char) as assetId,
  a.name,
  a.fqdn,
  json_object (
      'collectionId', CAST(c.collectionId as char),
      'name', c.name
    ) as "collection",
  a.description,
  a.ip,
  coalesce(
      (select
        json_arrayagg(BIN_TO_UUID(cl.uuid,1))
      from
        collection_label_asset_map cla
        left join collection_label cl on cla.clId = cl.clId
      where
        cla.assetId = a.assetId),
      json_array()
    ) as labelIds,
  a.mac,
  a.noncomputing,
  a.metadata,
  (select json_object(
        'stigCount', COUNT(saStatusStats.benchmarkId),
        'ruleCount', SUM(rStatusStats.ruleCount),
        'acceptedCount', SUM(saStatusStats.accepted),
        'rejectedCount', SUM(saStatusStats.rejected),
        'submittedCount', SUM(saStatusStats.submitted),
        'savedCount', SUM(saStatusStats.saved),
        'minTs', DATE_FORMAT(LEAST(MIN(saStatusStats.minTs), MIN(saStatusStats.maxTs)),'%Y-%m-%dT%H:%i:%sZ'),
        'maxTs', DATE_FORMAT(GREATEST(MAX(saStatusStats.minTs), MAX(saStatusStats.maxTs)),'%Y-%m-%dT%H:%i:%sZ')
        )
        from
          stig_asset_map saStatusStats
          left join enabled_assets aStatusStats using (assetId)
          left join default_rev drStatusStats on (saStatusStats.benchmarkId = drStatusStats.benchmarkId and aStatusStats.collectionId = drStatusStats.collectionId)
          left join revision rStatusStats on drStatusStats.revId = rStatusStats.revId
        where
          FIND_IN_SET(saStatusStats.saId, GROUP_CONCAT(sa.saId))
        ) as "statusStats",
  cast(
        concat('[', 
          coalesce (
            group_concat(distinct 
              case when sa.benchmarkId is not null then 
                json_object(
                  'benchmarkId', sa.benchmarkId, 
                  'revisionStr', revision.revisionStr, 
                  'benchmarkDate', date_format(revision.benchmarkDateSql,'%Y-%m-%d'),
                  'revisionPinned', CASE WHEN dr.revisionPinned = 1 THEN CAST(true as json) ELSE CAST(false as json) END, 
                  'ruleCount', revision.ruleCount)
              else null end 
            order by sa.benchmarkId),
            ''),
        ']')
      as json) as "stigs"
FROM
  enabled_assets a
  left join enabled_collection c on a.collectionId = c.collectionId
  left join stig_asset_map sa on a.assetId = sa.assetId
  left join default_rev dr on (sa.benchmarkId=dr.benchmarkId and a.collectionId = dr.collectionId)
  left join revision on dr.revId = revision.revId
WHERE
  a.collectionId = '21'
GROUP BY
  a.assetId;
  
-- get assets in collection 83 only has 4 assets with 2 disabled and propjections 

SELECT 
  CAST(a.assetId as char) as assetId,
  a.name,
  a.fqdn,
  json_object (
      'collectionId', CAST(c.collectionId as char),
      'name', c.name
    ) as "collection",
  a.description,
  a.ip,
  coalesce(
      (select
        json_arrayagg(BIN_TO_UUID(cl.uuid,1))
      from
        collection_label_asset_map cla
        left join collection_label cl on cla.clId = cl.clId
      where
        cla.assetId = a.assetId),
      json_array()
    ) as labelIds,
  a.mac,
  a.noncomputing,
  a.metadata,
  (select json_object(
        'stigCount', COUNT(saStatusStats.benchmarkId),
        'ruleCount', SUM(rStatusStats.ruleCount),
        'acceptedCount', SUM(saStatusStats.accepted),
        'rejectedCount', SUM(saStatusStats.rejected),
        'submittedCount', SUM(saStatusStats.submitted),
        'savedCount', SUM(saStatusStats.saved),
        'minTs', DATE_FORMAT(LEAST(MIN(saStatusStats.minTs), MIN(saStatusStats.maxTs)),'%Y-%m-%dT%H:%i:%sZ'),
        'maxTs', DATE_FORMAT(GREATEST(MAX(saStatusStats.minTs), MAX(saStatusStats.maxTs)),'%Y-%m-%dT%H:%i:%sZ')
        )
        from
          stig_asset_map saStatusStats
          left join enabled_assets aStatusStats using (assetId)
          left join default_rev drStatusStats on (saStatusStats.benchmarkId = drStatusStats.benchmarkId and aStatusStats.collectionId = drStatusStats.collectionId)
          left join revision rStatusStats on drStatusStats.revId = rStatusStats.revId
        where
          FIND_IN_SET(saStatusStats.saId, GROUP_CONCAT(sa.saId))
        ) as "statusStats",
  cast(
        concat('[', 
          coalesce (
            group_concat(distinct 
              case when sa.benchmarkId is not null then 
                json_object(
                  'benchmarkId', sa.benchmarkId, 
                  'revisionStr', revision.revisionStr, 
                  'benchmarkDate', date_format(revision.benchmarkDateSql,'%Y-%m-%d'),
                  'revisionPinned', CASE WHEN dr.revisionPinned = 1 THEN CAST(true as json) ELSE CAST(false as json) END, 
                  'ruleCount', revision.ruleCount)
              else null end 
            order by sa.benchmarkId),
            ''),
        ']')
      as json) as "stigs"
FROM
  enabled_assets a
  left join enabled_collection c on a.collectionId = c.collectionId
  left join stig_asset_map sa on a.assetId = sa.assetId
  left join default_rev dr on (sa.benchmarkId=dr.benchmarkId and a.collectionId = dr.collectionId)
  left join revision on dr.revId = revision.revId
WHERE
  a.collectionId = '83'
GROUP BY
  a.assetId;

-- -- getAsset 

-- get test asset with [rpjectiopns
SELECT 
  CAST(a.assetId as char) as assetId,
  a.name,
  a.fqdn,
  json_object (
      'collectionId', CAST(c.collectionId as char),
      'name', c.name
    ) as "collection",
  a.description,
  a.ip,
  coalesce(
      (select
        json_arrayagg(BIN_TO_UUID(cl.uuid,1))
      from
        collection_label_asset_map cla
        left join collection_label cl on cla.clId = cl.clId
      where
        cla.assetId = a.assetId),
      json_array()
    ) as labelIds,
  a.mac,
  a.noncomputing,
  a.metadata,
  (select json_object(
        'stigCount', COUNT(saStatusStats.benchmarkId),
        'ruleCount', SUM(rStatusStats.ruleCount),
        'acceptedCount', SUM(saStatusStats.accepted),
        'rejectedCount', SUM(saStatusStats.rejected),
        'submittedCount', SUM(saStatusStats.submitted),
        'savedCount', SUM(saStatusStats.saved),
        'minTs', DATE_FORMAT(LEAST(MIN(saStatusStats.minTs), MIN(saStatusStats.maxTs)),'%Y-%m-%dT%H:%i:%sZ'),
        'maxTs', DATE_FORMAT(GREATEST(MAX(saStatusStats.minTs), MAX(saStatusStats.maxTs)),'%Y-%m-%dT%H:%i:%sZ')
        )
        from
          stig_asset_map saStatusStats
          left join enabled_assets aStatusStats using (assetId)
          left join default_rev drStatusStats on (saStatusStats.benchmarkId = drStatusStats.benchmarkId and aStatusStats.collectionId = drStatusStats.collectionId)
          left join revision rStatusStats on drStatusStats.revId = rStatusStats.revId
        where
          FIND_IN_SET(saStatusStats.saId, GROUP_CONCAT(sa.saId))
        ) as "statusStats",
  cast(
        concat('[', 
          coalesce (
            group_concat(distinct 
              case when sa.benchmarkId is not null then 
                json_object(
                  'benchmarkId', sa.benchmarkId, 
                  'revisionStr', revision.revisionStr, 
                  'benchmarkDate', date_format(revision.benchmarkDateSql,'%Y-%m-%d'),
                  'revisionPinned', CASE WHEN dr.revisionPinned = 1 THEN CAST(true as json) ELSE CAST(false as json) END, 
                  'ruleCount', revision.ruleCount)
              else null end 
            order by sa.benchmarkId),
            ''),
        ']')
      as json) as "stigs"
FROM
  enabled_assets a
  left join enabled_collection c on a.collectionId = c.collectionId
  left join stig_asset_map sa on a.assetId = sa.assetId
  left join default_rev dr on (sa.benchmarkId=dr.benchmarkId and a.collectionId = dr.collectionId)
  left join revision on dr.revId = revision.revId
WHERE
  a.assetId = '42'
GROUP BY
  a.assetId;



-- -- getCollections
-- elevated has a few disabled ones with stats
WITH cteGrantees as (select 
  cg.collectionId,
  cast(cg.userId as char) as userId,
  cg.roleId,
  json_array(json_object('userId', cast(ud.userId as char),'username', ud.username)) as grantees,
  json_array(cg.grantId) as grantIds
from
  collection_grant cg
  inner join enabled_collection c on (cg.collectionId = c.collectionId)
  left join user_data ud on cg.userId = ud.userId
where
    cg.userId is not null
     union select
  collectionId,
  userId,
  roleId,
  grantees,
  grantIds
from
  (select
    ROW_NUMBER() OVER(PARTITION BY ugu.userId, cg.collectionId ORDER BY cg.roleId desc) as rn,
    cg.collectionId, 
    cast(ugu.userId as char) as userId, 
    cg.roleId,
    json_arrayagg(json_object('userGroupId', cast(cg.userGroupId as char),'name', ug.name)) OVER (PARTITION BY ugu.userId, cg.collectionId, cg.roleId) as grantees,
    json_arrayagg(cg.grantId) OVER (PARTITION BY ugu.userId, cg.collectionId, cg.roleId) as grantIds
from 
    collection_grant cg
    inner join enabled_collection c on cg.collectionId = c.collectionId
    left join user_group_user_map ugu on cg.userGroupId = ugu.userGroupId
    left join user_group ug on ugu.userGroupId = ug.userGroupId
    left join user_data ud on ugu.userId = ud.userId
    left join collection_grant cgDirect on (cg.collectionId = cgDirect.collectionId and ugu.userId = cgDirect.userId)
  where
    cg.userGroupId is not null
    and cgDirect.userId is null
    
  ) dt
where
  dt.rn = 1)
SELECT 
  CAST(c.collectionId as char) as collectionId,
  c.name,
  c.description,
  c.settings,
  c.metadata,
  (select
          json_object(
          'created', DATE_FORMAT(c.created, '%Y-%m-%dT%TZ'),
          'userCount', dt4.userCount,
          'assetCount', dt4.assetCount,
          'checklistCount', dt4.checklistCount
          )
          from 
            (SELECT
            (select count(userId) from cteGrantees where collectionId = c.collectionId) as userCount,
            (select count(distinct a.assetId) from enabled_assets a where a.collectionId = c.collectionId) as assetCount,
            (select count(sa.saId) from enabled_assets a left join stig_asset_map sa using (assetId) where a.collectionId = c.collectionId) as checklistCount) dt4
          ) as statistics
FROM
  enabled_collection c
ORDER BY
  c.name;



-- -- getCollection
-- collection 21 (large) no project 
SELECT 
  CAST(c.collectionId as char) as collectionId,
  c.name,
  c.description,
  c.settings,
  c.metadata,
  (select
      coalesce(
        (select json_arrayagg(grantJson) from
          (select
            json_object(
              'grantId', cast(grantId as char),
              'user', json_object(
              'userId', CAST(user_data.userId as char),
              'username', user_data.username,
              'displayName', COALESCE(
                JSON_UNQUOTE(JSON_EXTRACT(user_data.lastClaims, "$.name")),
                user_data.username)),
              'roleId', roleId)
            as grantJson
          from
            collection_grant inner join user_data using (userId) where collectionId = c.collectionId
          UNION
          select
            json_object(
              'grantId', cast(grantId as char),
              'userGroup', json_object(
                'userGroupId', CAST(user_group.userGroupId as char),
                'name', user_group.name,
                'description', user_group.description
                ),
              'roleId', roleId
            ) as grantJson
          from collection_grant inner join user_group using (userGroupId) where collectionId = c.collectionId
        ) as grantJsons)
      , json_array()
      )
    ) as "grants"
FROM
  enabled_collection c
WHERE
  c.collectionId = '21'
