import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { MeetingSeries } from '/imports/meetingseries';
import { ReactiveVar } from 'meteor/reactive-var';

function getFilteredSeries(queryString) {
    const split = queryString.trim().match(/[^\s]+/g) || [],
        queries = split.map(singleQuery => {
            const regex = new RegExp(singleQuery, 'i');
            return {
                $or: [{name: regex}, {project: regex}]
            };
        });
    
    return MeetingSeries.find({ $and: queries });
}

Template.meetingSeriesList.onCreated(function () {
    this.seriesReady = new ReactiveVar();
    this.searchQuery = new ReactiveVar('');
    this.autorun(() => {
        this.subscribe('meetingSeriesOverview');
        this.seriesReady.set(this.subscriptionsReady());
    });
});

Template.meetingSeriesList.helpers({
    authenticating() {
        const subscriptionReady = Template.instance().seriesReady.get();
        return Meteor.loggingIn() || !subscriptionReady;
    },
    meetingSeriesRow() {
        const searchQuery = Template.instance().searchQuery.get();

        if (searchQuery.trim() === '') {
            return MeetingSeries.find({}, { sort: { lastMinutesDate: -1 } });
        } else {
            const results = getFilteredSeries(searchQuery);
            if (results.count() > 0) {
                return results;
            } else {
                return false;
            }
        }
    },

    meetingSeriesAmountBiggerFour() {
        return MeetingSeries.find().count() > 4;
    },

    updateSearchQuery() {
        const tpl = Template.instance();

        return (query) => {
            tpl.searchQuery.set(query);
        };
    }
});
