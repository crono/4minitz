import { Meteor } from 'meteor/meteor';

export var GlobalHelpers = {
    'markdown2html': function(text) {
        let html = "<pre>"+text+"</pre>";
        try {
            html = Markdown(text);
        } catch (e) {
            console.error(e);
            console.error("Could not convert markdown to html for:");
            console.error(text);
            throw e;
        }

        // as we embed markdown under a <li> tag in emails we
        // don't want <p> tags to destroy the layout...
        // so we replace "<p>....</p>" to "....<br>"
        html = html.replace(/<p>(.*?)<\/p>/gi, "$1<br>");

        return Spacebars.SafeString(html);
    },

    'doctype': function() {
        let dt = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
        return Spacebars.SafeString(dt);
    },

    'style': function(filename) {
        let style = Assets.getText(filename);
        return Spacebars.SafeString(`<style>${style}</style>`);
    }
};