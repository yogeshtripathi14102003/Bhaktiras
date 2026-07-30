// Importing every model here (even ones a given file doesn't use
// directly) guarantees Mongoose has all schemas registered before any
// populate() call runs — regardless of which API route or page
// happens to execute first in a given server process.
import "./Category";
import "./Bhajan";
import "./Katha";
import "./Saint";
import "./Blog";
import "./Festival";
import "./Quote";
import "./User";
import "./Settings";
import "./Event";
import "./Donation";
import "./Gallery";
import "./LiveStream";
import "./Comment";
import "./Favorite";
import "./Notification";
import "./Banner";
import "./Playlist";
import "./Role";
import "./Permission";
import "./SEO";
import "./Video";
import "./Query";
import "./KathaBooking";
