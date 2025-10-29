// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table profile {
id uuid [primary key]
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
id uuid
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
id uuid
comment varchar
dateCreated timestamp
}

Table media {
mediaId uuid [primary key]
postId uuid
url url
}

Ref post: post.bucketListId > bucketList.bucketListId

Ref bucketList: bucketList.id > profile.id

Ref follow: follow.followerProfileId > profile.id

Ref follow: follow.followedProfileId > profile.id

Ref comment: comment.postId > post.postId

Ref comment: comment.id > profile.id

Ref media: media.postId > post.postId 