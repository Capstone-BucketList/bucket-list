// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table profile {
profileId uuid [primary key]
bio varchar
profilePicture url
visibility varchar
userName varchar
email varchar
passwordHash
dateCreated timestamp
}

Table bucketList {
bucketListId uuid [primary key]
profileId integer
title varchar
description varchar
dateCreated timestamp
isCompleted boolean
targetDate date
pinned boolean
visibility varchar
}

Table following {
followerProfileId integer
followedProfileId integer

}

Table comments {
commentId uuid [primary key]
postId integer
profileId integer
comment varchar
dateCreated timestamp
}

Table media {
mediaId uuid [primary key]
postId integer
url url
}

Ref posts: posts.profileId > profile.profileId

Ref: bucketList: bucketList.profileId < profile.profileId

Ref: following: followerProfileId.followedProfileId < followerProfile.followerProfileId