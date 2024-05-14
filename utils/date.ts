export function formatDate (dateString?: Date | string) {
  if (!dateString) {
    return ''
  }
  return new Date(dateString).toLocaleDateString()
}