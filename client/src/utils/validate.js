export const validateInputLength = (input, min, max) => {
  if (input.length < min || input.length > max) {
    alert(`Input must have between ${min} and ${max} characters.`);
    return false;
  }
  return true;
};
