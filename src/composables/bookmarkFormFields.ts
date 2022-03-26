import { string as yupString } from 'yup';
import { useField } from 'vee-validate';

export function useBookmarkFormFields() {
  const {
    value: bookmarkName,
    errorMessage: bookmarkNameError,
    validate: validatebookmarkName
  } = useField<string>('bookmarkFormName', yupString().required());

  const {
    value: bookmarkUrl,
    errorMessage: bookmarkUrlError,
    validate: validatebookmarkUrl
  } = useField<string>('bookmarkUrl', yupString().url().required());

  const {
    value: bookmarkTag,
    errorMessage: bookmarkTagError,
    validate: validatebookmarkTag,
    resetField: resetbookmarkTag
  } = useField<string>('bookmarkTag', yupString().min(1), {
    validateOnValueUpdate: false
  });

  return {
    bookmarkName,
    bookmarkNameError,
    validatebookmarkName,
    bookmarkUrl,
    bookmarkUrlError,
    validatebookmarkUrl,
    bookmarkTag,
    bookmarkTagError,
    validatebookmarkTag,
    resetbookmarkTag
  };
}
