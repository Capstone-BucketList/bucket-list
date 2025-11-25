drop table if exists follow;
drop table if exists comment;
drop table if exists media;
drop table if exists post;
drop table if exists wanderlist;
drop table if exists profile;

create table if not exists profile(
    id uuid primary key not null,
    activation_token char(32) not null,
    bio varchar(160),
    date_created date not null,
    email varchar(128) not null unique,
    password_hash char(97) not null,
    profile_picture varchar(255),
    user_name varchar(32),
    visibility varchar(32)
);

create table if not exists wanderlist(
    id uuid primary key not null,
    profile_id uuid not null,
    date_created date not null,
    description varchar(256),
    pinned boolean,
    wanderlist_status varchar(32),
    target_date date,
    title varchar(64),
    visibility varchar(32) not null,
    foreign key(profile_id) references profile(id)

);
create index on wanderlist(profile_id);

create table if not exists post(
    id uuid primary key not null,
    wanderlist_id uuid not null,
    content varchar(1000) not null,
    datetime_created timestamptz not null,
    datetime_modified timestamptz not null,
    title varchar(64) not null,
    visibility varchar(32) not null,
    foreign key(wanderlist_id) references wanderlist(id)
);
create index on post(wanderlist_id);

create table if not exists follow(
    followed_profile_id uuid not null,
    follower_profile_id uuid not null,
    foreign key(followed_profile_id) references profile(id),
    foreign key(follower_profile_id) references profile(id),
    primary key (followed_profile_id, follower_profile_id)
);

create index on follow(followed_profile_id);
create index on follow(follower_profile_id);

create table if not exists comment(
    id uuid primary key not null,
    post_id uuid not null,
    profile_id uuid not null,
    comment varchar(160),
    date_created timestamp not null,
    foreign key(post_id) references post(id),
    foreign key(profile_id) references profile(id)
    );
create index on comment(post_id);
create index on comment(profile_id);

create table if not exists media(
    id uuid primary key not null,
    post_id uuid not null,
    url varchar(255),
    foreign key(post_id) references post(id)
);
create index on media(post_id);

-- create table if not exists sharedstories (
--     id UUID PRIMARY KEY,
--     date_created timestamp not null,
--     title VARCHAR(64) NOT NULL,
--     content TEXT NOT NULL,
--     user_name VARCHAR(32) NOT NULL
-- );

