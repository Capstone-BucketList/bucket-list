
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
  * docation
  

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
  * status

*tag*: Tags associated with posts for better organization and searchability.
* Attributes:
  * postI (Foreign Key), 
  * categoryId (Foreign Key),

**category**: Classifications for organizing posts or products.
* Attributes:
  * categoryId (Primary Key), 
  * name, traveling, food, adventure, culture, family, personal development
  * description

**Bucket-List**: Represents a collection of items or goals that users want to achieve.
* Attributes:
