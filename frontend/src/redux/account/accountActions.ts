export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';

const updateAccountAction = payload => ({ type: UPDATE_ACCOUNT, payload });

/**
 * updateVersion - Updates current version of the docs the user is viewing
 *
 * @param {object} account - Object of new account information
 * @returns {function}
 */

export const updateAccount = account => dispatch => dispatch(updateAccountAction(account));
