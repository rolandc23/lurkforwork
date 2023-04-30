(optional) TODO!

#### Suggested Users
 * When the user is on any profile including their own or the feed page, the site shows a panel of users that the logged in user may know.
 * These users are:
    * Users that watch the logged in user (Watchees), but the user does not watch back.
    * Watchees of the user's watchees (think friends of friends), that the user does not already watch.
 * The panel shows the picture of the above users, their profile picture (or default if none) and a button to watch the user.
 * This panel does not show to users on mobile sized screens

#### Search Bar
* User will be able to filter through their most recent 100 posts on their feed by using the search bar
* Search bar will take a keyword/string as an input and return all posts with relevance (not case-sensitive and whitespace-sensitive)

#### Forgot Password
* Mimics the general interaction you would have with a forgot password form on a generic website
* Asks user for email and user ID (which should be only known to them --> they are warned on registration to have this ID saved somewhere)
* If email and user ID matches --> brings user to another form which allows them to change to new password and confirm it
* This however will not change the password since the limitations of the backend commands do not provide us with the ability to force a change on password without being logged in with a token
