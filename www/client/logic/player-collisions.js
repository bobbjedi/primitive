import $u from './utills';

/**
 * натыкание на стены
 */

export default (wall, lastValidPosition) => {
    console.log({ wall, lastValidPosition });
    lastValidPosition && document.getElementById('player').setAttribute('position', lastValidPosition);
};
