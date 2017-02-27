import Realm from 'realm';



let realm = new Realm({
    schema: [{
        name: 'Trees', properties: {
            densities: 'string',
            diseaseRatings: 'string',
            dateCollected: 'date'
        }
    }]
});

export default class realmInterface {


}