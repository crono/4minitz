import { Meteor } from 'meteor/meteor';
import { BroadcastMessageCollection } from '/imports/collections/broadcastmessage_private'


export class BroadcastMessage {

    static find(...args) {
        return BroadcastMessageCollection.find(...args);
    }

    static findOne(...args) {
        return BroadcastMessageCollection.findOne(...args);
    }

    static dismissForMe() {
        Meteor.call("broadcastmessage.dismiss");
    }

    // ************************
    // * static server-only methods
    // ************************
    static show(message)
    {
        if (Meteor.isServer) {
            const id = BroadcastMessageCollection.insert({
                text: message,
                createdAt: new Date(),
                dismissForUserIDs: []});
            console.log("New BroadcastMessage "+id+" from Admin: >" + message+"<");
            return id;
        }
    }

    static removeAll () {
        if (Meteor.isServer) {
            console.log("Remove All BroadcastMessages.");
            BroadcastMessageCollection.remove({});
        }
    }

    static remove (id) {
        if (!id || id == "") {
            return;
        }
        if (Meteor.isServer) {
            console.log("Remove BroadcastMessage: " + id);
            BroadcastMessageCollection.remove({_id: id});
        }
    }
}
