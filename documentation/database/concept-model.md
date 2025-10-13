
# Conceptual Model

## Entities

**Profile**: Represents user profiles containing personal information and preferences.
* Attributes: 
  * profileId (Primary Key), 
  * bio,
  * profilePicture, 
  * visibility (public, private, following-only),
  * userName,
  * email,
  * passwordHash,
  * dateCreated

**Posts**: Content created by users, such as articles, comments, or reviews.
* Attributes:
  * postId (Primary Key), 
  * profileId (Foreign Key), 
  * title, 
  * content, 
  * dateCreated, 
  * dateModified, 
  * visibility (public, private, following-only)

**Bucket-List**: Represents a collection of items or goals that users want to achieve.
* Attributes:
  * bucketListId (Primary Key),
  * profileId (Foreign Key),
  * title,
  * description,
  * dateCreated,
  * isCompleted, 
  * targetDate,
  * pinned,
  * visibility (public, private, following-only)

**Following**
* Attributes:
  * followerProfileId (Foreign Key),
  * followedProfileId (Foreign Key)

**Comments**
* Attributes: 
  * commentId (Primary Key),
  * postId (Foreign Key),
  * profileId (Foreign Key),
  * comment,
  * dateCreated

**Media**
* Attributes: 
  * mediaId (Primary Key),
  * postId (Foreign Key),
  * url
