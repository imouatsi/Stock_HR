import { useState, useCallback } from 'react';

type ValidationRule = {
  rule: (value: string) => boolean;
  message: string;
};

type FormState<T> = {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
};

export const useForm = <T extends Record<string, string>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, ValidationRule[]>> = {}
) => {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
  });

  const validateField = useCallback(
    (name: keyof T, value: string) => {
      const rules = validationRules[name] || [];
      for (const { rule, message } of rules) {
        if (!rule(value)) {
          return message;
        }
      }
      return '';
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (name: keyof T) => (value: string) => {
      setState((prev) => ({
        ...prev,
        values: { ...prev.values, [name]: value },
        errors: { ...prev.errors, [name]: validateField(name, value) },
        touched: { ...prev.touched, [name]: true },
      }));
    },
    [validateField]
  );

  const handleBlur = useCallback(
    (name: keyof T) => () => {
      setState((prev) => ({
        ...prev,
        touched: { ...prev.touched, [name]: true },
      }));
    },
    []
  );

  const validateForm = useCallback(() => {
    const errors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(state.values).forEach((key) => {
      const name = key as keyof T;
      const error = validateField(name, state.values[name]);
      if (error) {
        errors[name] = error;
        isValid = false;
      }
    });

    setState((prev) => ({
      ...prev,
      errors,
      touched: Object.keys(prev.values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Partial<Record<keyof T, boolean>>
      ),
    }));

    return isValid;
  }, [state.values, validateField]);

  const resetForm = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
    });
  }, [initialValues]);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  };
}; 