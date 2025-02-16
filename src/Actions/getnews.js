module.exports = (params, res) => {
    // move this into a JSON? file

    let newsTitle = "Asych";

    let newsText = "(use the buttons to scroll down) >>>\n\n";

    newsText += "Welcome to Asych, a server recreation for Async Racing.\n\n"
    newsText += "Its behaviour is definitely not 100% accurate to the original game, and it probably will never be.\n\n";
    newsText += "You will most likely run into an unintended bug, which is an unfortunate reality for stuff like this.\n\n";
    newsText += "Regardless, have fun!\n\n";
    newsText += "To make an account or to log back into it, press \"Play as guest\" after you exit out of this message.\n\n";
    newsText += "If the account already exists and the name isn't spelled wrong, you'll log into your existing account.";

    res.end(require('../Utils').response({
        
        return: "news",
        newstitle: encodeURIComponent(newsTitle),
        newstext: encodeURIComponent(newsText),
        loadaction: "race"

    }));
}