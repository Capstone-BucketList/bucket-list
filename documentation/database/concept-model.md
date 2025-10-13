
# Conceptual Model

## Entities
**Users**: Individuals who interact with the system, including customers, administrators, and support staff.
* Attributes: 
  * userID (Primary Key), 
  * name, 
  * email, 
  * password, 
  * dateCreated,
  * dateOfBirth, 
  * location

**Profile**: Represents user profiles containing personal information and preferences.
* Attributes: 
  * profileId (Primary Key), 
  * userId (Foreign Key),
  * bio, 
  * profilePicture, 
  * interests,
  * lastLogin

**Profile-Settings**: Configuration options for user accounts and application preferences.
* Attributes:
  * settingsId (Primary Key), 
  * userId (Foreign Key), 
  * notifications, 
  * privacy, 
  * theme

**Posts**: Content created by users, such as articles, comments, or reviews.
* Attributes:
  * postId (Primary Key), 
  * userId (Foreign Key), 
  * title, 
  * content, 
  * dateCreated, 
  * dateModified, 
  * privacy

*tag*: Tags associated with posts for better organization and searchability.
* Attributes:
  * postId (Foreign Key), 
  * categoryId (Foreign Key),

**category**: Classifications for organizing posts or products.
* Attributes:
  * categoryId (Primary Key), 
  * name, traveling, food, adventure, culture, family, personal development
  * description

**Bucket-List**: Represents a collection of items or goals that users want to achieve.
* Attributes:
  * bucketListId (Primary Key),
  * userId (Foreign Key),
  * categoryId (Foreign Key),
  * title,
  * description,
  * dateCreated,
  * isCompleted, 
  * targetDate,
  * favorite,
  * isPublic

**Following**
* Attributes:
  * userFollowingId (Foreign Key),
  * userFollowedId (Foreign Key)

**Comments**
* Attributes: 
  * commentId (Primary Key),
  * postId (Foreign Key),
  * userId (Foreign Key),
  * content,
  * dateCreated

**Likes**
* Attributes: 
  * likeId (Primary Key),
  * postId (Foreign Key),
  * userId (Foreign Key)

**Media**
* Attributes: 
  * mediaId (Primary Key),
  * postId (Foreign Key),
  * userId (Foreign Key),
  * mediaType,
  * url,
  * dateUploaded,
  * addToScrapBook, 
  * isPublic

**Discussions**
* Attributes: 
  * discussionId (Primary Key),
  * title,
  * description,
  * dateCreated,
  * content,
  * userId (Foreign Key),
  * mediaId (Foreign Key)

**discussionComments**
* Attributes: 
  * commentId (Primary Key),
  * discussionId (Foreign Key),
  * userId (Foreign Key),
  * comments,
  * dateCreated
  * isLiked
