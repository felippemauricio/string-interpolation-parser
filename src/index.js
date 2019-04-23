const replaceStringByContext = (stringToReplace, context) => stringToReplace
  .replace(/{{(.*?)}}/g, (_, group) => group
    .trim()
    .split(/[.[\]]/)
    .reduce((prevState, contextKey) => [
      ...prevState,
      ...(contextKey ? [contextKey] : []),
    ], [])
    .reduce((prevState, contextKey) => (prevState[contextKey] || ''), context));

const parser = (params, context) => Object.keys(params).reduce((prevState, paramsKeys) => {
  const paramValue = params[paramsKeys];
  if (!['string', 'number'].includes(typeof paramValue)) {
    return prevState;
  }
  return {
    ...prevState,
    [paramsKeys]: (
      typeof paramValue === 'number' ? paramValue
        : replaceStringByContext(paramValue, context)
    ),
  };
}, {});

export default parser;
