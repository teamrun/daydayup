import expect from 'expect.js';

import {OrderedMap} from "Immutable";
import {findPrevId, findNextId} from '../../lib/store/Helper';

describe('Immutable data helper', function(){

    var _om = OrderedMap({a: 1, b: 2, c: 3})
    it('get prev id of OrderedMap', function(){
        expect(findPrevId(_om, 'c')).to.be('b');
        expect(findPrevId(_om, 'b')).to.be('a');
        expect(findPrevId(_om, 'a')).to.be(undefined);

        // console.log(findPrevId(_om, 'a'));
        // console.log(findPrevId(_om, 'b'));
        // console.log(findPrevId(_om, 'c'));
    });

    it('get next id of OrderedMap', function(){
        expect(findNextId(_om, 'a')).to.be('b');
        expect(findNextId(_om, 'b')).to.be('c');
        expect(findNextId(_om, 'c')).to.be(undefined);

        // console.log(findNextId(_om, 'a'));
        // console.log(findNextId(_om, 'b'));
        // console.log(findNextId(_om, 'c'));
    });
});
