import { useReducer, useCallback } from 'react';

const reducer = (state, { payload, type }) => {
  switch (type) {
    case 'onLoadStart':
      return { ...state, loading: true };
    case 'onLoadSuccess':
      return { ...state, loading: false, data: payload };
    case 'onLoadFailed':
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};

export default function useService(service) {
  const [{ loading, data, error }, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null,
  });

  const triggerService = useCallback(async (params) => {
    dispatch({ type: 'onLoadStart' });
    const result = await service(params);
    if (result.success) {
      dispatch({ type: 'onLoadSuccess', payload: result.data });
    } else {
      dispatch({ type: 'onLoadFailed', payload: result.error })
    }
  }, [service]);
  

  return [loading, data, error, triggerService]
};