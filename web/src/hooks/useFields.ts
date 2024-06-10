import { useCallback, useMemo, useState } from 'react';

export default function useFields<T>(initFields: T) {
  const [fields, setFields] = useState(initFields);

  const resetFields = useCallback(() => {
    setFields(initFields);
  }, [setFields, initFields]);

  const setField = useCallback(
    (update: Partial<T> | ((fields: T) => Partial<T>)) => {
      setFields((prevFields) => ({
        ...prevFields,
        ...(typeof update === 'function' ? update(prevFields) : update),
      }));
    },
    [setFields],
  );

  return useMemo(() => {
    return {
      fields,
      setField,
      resetFields,
    };
  }, [fields, setField, resetFields]);
}
