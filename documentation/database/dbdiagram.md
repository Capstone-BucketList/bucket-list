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

Table posts {
id inte[primary key]
username varchar
role varchar
created_at timestamp
}

Table posts {
id integer [primary key]
title varchar
body text [note: 'Content of the post']
user_id integer [not null]
status varchar
created_at timestamp
}

Ref user_posts: posts.user_id > users.id // many-to-one

Ref: users.id < follows.following_user_id

Ref: users.id < follows.followed_user_id
