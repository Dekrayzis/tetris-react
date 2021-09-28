
/**
 * Formats a number to include a comma for each 1000th number.
 * @param {integer} x - number to be formatted.
 * @private 
 */
export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}