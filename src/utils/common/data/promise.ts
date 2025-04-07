// Ignore errors from async calls, simple errors are already handled
// ! Note: No need to show user messages
export const alreadyMessaged = (d: undefined | false | any): any => {
    if (d === undefined || d === false) throw new Error(`${d}`);
    return d;
};

export const throwUndefined = <T>(d: undefined | T): T => {
    if (d === undefined) throw new Error(`${d}`);
    return d;
};
