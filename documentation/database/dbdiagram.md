// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table profile {
profileId uuid [primary key]
activationToken char32
bio varchar
dateCreated timestamp
email varchar
passwordHash char97
profilePicture url
userName varchar
visibility varchar
}

Table post {
postId uuid [primary key]
bucketListId uuid
content varchar
dateCreated timestamp
dateModified timestamp
title varchar
visibility varchar
}

Table bucketList {
bucketListId uuid [primary key]
profileId uuid
dateCreated timestamp
description varchar
pinned boolean
status varchar
targetDate date
title varchar
visibility varchar
}

Table follow {
followedProfileId uuid
followerProfileId uuid
}

Table comment {
commentId uuid [primary key]
postId uuid
profileId uuid
comment varchar
dateCreated timestamp
}

Table media {
mediaId uuid [primary key]
postId uuid
url url
}

Ref post: post.bucketListId > bucketList.bucketListId

Ref bucketList: bucketList.profileId > profile.profileId

Ref follow: follow.followerProfileId > profile.profileId

Ref follow: follow.followedProfileId > profile.profileId

Ref comment: comment.postId > post.postId

Ref comment: comment.profileId > profile.profileId

Ref media: media.postId > post.postId 