drop table if exists post;
drop table if exists wanderlist;
drop table if exists following;
drop table if exists comment;
drop table if exists media;

create table if not exists profile(
    profile_id uuid not null,
    activation_token char(32) not null,
    bio varchar(160),
    date_created timestamp not null,
    email varchar(32) not null unique,
    password_hash char(97) not null,
    profile_picture varchar(255),
    user_name varchar(32),
    visibility varchar(128),
    primary key (profile_id)
);

create table if not exists wanderlist(
    wanderlist_id uuid not null,
    profile_id uuid not null,
    date_created timestamp not null,
    description varchar(256),
    pinned boolean,
    status varchar(32),
    target_date date,
    title varchar(64),
    visibility varchar(128) not null,
    foreign key(profile_id) references profile(profile_id),
    primary key (wanderlist_id)
);

create table if not exists post(
    post_id uuid not null,
    wanderlist_id uuid not null,
    content varchar(1000),
    date_created timestamp not null,
    date_modified timestamp not null,
    title varchar(64),
    visibility varchar(128) not null,
    foreign key(wanderlist_id) references wanderlist(wanderlist_id),
    primary key(post_id)
);


