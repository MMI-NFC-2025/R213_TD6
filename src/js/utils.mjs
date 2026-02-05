export function formatDate (date) {
    // Formater la date en français
    const options = { weekday: 'longx', year: 'numeric', month: 'long', day: 'numeric' };
    const DateString = new Date(date).toLocaleDateString('fr-FR', options);
    return DateString;
}