
# Conceptual Model

## Entities

**profile**: Represents user profiles containing personal information and preferences.
* Attributes: 
  * profile_id (Primary Key), 
  * activation_token, 
  * bio,
  * date_created,
  * email,
  * password_hash,
  * profile_picture, 
  * user_name,
  * visibility (public, private, following-only),

**post**: Content created by users, such as articles, comments, or reviews.
* Attributes:
  * post_id (Primary Key), 
  * wanderlist_id (Foreign Key),
  * content, 
  * date_created, 
  * date_modified, 
  * title,
  * visibility (public, private, following-only)

**wanderlist**: Represents a collection of items or goals that users want to achieve.
* Attributes:
  * wanderlist_id (Primary Key),
  * profile_id (Foreign Key),
  * date_created,
  * description,
  * pinned, 
  * status,
  * target_date,
  * title,
  * visibility (public, private, following-only)

**follow**
* Attributes:
  * followed_profile_id (Foreign Key),
  * follower_profile_id (Foreign Key)

**comment**
* Attributes: 
  * comment_id (Primary Key),
  * post_id (Foreign Key),
  * profile_id (Foreign Key),
  * comment,
  * date_created

**media**
* Attributes: 
  * media_id (Primary Key),
  * post_id (Foreign Key),
  * url
