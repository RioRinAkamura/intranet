export function phoneFormat(phone: string): string {
  let cleanedPhone = ('' + phone).replace(/\D/g, '');

  if (cleanedPhone.length === 10) {
    return cleanedPhone.replace(/(\d{3})(\d{3})(\d{4})/, `$1 $2 $3`);
  } else if (cleanedPhone.length === 11) {
    return cleanedPhone.replace(/(\d{4})(\d{3})(\d{4})/, `$1 $2 $3`);
  } else {
    // This is temporary, if there are other phone format, add more
    return phone;
  }
}
