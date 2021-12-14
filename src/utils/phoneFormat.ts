export function phoneFormat(phone: string): string {
  if (phone.length === 10) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, `$1 $2 $3`);
  } else if (phone.length === 11) {
    return phone.replace(/(\d{4})(\d{3})(\d{4})/, `$1 $2 $3`);
  } else {
    // This is temporary, if there are other phone format, add more
    return phone;
  }
}
